const express = require("express");
const router = express.Router();
const Employees = require("../controller/MobileApp/employees.controller");
const ItemAndOrder = require("../controller/MobileApp/itemAndOrder.controller");
const VerifyEmployees = require("../middleware/verifyEmployees");

router.get("/ping", (req, res) => {
   res.send("pong")
});

router.get("/restaurants/:id_restaurant/items", VerifyEmployees, ItemAndOrder.getItems);
router.get("/restaurants/:id_restaurant/tables", VerifyEmployees, ItemAndOrder.getTables);
router.get("/restaurants/:id_restaurant/categories", VerifyEmployees, ItemAndOrder.getCategories);
router.post("/restaurants/:id_restaurant/tables/:id_table/orders", VerifyEmployees, ItemAndOrder.createOrder);
router.get("/restaurants/:id_restaurant/tables/:id_table/orders", VerifyEmployees, ItemAndOrder.getOrderFromTable);


router.post("/login", Employees.login);
router.put("/password", VerifyEmployees, Employees.changePassword);


module.exports = router;