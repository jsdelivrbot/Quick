'use strict';

var 
  util        = require('../util'),
  parser      = require('../requestParser'),
  errors      = require('../errors'),
  Product     = require('../Product');


var controller = module.exports;


/**
 * Templates for what expected requests for /product endpoint
 * should look like. 
 */
var expectedRequests = {
  POST: {
    name: util.isValidString,
    description: util.isValidString,
    price: util.isValidString,
  },
  PATCH: {
    id: util.isValidString,
    updateFields: util.isArray
  }
};


/**
 * Handles a POST request on the /product endpoint.
 * 
 * @param {req} req - The request.
 * @param {function(err)} cb - Callback function.
 */
controller.handlePost = function(req, cb) {
  // Get the businessID from the decoded token.
  var businessID = req.decoded.id;
  if (!businessID) {
    return cb(errors.notAuthorized());
  }

  // Check the request contains a product.
  var product = req.body.product || null;
  if (!product) {
    return cb(errors.noObjectFound());
  }

  // Check valid request.
  parser.validProperties(expectedRequests.POST, product, function(err) {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    };
    var p = new Product();
    p.name = product.name;
    p.description = product.description;
    p.price = product.price;
    p.businessID = businessID;
    // Insert into database.
    p.insert(function (err) {
      if (err) { 
        return cb(errors.serverError()); 
      }
      // Success.
      return cb(null);
    });
  }); 
};

/**
 * Handles a GET request on the /product endpoint.
 * 
 * @param {req} req - The request.
 * @param {function(err, products)} cb - Callback function.
 */
controller.handleGet = function(req, cb) {
  // Get the id from the decoded token.
  var businessID = req.decoded.id;
  if (!businessID) {
    return cb(errors.notAuthorized());
  }

  var product = new Product();
  product.getAllProductsForBusiness(businessID, function(err, products) {
    if (err) {
      return cb(errors.serverError());
    }
    return cb(null, products);
  });
};


/**
 * Handles a PATCH request on the /product endpoint.
 * 
 * @param {req} req - The request.
 * @param {function(err)} cb - Callback function.
 */
controller.handlePatch = function(req, cb) {
  var product = req.body.updatedProduct || null;
  if (!product) {
    return cb(errors.noObjectFound('updatedProduct'));
  }

  // Check that the correct properties are attached to the
  // product to update.
  parser.validProperties(expectedRequests.PATCH, product, function(err) {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }
    var p = new Product();
    p.id = product.id;
    // Update the product with the update fields from the request.
    p.update(product.updateFields, function(err) {
      if (err) {
        return cb(errors.serverError());
      }
      return cb(null);
    });
  });

};

/**
 * Handles a DELETE request on the /product/:productID endpoint.
 * 
 * @param {req} req - The request.
 * @param {function(err)} cb - Callback function.
 */
controller.handleDelete = function(req, cb) {
  // Get the product id from the request url.
  var productID = req.params.productID || null;
  if (!productID) {
    return cb(errors.missingParam('productID'));
  }
  // Delete the product.
  var product = new Product();
  product.id = productID;
  product.remove(function(err) {
    if (err) {
      return cb(errors.serverError());
    }
    return cb(null);
  });
};