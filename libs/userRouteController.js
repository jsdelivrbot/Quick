'use strict';

var 
  util        = require('./util'),
  parser      = require('./requestParser'),
  errors      = require('./errors'),
  tk          = require('./token'),
  User        = require('./User'),
  hash        = require('./hash');

var controller = module.exports;

// Expected requests.
var expectedRequests = {
  POST: {
    email: util.isValidString,
    password: util.isValidString,
    firstname: util.isValidString,
    lastname: util.isValidString
  }
};

/**
 * Handles a POST request on the /user endpoint.
 * 
 * @param {req} req - The request.
 * @param {function(err, token)} cb - Callback function.
 */
controller.handlePost = function(req, cb) {
  var user = req.body.user || null;
  if (!user) {
    return cb(errors.noObjectFound('user'));
  }
  
  // Check valid request.
  parser.validProperties(expectedRequests.POST, user, function(err) {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }

    var u = new User();
    u.email = user.email;
    u.password = hash.hashPassword(user.password).hash; // hash password
    u.firstname = user.firstname;
    u.lastname = user.lastname;
    u.address = user.address;
    u.contactNumber = user.contactNumber;

    u.insert(function(err) {
      if (err) {
        return cb(errors.serverError());
      }
      // Delete password so not attached to token.
      delete u.password;
      // Genearate and pass token.
      var token = tk.generateToken(u);
      return cb(null, token);
    });
  });
};

