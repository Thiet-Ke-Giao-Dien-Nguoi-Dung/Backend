const express = require("express");
const router = express.Router();
const Employees = require("../controller/MobileApp/employees.controller");
const VerifyEmployees = require("../middleware/verifyEmployees");

router.get("/ping", (req, res) => {
   res.send("pong")
});
router.get("/restaurants/:id_restaurant/items", VerifyEmployees, Employees.getItems);
router.get("/restaurants/:id_restaurant/tables", VerifyEmployees, Employees.getTables);
router.post("/login", Employees.login);


module.exports = router;