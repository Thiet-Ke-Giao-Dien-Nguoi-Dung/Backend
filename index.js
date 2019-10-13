const express = require("express");
const config = require("config");
const port = config.get("port");
const db = require("./models/index");

const app = express();


db.sequelize
    .sync()
    .then(() => {
        console.log("Connect db oki");
        app.listen(port, (err) => {
            if (!err) {
                console.log(`Server is running on ${port}`)
            }
        });
    })
    .catch(
        e => {
            console.log("Can't connect db: ", e.message);
            process.exit(e)
        }
    );



