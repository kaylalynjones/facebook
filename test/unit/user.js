/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'facebook-test';

describe('User', function(){
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
    it('should create a new User object', function(){
      var obj = {
          email:'bob2aol.com',
          visible:'public',
          photo:'photo url',
          tagline:'Neato!',
          facebook:'facebook@fb.com',
          twitter:'iamontwitter@tw.com'
        },
        u = new User(obj);
      expect(u).to.be.instanceof(User);
    });
  });

  describe('#save', function(){
    it('should save a user', function(){
      var u = new User(),
          obj = {x:3, visible:'public', foo:'bar'};

      u.baz = 'bim';
      u.save(obj, function(err, user){
        expect(user.isVisible).to.be.true;
        expect(user.foo).to.equal('bar');
        expect(user.baz).to.equal('bim');
      });
    });
  });

  describe('.find', function(){
    it('should find all public users', function(done){
      User.find({isVisible:true},function(err, users){
        expect(users).to.have.length(3);
        done();
      });
    });
  });

  describe('#send', function(){
    it('should send a text message to a user', function(done){
      User.findById('000000000000000000000001', function(err, sender){
        User.findById('000000000000000000000002', function(err, receiver){
          sender.send(receiver, {mtype:'text', message:'yo'}, function(err, response){
            expect(response.sid).to.be.ok;
            done();
          });
        });
      });
    });
    it('should send an email message to a user', function(done){
      User.findById('000000000000000000000001', function(err, sender){
        User.findById('000000000000000000000004', function(err, receiver){
          sender.send(receiver, {mtype:'email', message:'yo'}, function(err, response){
            expect(response.id).to.be.ok;
            done();
          });
        });
      });
    });
  });

});//end

