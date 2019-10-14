const express = require("express");
const config = require("config");
const port = config.get("port");
const morgan = require("morgan");
const BodyParser = require("body-parser");
const cors = require("cors");

const db = require("./models/index");

const app = express();
app.use(cors());
app.use(morgan('tiny'));
app.use(BodyParser.urlencoded({extended: false}));
app.use(BodyParser.json());
app.use("/api", require("./router/index"));

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



