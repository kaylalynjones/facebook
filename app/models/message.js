'use strict';

function Message(sender, receiver, message){
  this.receiverId = receiver;
  this.userId = sender;
  this.message = message;
  this.date = new Date();
  this.isRead = false;
}

Object.defineProperty(Message, 'collection', {
  get: function(){return global.mongodb.collection('messages');}
});

Message.create = function(sender, receiver, message, cb){
  message = new Message(sender, receiver, message);
  Message.collection.save(message, cb);
};


module.exports = Message;
