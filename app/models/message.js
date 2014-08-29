'use strict';

var _ = require('lodash'),
    Mongo = require('mongodb');

function Message(sender, receiver, body){
  this.receiverId = receiver;
  this.sender = sender;
  this.body = body;
  this.date = new Date();
  this.isRead = false;
}

Object.defineProperty(Message, 'collection', {
  get: function(){return global.mongodb.collection('messages');}
});


Message.create = function(sender, receiver, body, cb){
  var message = new Message(sender, receiver, body);
  Message.collection.save(message, cb);
};

Message.findAllByReceiverId = function(id, cb){
  Message.collection.find({receiverId:id}).toArray(function(err, messages){
    messages = messages.map(function(message){
      return _.create(message.prototype, message);
    });
    cb(messages);
  });
};

Message.findById = function(id, cb){
  var $id = Mongo.ObjectID(id);
  Message.collection.findOne({_id: $id}, function(err, message){
    message.isRead = true;
    Message.collection.save(message, function(){
      cb(message);
    });
  });
};

Message.find = function(query, cb){
  Message.collection.find(query).toArray(function(err, messages){
    cb(messages);
  });
};

module.exports = Message;
