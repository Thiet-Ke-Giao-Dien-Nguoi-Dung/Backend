const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const uploadImage = require("../middleware/uploadImage");
const UserController = require("../controller/WebApp/user.controller");
const RestaurantController = require("../controller/WebApp/restaurant.controller");
const EmployeesController = require("../controller/WebApp/employees.controller");
const ItemController = require("../controller/WebApp/item.controller");

router.get("/ping", (req, res) => {
    res.send("pong")
});
router.post("/login", UserController.login);
router.post("/register", UserController.register);

router.get("/restaurants", verifyAdmin, RestaurantController.getRestaurants);
//router.post("/restaurants", verifyAdmin, RestaurantController.createRestaurant);
router.put("/restaurants/:id_restaurant", verifyAdmin, RestaurantController.updateRestaurant);

router.get("/restaurants/:id_restaurant/employees", verifyAdmin, EmployeesController.getEmployees);
router.post("/restaurants/:id_restaurant/employees", verifyAdmin, EmployeesController.addEmployees);
router.delete("/restaurants/:id_restaurant/employees/:id_employees", verifyAdmin, EmployeesController.deleteEmployees);
router.put("/restaurants/:id_restaurant/employees/:id_employees", verifyAdmin, EmployeesController.updateEmployees);


router.get("/restaurants/:id_restaurant/items", verifyAdmin, ItemController.getItems);
router.post("/restaurants/:id_restaurant/items", verifyAdmin, uploadImage, ItemController.createItem);
router.put("/restaurants/:id_restaurant/items/:id_item", verifyAdmin, ItemController.updateItem);

module.exports = router;