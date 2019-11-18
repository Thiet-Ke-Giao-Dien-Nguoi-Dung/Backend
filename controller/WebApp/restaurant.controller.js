const db = require("../../models/index");
const Restaurant = db.Restaurant;
const Category = db.Category;
const response = require("../../util/response");
const createUrl = require("../../util/s3/createUrl");

async function getRestaurants(req, res) {
    try {
        let restaurants = await db.Restaurant.findOne({
            where: {
                id_user: req.tokenData.id_user
            }
        });
        let data = {restaurants};
        return res.json(response.buildSuccess(data))
    } catch (err) {
        console.log("getRestaurants: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

// async function createRestaurant(req, res){
//     try{
//         let {name, address, table_count} = req.body;
//         if(!name || !address){
//             throw new Error("Something missing")
//         }
//         let restaurant = await db.Restaurant.create({
//             name: name,
//             address: address, id_user: req.tokenData.id_user
//         });
//         for(let i=0; i<table_count; i++){
//             await db.Table.create({
//                 location: `Bàn số ${i+1}`,
//                 id_restaurant: restaurant.dataValues.id_restaurant
//             })
//         }
//         return res.json(response.buildSuccess({}))
//     }
//     catch(err){
//         console.log("createRestaurant: ", err.message );
//         return res.json(response.buildFail(err.message))
//     }
// }

async function updateRestaurant(req, res) {
    try {
        let {id_restaurant} = req.params;
        if (req.body.table_count) {
            let tables = await db.Table.findAll({
                where: {
                    id_restaurant: id_restaurant
                }
            });
            if (tables.length < req.body.table_count) {
                for (let i = tables.length; i < req.body.table_count; i++) {
                    await db.Table.create({
                        location: `Bàn số ${i + 1}`,
                        id_restaurant: id_restaurant
                    })
                }
            } else if (tables.length > req.body.table_count) {
                for (let i = req.body.table_count; i < tables.length; i++) {
                    await db.Table.destroy({
                        where: {
                            id_table: tables[i].dataValues.id_table
                        }
                    })
                }
            }
        }
        await db.Restaurant.update(req.body, {
            where: {
                id_restaurant: id_restaurant
            }
        });

        return res.json(response.buildSuccess({}))
    } catch (err) {
        console.log("updateRestaurant: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

async function createCategory(req, res) {
    let {category_name} = req.body;
    let {id_restaurant} = req.params;
    try {
        let category = await Category.findOne({
            where: {
                name: category_name,
                id_restaurant: id_restaurant
            }
        });
        if (category) {
            throw new Error("Danh mục này đã tồn tại.")
        }
        await Category.create({
            name: category_name,
            id_restaurant: id_restaurant
        });
        return res.json(response.buildSuccess({}))
    } catch (err) {
        console.log("createCategory: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

async function getCategories(req, res) {
    let {id_restaurant} = req.params;
    try {
        let categories = await Category.findAll({
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
    } catch (err) {
        console.log("getCategories: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

async function updateCategory(req, res) {
    let {category_name} = req.body;
    let {id_restaurant, id_category} = req.params;
    try {
        let category = await Category.findOne({
            where: {
                id_restaurant: id_restaurant,
                id_category: id_category
            }
        });
        if (!category) {
            throw new Error("Danh mục không tồn tại.")
        }
        await Category.update({
            name: category_name
        }, {
            where: {
                id_category: id_category
            }
        });
        return res.json(response.buildSuccess({}))
    } catch (err) {
        console.log("updateCategory: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

async function deleteCategory(req, res) {
    let {id_restaurant, id_category} = req.params;
    try {
        let category = await Category.findOne({
            where: {
                id_restaurant: id_restaurant,
                id_category: id_category
            }
        });
        if (!category) {
            throw new Error("Danh mục không tồn tại.")
        }
        let item = await db.Item.findOne({
            where: {
                id_restaurant: id_restaurant,
                id_category: id_category
            }
        });
        if (item) {
            throw new Error("Không thể xoá danh mục này. Một số item trong cửa hàng của bạn đang sử dụng danh mục này.")
        }
        await Category.destroy({
            where: {
                id_category: id_category
            }
        });
        return res.json(response.buildSuccess({}))
    } catch (err) {
        console.log("deleteCategory: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

async function getRevenue(req, res){
    try{
        let {id_restaurant} = req.params;
        let {from, to} = req.query;
        let sql = "SELECT \n" +
            "    O.create_time, O.id_restaurant, SUM(I.price) AS revenue\n" +
            "FROM\n" +
            "    `Order` AS O\n" +
            "        INNER JOIN\n" +
            "    OrderItem AS OI ON OI.id_order = O.id_order\n" +
            "        INNER JOIN\n" +
            "    Item AS I ON OI.id_item = I.id_item\n" +
            "WHERE\n" +
            "    O.status = 'done'\n" +
            "        AND O.id_restaurant = :id_restaurant\n" +
            "        AND (create_time BETWEEN :from AND :to)\n" +
            "        AND is_payment = 1\n" +
            "GROUP BY O.create_time\n" +
            "ORDER BY O.create_time ASC";
        let revenues = await db.sequelize.query(sql, {
            replacements: {
                id_restaurant: id_restaurant,
                from: from,
                to: to
            },
            type: db.sequelize.QueryTypes.SELECT
        });
        return res.json(response.buildSuccess({revenues}))
    }
    catch(err){
        console.log("getRevenue: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

async function statisticItemInRestaurant(req, res){
    try{
        let {id_restaurant} = req.params;
        let {from, to, page_size, page_number} = req.query;
        if(!page_size){
            page_size = 20;
        }else{
            page_size = parseInt(page_size)
        }
        if(!page_number){
            page_number = 0;
        }else{
            page_number = parseInt(page_number)
        }
        let sql = "SELECT \n" +
            "    sum(OI.quantity) as order_count, I.name, I.image\n" +
            "FROM\n" +
            "    `Order` AS O\n" +
            "        INNER JOIN\n" +
            "    OrderItem AS OI ON OI.id_order = O.id_order\n" +
            "        INNER JOIN\n" +
            "    Item AS I ON OI.id_item = I.id_item\n" +
            "WHERE\n" +
            "    O.status = 'done'\n" +
            "        AND O.id_restaurant = :id_restaurant\n" +
            "        AND (create_time BETWEEN :from AND :to)\n" +
            "        AND is_payment = 1\n" +
            "GROUP BY I.id_item\n" +
            "ORDER BY order_count DESC";
        let list_item = await db.sequelize.query(sql, {
            replacements: {
                id_restaurant: id_restaurant,
                from: from,
                to: to
            },
            type: db.sequelize.QueryTypes.SELECT
        });
        let items = [];
        for(let i = page_size * page_number; i < page_size * (page_number + 1); i++){
            if(list_item[i]){
                list_item[i].image = await createUrl(list_item[i].image);
                items.push(list_item[i]);
            }
        }
        return res.json(response.buildSuccess({items}))
    }
    catch(err){
        console.log("statisticItemInRestaurant: ", err.message);
    }
}

module.exports = {
    getRestaurants,
    //createRestaurant,
    updateRestaurant,
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getRevenue,
    statisticItemInRestaurant
};