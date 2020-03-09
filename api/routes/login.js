var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var mongo = require("mongodb");
var MongoClient = mongo.MongoClient;
var my_mongo_url = "mongodb+srv://admin_ucla:wxy00580@johnnycluster-ticrl.mongodb.net/test?retryWrites=true&w=majority"

// generate a session key
// current method: username + password + time + random array, use crypto hash function
function generateKey(cred = {id: "", passwd: ""}) {
    let d = new Date(); // get date
    let rand_buf = crypto.randomBytes(10);
    
    // join seed string
    let seed = cred.id + cred.passwd + d.getTime().toString() + rand_buf.toString("hex");
    // hash
    let newHash = crypto.createHash("sha256").update(seed).digest("hex");
    return newHash;
}


// take credential, then hash it, used both for registering and logging in
function hashCredential(cred = {id: "", passwd: ""}) {
    let seed = cred.id + cred.passwd;
    let newHash = crypto.createHash("sha256").update(seed).digest("hex");
    return newHash;
}


// check credential and return an object
// TODO: set up procedure to check credential by hash
function checkCredential(cred = {id: "", passwd: ""}, res) {
    let db = new MongoClient(my_mongo_url, {useNewUrlParser: true});
    let result = {
        valid: "no",
        key: "",
    }
    let ret = 0;

    db.connect((err) => {
        if (err) {
            db.close();
            console.log("db connection error");
            throw(err);
        }
        const collection = db.db("bookkeeper").collection("user_test");
        collection.find({username: cred.id}).toArray(
            (err, docs) => {
                if (err) {
                    db.close();
                    console.log("collection find error");
                    throw(err);
                }
                if (docs.length === 0) { // no such user
                    console.log("no user found");
                } 
                else if (docs.length === 1) { // user exists
                    if (hashCredential(cred) == docs[0].hashcode) { // right credential
                        result.valid = "yes";
                        result.key = generateKey(cred);
                        
                        // update session information
                        let d = new Date();
                        collection.updateOne({username: cred.id}, 
                            {$set: {
                                    sessionkey: result.key,
                                    last_active: d.getTime(),
                                }})
                            .then((res, err) => {
                                db.close();
                                if (err) {
                                    console.log(err.message);
                                    throw(err);
                                }
                            });
                    }
                }
                else { // duplicate user error
                    console.log("duplicate user detected: " + id);
                    db.close();
                }
                res.end(JSON.stringify(result));
            });
    });
}


router.post("/", function(req, res) {
    const id = req.body.id;
    const password = req.body.passwd;

    console.log("ID: " + id+ " PASSWORD: "+ password);

    // check credentials
    checkCredential({id: id, passwd: password}, res);
})

module.exports = router;
