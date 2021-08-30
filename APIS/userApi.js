//create mini exp app
const express = require("express")
const userApiObj = express.Router()
const expressAsyncHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

//body parser middleware
userApiObj.use(express.json())

let userCollection;
//get userCollection obj
userApiObj.use((req, res, next) => {
    userCollection = req.app.get("userCollection")
    next()
})

//user registration
userApiObj.post("/register", expressAsyncHandler(async (req, res) => {

    //get user from req.body
    let newUser = req.body;

    //check for duplicate user
    let user = await userCollection.findOne({ username: newUser.username })
    //if user existed, send res as "user existed"
    if (user !== undefined) {
        res.send({ message: "user existed" })
    }
    //else hash password
    else {
        //hash pw
        let hashedPassword = await bcryptjs.hash(newUser.password, 6)
        //replace plain pw wuth has pw
        newUser.password = hashedPassword
        //insert userObj to usercollection
        await userCollection.insertOne(newUser)
        //send res
        res.send({ message: "success" })

    }



}))


//user login
userApiObj.post('/login', expressAsyncHandler(async (req, res) => {

    //get user credetials obj
    let userCredentialsObj = req.body;
    //find user by username
    let user = await userCollection.findOne({ username: userCredentialsObj.username })
    //if user is not there
    if (user === undefined) {
        res.send({ message: "Invalid username" })
    }
    //if user found
    else {
        //compare passwords
        let status = await bcryptjs.compare(userCredentialsObj.password, user.password)
        //if not equal
        if (status === false) {
            res.send({ message: "Invalid password" })
        }
        //if status is true
        else {
            //create and send token
            let signedToken = await jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: 3000 })
            //send token in res
            res.send({ message: "success", token: signedToken, user: user })
        }

    }

}))






//export
module.exports = userApiObj