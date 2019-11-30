const express = require("express");
const config = require("config");
const port = config.get("port");
const morgan = require("morgan");
const BodyParser = require("body-parser");
const cors = require("cors");
const SocketIO = require("socket.io");

const db = require("./models/index");
const app = express();
app.use('/static', express.static('./bill'));
app.use(cors());

const server = require("http").createServer(app);
const io = SocketIO(server);
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use(morgan('tiny'));
app.use(BodyParser.urlencoded({extended: false}));
app.use(BodyParser.json());
app.use("/api", require("./router/index"));
db.sequelize.sync({
        force: false
    })
    .then(() => {
        console.log("Connect db oki....");
        server.listen(port, (err) => {
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



