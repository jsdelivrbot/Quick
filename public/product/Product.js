(function() {
  'use strict';

  angular.module('products')
  .factory('Product', Product);

  function Product() {
    return Product;

    function Product(id, name, price, businessID, specifiedID, options, description, timestamp) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.businessID = businessID;
      this.specifiedID = specifiedID;
      this.options = options;
      this.description = description;
      this.timestamp = timestamp;
    };
  }
})();