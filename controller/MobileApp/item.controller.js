const db = require("../../models/index");
const response = require("../../util/response");
const createUrl = require("../../util/s3/createUrl");

async function getCategoryInRestaurant(req, res){
    let {id_restaurant} = req.params;
    try{
        let employees = await db.Employees.findOne({
            where: {
                id_employees: req.tokenData.id_employees,
                id_restaurant: id_restaurant
            }
        });
        if(!employees){
            throw new Error("Bạn không phải nhân viên của cửa hàng này.")
        }
        let categories = await db.Category.findAll({
            where: {
                id_restaurant: id_restaurant
            }
        });
        return res.json(response.buildSuccess({categories}));
    }
    catch(err){
        console.log("getCategoryInRestaurant: ", err.message);
        return res.json(response.buildFail(err))
    }
}

async function getItemInCategory(req, res){
    try{
        let {id_restaurant} = req.params;
        // let {id_category} = req.query;
        let constrains = {
            id_restaurant: id_restaurant
        };
        // if(id_category){
        //     constrains.id_category = id_category
        // }
        let employees = await db.Employees.findOne({
            where: {
                id_employees: req.tokenData.id_employees,
                id_restaurant: id_restaurant
            }
        });
        if(!employees){
            throw new Error("Bạn không phải là nhân viên của nhà hàng này.")
        }
        let items = await Item.findAll({
            where: constrains,
            order: [
                ["price", 'ASC']
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



module.exports = {
    getCategoryInRestaurant,
    getItemInCategory
};