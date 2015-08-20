var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Q        = require('q'),
    SALT_WORK_FACTOR  = 10;


var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  avatar: {
    type: String,
    default: ''
  },

  password: {
    type: String,
    required: true
  },
  
  salt: String,

  currentStreak: {
    type: Number,
    default: 0
  },

  longestStreak: {
    type: Number,
    default: 0
  },

  totalWins: {
    type: Number,
    default: 0
  },

  totalPoints: {
    type: Number,
    default: 0
  }
});

UserSchema.methods.comparePasswords = function (candidatePassword) {
  var defer = Q.defer();
  var savedPassword = this.password;
  bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(isMatch);
    }
  });
  return defer.promise;
};

// Constains returns false, or the index of the business
UserSchema.methods.contains = function (business){
};

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('users', UserSchema);
