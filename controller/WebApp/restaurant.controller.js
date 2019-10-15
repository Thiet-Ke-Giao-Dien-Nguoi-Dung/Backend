const db = require("../../models/index");
const response = require("../../util/response");

async function getRestaurants(req, res) {
    try{
        let restaurants = await db.Restaurant.findAll({
            where: {
                id_user: req.tokenData.id_user
            }
        });
        let data = {restaurants};
        return res.json(response.buildSuccess(data))
    }
    catch(err){
        console.log("getRestaurants: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

async function createRestaurant(req, res){
    try{
        let {name, address, table_count} = req.body;
        if(!name || !address){
            throw new Error("Something missing")
        }
        let restaurant = await db.Restaurant.create({
            name: name,
            address: address, id_user: req.tokenData.id_user
        });
        for(let i=0; i<table_count; i++){
            await db.Table.create({
                location: `Bàn số ${i+1}`,
                id_restaurant: restaurant.dataValues.id_restaurant
            })
        }
        return res.json(response.buildSuccess({}))
    }
    catch(err){
        console.log("createRestaurant: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

async function updateRestaurant(req, res){
    try{
        let {id_restaurant} = req.params;
        await db.Restaurant.update(req.body,{
            where: {
                id_restaurant: id_restaurant
            }
        });
        return res.json(response.buildSuccess({}))
    }
    catch(err){
        console.log("updateRestaurant: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

module.exports = {
    getRestaurants,
    createRestaurant,
    updateRestaurant
};