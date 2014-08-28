'use strict';

var bcrypt  = require('bcrypt'),
    _       = require('lodash'),
    Mailgun = require('mailgun-js'),
    Mongo   = require('mongodb');

function User(){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(User.prototype, obj));
  });
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    User.collection.save(o, cb);
  });
};

User.authenticate = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(user);
  });
};

User.prototype.save = function(obj, cb){
  var properties = Object.keys(obj),
      self = this;
  properties.forEach(function(property){
    switch(property){
      case 'visible':
        self.isVisible = obj[property] === 'public';
        break;
      default:
        self[property] = obj[property];
    }
  });
  User.collection.save(this, cb);
};

User.find = function(query, cb){
  User.collection.find(query).toArray(cb);
};

User.findOne = function(query, cb){
  User.collection.findOne(query, cb);
};

User.prototype.send = function(receiver, obj, cb){
  switch(obj.mtype){
    case 'text':
      sendText(receiver.phone, obj.message, cb);
      break;
    case 'email':
      sendEmail(this.email, receiver.email, 'Message from Fake Facebook', obj.message, cb);
      break;
    case 'internal':
  }
};

module.exports = User;

//private fns
  function sendText(to, body, cb){
    if(!to){return cb();}

    var accountSid = process.env.TWSID,
        authToken  = process.env.TWTOK,
        from       = process.env.FROM,
        client     = require('twilio')(accountSid, authToken);

    client.messages.create({to:to, from:from, body:body}, cb);
  }

  function sendEmail(from, to, subject, message, cb){
    var api_key = process.env.MGAPI,
        domain = process.env.MGDOMAIN,
        mailgun = new Mailgun({apiKey: api_key, domain: domain}),
        data = {
          from: from,
          to: to,
          subject: subject,
          text: message
        };
    mailgun.messages().send(data, cb);
  };
