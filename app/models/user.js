'use strict';

var bcrypt = require('bcrypt'),
    _      = require('lodash'),
    Mongo  = require('mongodb');

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
  console.log('this is obj:', obj, properties);
  properties.forEach(function(property){
    switch(property){
      case 'visible':
        self.isVisible = obj[property] === 'public';
        break;
      default:
        self[property] = obj[property];
    }
  });
  console.log('before save', this);
  User.collection.save(this, cb);
};


module.exports = User;

