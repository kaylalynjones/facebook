/* jshint expr:true */
/* global describe, it */

'use strict';

var expect    = require('chai').expect,
    Message   = require('../../app/models/message');

describe('Message', function(){
  describe('constructor', function(){
    it('should create a new Message object', function(){
      var obj = {
          to: 'bob@aol.com',
          from: 'kermit@aol.com',
          date: '8/28/2014',
          message: 'What is up with it Bob?'
        },
        m = new Message(obj);
      expect(m).to.be.instanceof(Message);
    });
  });
});//end

