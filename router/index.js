const express = require("express");
const router = express.Router();

router.use("/mp", require("./MobileApp"));
router.use("/wa", require("./WebApp"));


module.exports = router;