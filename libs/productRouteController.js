'use strict';

var 
  util        = require('./util'),
  requestBody = require('./requestBody'),
  Product     = require('./Product'),
  httpCodes   = require('./httpCodes');

var controller = module.exports;


var requestErrors = {
  noProductFound: function() {
    var error = new Erorr('No Product found in request body.');
    error.code = httpCodes.UNPROCESSABLE_ENTITY;
    return error; 
  },
  invalidProperties: function(missingAttribute=null) {
    var error = null;
    if (missingAttribute) {
      error = new Error('Missing attribute: "' + missingAttribute + '" in request');
    } else {
      error = new Error('Missing attribute in request');
    }
    error.code = httpCodes.UNPROCESSABLE_ENTITY;
    return error;
  },
  serverError: function() {
    var error = new Erorr('An error occurred with the server');
    error.code = httpCodes.INTERNAL_SERVER_ERROR;
    return error;
  },
  notAuthorized: function() {
    var error = new Error('Not authorized');
    erorr.code = httpCodes.UNAUTHORIZED;
    return error;
  }
};

/**
 * Templates for what expected requests should look like. 
 */
var expectedRequests = {
  POST: {
    name: util.isValidString,
    description: util.isValidString,
    price: util.isValidString,
  }
};


/**
 * Handles a POST request on the /product endpoint.
 * validates the request.
 * 
 * @param {req} req - The request.
 * @param {function(err)} cb - Callback function.
 */
controller.handlePost = function(req, cb) {
  // Get the businessID from the decoded token.
  var businessID = req.decoded.id;
  if (!businessID) {
    return cb(requestErrors.notAuthorized);
  }

  // Check the request contains a product.
  var product = req.body.product || null;
  if (!product) {
    return cb(requestErrors.noProductFound);
  }

  // Check valid request.
  requestBody.validProperties(expectedRequests.POST, product, function(err) {
    if (err) {
      return cb(requestErrors.invalidProperties(err.invalidProperty));
    };
    var p = new Product();
    p.name = product.name;
    p.description = product.description;
    p.price = product.price;
    p.businessID = businessID;
    // Insert into database.
    p.insert(function (err) {
      if (err) { 
        return cb(requestErrors.serverError()); 
      }
      return cb(null);
    });
  }); 
};






