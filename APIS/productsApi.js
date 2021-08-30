//create a route obj
const express = require("express")
const productApiObj = express.Router()
const expressAsyncHandler = require("express-async-handler")
const multerObj = require("./middlewares/addImage")
const checkToken = require("./middlewares/verifyToken")

//add body-parser middleware
productApiObj.use(express.json())
//get adminCollection
let productCollection;
productApiObj.use((req, res, next) => {
    productCollection = req.app.get("productCollection")
    next()
})


//add product
productApiObj.post("/addproduct", checkToken, multerObj.single('photo'), expressAsyncHandler(async (req, res) => {

    //get productObj
    const productObj = JSON.parse(req.body.productObj)
    //add image CDN link to produObj
    productObj.image = req.file.path;

    //save to productCollection
    await productCollection.insertOne(productObj)
    //send res
    res.send({ message: "New product created" })

}))




//get products
productApiObj.get("/getproducts", checkToken, expressAsyncHandler(async (req, res) => {

    let products = await productCollection.find().toArray()
    res.send({ message: "success", payload: products })
}))







//export
module.exports = productApiObj