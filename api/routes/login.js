var express = require('express');
var router = express.Router();

function checkCredential(id, passwd) {
    if (id === "wan" && passwd === "3459") {
        return "yes";
    }
    else {
        return "no";
    }
}

router.post("/", function(req, res) {
    const id = req.body.id;
    const password = req.body.passwd;

    console.log("ID: " + id+ " PASSWORD: "+ password);

    // check credentials
    const result = checkCredential(id, password);
    res.end(result);
})

module.exports = router;
