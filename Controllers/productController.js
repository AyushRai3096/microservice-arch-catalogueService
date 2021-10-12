var mongoose = require('mongoose');
const productService = require('../dbServices/ProductService');
const errorMessages = require('../en');
const sendMessageToQueue = require('../helpers/sender');

exports.getAllProducts = (req, res, next) => {
    productService.getProductByOpts({})
        .then(products => {
            res.send(products);
        })
        .catch(err => {
            next(err);
        });
}

exports.addProduct = (req, res, next) => {
    var productName, description, price;
    
    productName = req.body.productName;
    description = req.body.description;
    price = req.body.price;

    if(!productName || !description || !price) {
        const error = new Error(errorMessages.MISSING_ARGS);
        error.statusCode = 400;
        error.message = errorMessages.MISSING_ARGS;
        next(error);
    } else {
        productService.createProduct({productName, description, price})
            .then(createdProduct => {
                sendMessageToQueue(`New product ${productName} added to database`);
                res.send(createdProduct);
            })
            .catch(err => {
                next(err);
            });
    }
}

exports.updateProduct = (req, res, next) => {
    var payload = req.body;
    var productId = req.params.id;
    var productName;
    //get the product
    return productService.getProductById(productId)
    .then(product => {
        if(!product) {
            const error = new Error(errorMessages.PRODUCT_NOT_FOUND);
            error.statusCode = 404;
            error.message = errorMessages.PRODUCT_NOT_FOUND;
            return next(error);
        }
        else {
            productName = product.name;
            return productService.updateProduct(productId, payload)
        }
    })
    .then(updatedProduct => {
        if(!updatedProduct) {
            next(updatedProduct)
        } else {
            sendMessageToQueue(`Product ${productName} updated`);
            res.send(updatedProduct);
        }
    })
    .catch(err => {
        next(err);
    });
}

exports.removeProduct = (req, res, next) => {
    var productId = req.params.id;
    //get the product
    return productService.getProductById(productId)
    .then(product => {
        if(!product) {
            const error = new Error(errorMessages.PRODUCT_NOT_FOUND);
            error.statusCode = 404;
            error.message = errorMessages.PRODUCT_NOT_FOUND;
            return next(error);
        }
        else {
            return productService.removeProduct(productId)
        }
    })
    .then(deletedProduct => {
        if(!deletedProduct) {
            next(deletedProduct)
        } else {
            sendMessageToQueue(`Product ${deletedProduct.name} deleted`);
            res.send(deletedProduct);
        }
    })
    .catch(err => {
        next(err);
    });
}