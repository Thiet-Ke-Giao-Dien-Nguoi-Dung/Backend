const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyRestaurant = require("../middleware/verifyRestaurant");
const uploadImage = require("../middleware/uploadImage");
const UserController = require("../controller/WebApp/user.controller");
const RestaurantController = require("../controller/WebApp/restaurant.controller");
const EmployeesController = require("../controller/WebApp/employees.controller");
const ItemController = require("../controller/WebApp/item.controller");
const OrderController = require("../controller/WebApp/order.controller");

router.get("/ping", (req, res) => {
    res.send("pong")
});
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.put("/users/passwords", verifyAdmin, UserController.changePassword);


router.get("/restaurants", verifyAdmin, RestaurantController.getRestaurants);
//router.post("/restaurants", verifyAdmin, RestaurantController.createRestaurant);
router.put("/restaurants/:id_restaurant", verifyAdmin, verifyRestaurant, RestaurantController.updateRestaurant);

router.get("/restaurants/:id_restaurant/employees", verifyAdmin, verifyRestaurant, EmployeesController.getEmployees);
router.post("/restaurants/:id_restaurant/employees", verifyAdmin, verifyRestaurant, EmployeesController.addEmployees);
router.delete("/restaurants/:id_restaurant/employees/:id_employees", verifyAdmin, verifyRestaurant, EmployeesController.deleteEmployees);
router.put("/restaurants/:id_restaurant/employees/:id_employees", verifyAdmin, verifyRestaurant, EmployeesController.updateEmployees);

router.get("/restaurants/:id_restaurant/categories", verifyAdmin, verifyRestaurant, RestaurantController.getCategories);
router.post("/restaurants/:id_restaurant/categories", verifyAdmin, verifyRestaurant, RestaurantController.createCategory);
router.put("/restaurants/:id_restaurant/categories/:id_category", verifyAdmin, verifyRestaurant, RestaurantController.updateCategory);
router.delete("/restaurants/:id_restaurant/categories/:id_category", verifyAdmin, verifyRestaurant, RestaurantController.deleteCategory);
router.get("/restaurants/:id_restaurant/revenues", verifyAdmin, verifyRestaurant, RestaurantController.getRevenue);
router.get("/restaurants/:id_restaurant/statistic", verifyAdmin, verifyRestaurant, RestaurantController.statisticItemInRestaurant);

router.get("/restaurants/:id_restaurant/items", verifyAdmin, verifyRestaurant, ItemController.getItems);
router.post("/restaurants/:id_restaurant/items", verifyAdmin, verifyRestaurant, uploadImage, ItemController.createItem);
router.put("/restaurants/:id_restaurant/items/:id_item", verifyAdmin, verifyRestaurant, ItemController.updateItem);

router.get("/restaurants/:id_restaurant/orders", verifyAdmin, verifyRestaurant, OrderController.getOrders);
router.get("/restaurants/:id_restaurant/orders/:id_order", verifyAdmin, verifyRestaurant, OrderController.getOrder);
router.get("/restaurants/:id_restaurant/orders/:id_order/print", verifyAdmin, verifyRestaurant, OrderController.createBillForPrint);
router.put("/restaurants/:id_restaurant/orders/:id_order/status", verifyAdmin, verifyRestaurant, OrderController.changeStatusOfOrder);


module.exports = router;