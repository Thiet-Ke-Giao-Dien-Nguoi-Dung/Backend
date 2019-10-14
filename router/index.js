const express = require("express");
const router = express.Router();

router.use("/ma", require("./MobileApp"));
router.use("/wa", require("./WebApp"));


module.exports = router;