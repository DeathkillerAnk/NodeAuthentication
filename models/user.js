var mongoose = require("mongoose"),
    //passportLocalMongoose = require("passport-local-mongoose");
    bcrypt = require("bcryptjs");

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    birthday: {
        type: Date
    },
    gender: {
        type: String
    },
    phone: {
        type: Number
    },
    category: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        //console.log(callback());
        newUser.save(callback);
    });
  });
}

//login helper
module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    
    User.findOne(query, callback);
  }
  
  module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
  }
  
  module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
    });
}
/*var userSchema = mongoose.Schema({
    
    birthday: Number,
    gender: String,
    username: String,
    phone: Number,
    password: String,
    category: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema); */


