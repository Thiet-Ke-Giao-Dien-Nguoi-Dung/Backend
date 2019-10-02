const express = require("express");
const config = require("config");
const port = config.get("port");


const app = express();


app.listen(port, (err) => {
    if(!err){
        console.log(`Server is running on ${port}`)
    }
});


