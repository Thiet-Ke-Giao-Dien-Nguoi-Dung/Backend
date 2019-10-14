const express = require("express");
const router = express.Router();
const middleware = require("../middleware/verifyAdmin");
const UserController = require("../controller/WebApp/user.controller");
const RestaurantController = require("../controller/WebApp/restaurant.controller");
const EmployeesController = require("../controller/WebApp/employees.controller");

router.get("/ping", (req, res) => {
    res.send("pong")
});
router.post("/login", UserController.login);
router.post("/register", UserController.register);

router.get("/restaurants", middleware, RestaurantController.getRestaurants);
router.post("/restaurants", middleware, RestaurantController.createRestaurant);
router.put("/restaurants/:id_restaurant", middleware, RestaurantController.updateRestaurant);

router.get("/restaurants/:id_restaurant/employees", EmployeesController.getEmployees);
router.post("/restaurants/:id_restaurant/employees", EmployeesController.addEmployees);
router.delete("/restaurants/:id_restaurant/employees/:id_employees", EmployeesController.deleteEmployees);
router.put("/restaurants/:id_restaurant/employees/:id_employees", EmployeesController.updateEmployees);



module.exports = router;