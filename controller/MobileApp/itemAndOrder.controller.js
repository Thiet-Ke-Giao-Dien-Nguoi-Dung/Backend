const db = require("../../models/index");
const Employees = db.Employees;
const Item = db.Item;
const response = require("../../util/response");
const createUrl = require("../../util/s3/createUrl");
const moment = require("moment");

async function getItems(req, res){
    let {id_restaurant} = req.params;
    // let {id_category} = req.query;
    try{
        let employees = await Employees.findOne({
            where: {
                id_employees: req.tokenData.id_employees,
                id_restaurant: id_restaurant
            }
        });
        if(!employees){
            throw new Error("Bạn không là nhân viên của quán ăn này.")
        }
        const constrains = {
            id_restaurant: employees.dataValues.id_restaurant
        };
        // if(id_category){
        //     constrains.id_category = id_category;
        // }
        let items = await Item.findAll({
            where: constrains,
            order: [
                ["name", 'ASC']
            ]
        });
        items = items.map(e => e.dataValues);
        for(let e of items){
            e.image = await createUrl(e.image)
        }
        res.json(response.buildSuccess({items}))
    }
    catch(err){
        console.log("getItems: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

async function getTables(req, res){
    let {id_restaurant} = req.params;
    try{
        let employees = await Employees.findOne({
            where: {
                id_employees: req.tokenData.id_employees,
                id_restaurant: id_restaurant
            }
        });
        if(!employees){
            throw new Error("Bạn không là nhân viên của quán ăn này.")
        }
        let tables = await db.Table.findAll({
            where: {
                id_restaurant: id_restaurant
            }
        });
        return res.json(response.buildSuccess({tables}))
    }
    catch(err){
        console.log("getTables: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

async function getCategories(req, res){
    let {id_restaurant} = req.params;
    try{
        let categories = await db.Category.findAll({
            where: {
                id_restaurant: id_restaurant
            },
            order: [
                ['name', 'ASC']
            ]
        });
        const data = {
            categories: categories || []
        };
        return res.json(response.buildSuccess(data))
    }catch (err) {
        console.log("getCategories: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

async function createOrder(req, res){
    try{
        let {items} = req.body;
        let {id_restaurant, id_table} = req.params;
        let order = await db.Order.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    {
                        status: "pending"
                    },
                    {
                        status: "doing"
                    }
                ],
                id_table: id_table
            }
        });
        if(order){
            throw new Error("Đơn hàng của bàn này chưa thực hiện xong.")
        }
        order = await db.Order.create({
            id_table: parseInt(id_table),
            create_time: moment(parseInt(Date.now())).format("YYYY/MM/DD"),
            update_time: Date.now(),
            status: "pending",
            id_restaurant: id_restaurant
        });
        for(let e of items){
           await db.OrderItem.create({
               quantity: e.quantity,
               id_order: order.dataValues.id_order,
               id_item: e.id_item
           })
        }
        await db.Table.update({
            is_ordered: true
        },{
            where: {
                id_table: id_table
            }
        });
        await req.io.sockets.emit("create_order_" + id_restaurant, {msg: "created new order."});
        return res.json(response.buildSuccess({}))
    }
    catch(err){
        console.log("createOrder: ", err.message);
        return res.json(response.buildFail(err))
    }
}

async function getOrderFromTable(req, res){
    try{
        let {id_restaurant, id_table} = req.params;
        let sql = "SELECT \n" +
            "    O.id_order,\n" +
            "    O.create_time,\n" +
            "    O.status,\n" +
            "    OI.quantity,\n" +
            "    I.name, I.image, \n" +
            "    I.price,\n" +
            "    O.id_restaurant,\n" +
            "    O.id_table\n" +
            "FROM\n" +
            "    `Order` O\n" +
            "        INNER JOIN\n" +
            "    OrderItem OI ON O.id_order = OI.id_order\n" +
            "        INNER JOIN\n" +
            "    Item I ON I.id_item = OI.id_item\n" +
            "WHERE\n" +
            "    is_payment = FALSE\n" +
            "        AND O.id_restaurant = :id_restaurant\n" +
            "        AND O.id_table = :id_table\n" +
            "    order by name ASC";
        let order = await db.sequelize.query(sql, {
            replacements: {
                id_table: id_table,
                id_restaurant: id_restaurant
            },
            type: db.sequelize.QueryTypes.SELECT
        });
        for(let e of order){
            e.image = await createUrl(e.image);
        }
        return res.json(response.buildSuccess((order)))
    }
    catch(err){
        console.log("getOrderFromTable", err.message);
        return res.json(response.buildFail(err))
    }
}

module.exports = {
    getItems,
    getTables,
    getCategories,
    createOrder,
    getOrderFromTable
};