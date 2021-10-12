const express = require('express')
const auth = require('../Middlewares/checkAuthStatus');

//import controllers
const productController = require('../Controllers/productController');

const productRouter = express.Router();

//the auth middleware is used to validate the auth status of user
//it sends request to separate microservice dedicated to authetication purposes only
productRouter.get("/", auth, productController.getAllProducts)
productRouter.post("/", auth, productController.addProduct)
productRouter.put("/:id", auth, productController.updateProduct)
productRouter.delete("/:id", auth, productController.removeProduct)

module.exports = productRouter;