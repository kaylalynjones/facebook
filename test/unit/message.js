/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Message   = require('../../app/models/message'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'facebook-test';

describe('Message', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });
  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });
  describe('constructor', function(){
    it('should create a new Message object', function(){
      var obj = {
          to: 'bob@aol.com',
          from: 'kermit@aol.com',
          date: '8/28/2014',
          body: 'What is up with it Bob?'
        },
        m = new Message(obj);
      expect(m).to.be.instanceof(Message);
    });
  });
  describe('.create', function(){
    it('should create and save a message', function(done){
      var receiver = 'bob@aol.com',
          sender = { 
            email: 'kermit@aol.com',
            name: 'Kermit'
          },
          message = 'What is up with it Bob?';
      Message.create(sender, receiver, message, function(err, message){
        expect(message).to.be.okay;
        expect(message).to.be.instanceof(Message);
        done();
      });
    });
  });
  describe('.findAllByReceiverId', function(){
    it('should find all the messages a user has', function(done){
      var id = Mongo.ObjectID('000000000000000000000001');
      Message.findAllByReceiverId(id, function(messages){
        expect(messages).to.have.length(2);
        done();
      });
    });
  });
  describe('.findById', function(){
    it('should find a single message', function(done){
      var mId = 'a00000000000000000000001';
      Message.findById(mId, function(message){
        expect(message.body).to.equal('What is up?');
        done();
      });
    });
  });

});//end


