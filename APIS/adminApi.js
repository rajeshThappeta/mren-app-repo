//Create a route
const express = require("express")
const adminApiObj = express.Router()
const expressAsyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

//add body-parser middleware
adminApiObj.use(express.json())
//get adminCollection
let adminCollection;
adminApiObj.use((req, res, next) => {
    adminCollection = req.app.get("adminCollection")
    next()
})


//admin login route
adminApiObj.post('/login', expressAsyncHandler(async (req, res) => {


    //get user credetials obj
    let adminCredentialsObj = req.body;
    console.log(adminCredentialsObj)
    //find user by username
    let user = await adminCollection.findOne({ username: adminCredentialsObj.username })
    //if user is not there
    if (user === undefined) {
        res.send({ message: "Invalid username" })
    }
    //if user found
    else {
        //compare passwords
        // let status = await bcryptjs.compare(adminCredentialsObj.password, user.password)
        let status = adminCredentialsObj.password === user.password
        //if not equal
        if (status === false) {
            res.send({ message: "Invalid password" })
        }
        //if status is true
        else {
            //create and send token
            let signedToken = await jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: 10 })
            //send token in res
            res.send({ message: "success", token: signedToken, user: user })
        }

    }

}))



module.exports = adminApiObj;