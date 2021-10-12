const productSchema = require('../models/productModel');
const _ = require('lodash') 

exports.getProductById = (productId) => {
    return productSchema.findById(productId);
}

exports.getProductByOpts = (opts) => {
    var query = {};

    if(_.has(opts, 'productId')) {
        query._id = opts.productId;
    }

    return productSchema.find(query);
}

exports.createProduct = (details) => {
    var newProduct = new productSchema({ 
        name: details.productName, 
        description: details.description, 
        price: details.price 
    });
    
    return newProduct.save();
}

exports.updateProduct = (productId, updateSet) => {
    var filter = {
        _id: productId
    }

    return productSchema.findOneAndUpdate(filter, updateSet, {new: true});
}

exports.removeProduct = (productId) => {
    var filter = {
        _id: productId
    }
    return productSchema.findOneAndRemove(filter);
}
