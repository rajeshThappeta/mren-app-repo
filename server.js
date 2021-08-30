//create express app
const express = require("express")
const app = express();
//configure dotenv
//the config() provides all env variables in process.env
require("dotenv").config()
//import path module
const path = require("path")

//connect build of react app with express
app.use(express.static(path.join(__dirname, './client/build')))

//import APIS objects
const userApiObj = require("./APIS/userApi")
const adminApiObj = require("./APIS/adminApi")
const productApiObj = require("./APIS/productsApi")

//use userApiObj when path starts with /users
app.use("/users", userApiObj)
app.use("/admin", adminApiObj)
app.use("/products", productApiObj)

//dealing with unmatched paths
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build', 'index.html'))
})

//import mongodb module
const mongoClient = require("mongodb").MongoClient;

//get dtabase url
const dbUrl = process.env.DATABASE_URL;


//connect
mongoClient.connect(dbUrl, (err, client) => {
    if (err) {
        console.log("err in db connect", err)
    }
    else {
        //get obj of database
        let databaseObject = client.db('cdb21dx017db')
        //get objects of collctions
        let userCollection = databaseObject.collection("usercollection")
        let adminCollection = databaseObject.collection("admincollection")
        let cartCollection = databaseObject.collection("cartcollection")
        let productCollection = databaseObject.collection("productcollection")

        //set to app object
        app.set("userCollection", userCollection)
        app.set("adminCollection", adminCollection)
        app.set("cartCollection", cartCollection)
        app.set("productCollection", productCollection)

        console.log("Connected to DB")
    }
})



//error handling middleware
app.use((err, req, res, next) => {
    res.send({ message: "Error occurred", reason: err.message })
})




//assign port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))