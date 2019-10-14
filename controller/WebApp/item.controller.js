const db = require("../../models/index");
const Item = db.Item;
const Restaurant = db.Restaurant;

const response = require("../../util/response");

//todo upload image to s3
async function createItem(req, res) {
    let {id_restaurant} = req.params;
    let {image, name, price} = req.body;
    try{
        if(!image || !name || !price){
            throw new Error("Some thing missing");
        }
        let restaurant = await Restaurant.findOne({
            where: {
                id_restaurant: id_restaurant,
                id_user: req.tokenData.id_user
            }
        });
        if(!restaurant){
            throw new Error("Bạn không thể thêm item cho quán này.")
        }
        await Item.create({
            ...req.body,
            status: "in_stock",
            id_restaurant
        });
        return res.json(response.buildSuccess({}))
    }
    catch(err){
        console.log("createItem: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

//update image
async function updateItem(req, res) {
    let {id_restaurant, id_item} = req.params;
    try{
        let restaurant = await Restaurant.findOne({
            where: {
                id_restaurant: id_restaurant,
                id_user: req.tokenData.id_user
            }
        });
        if(!restaurant){
            throw new Error("Bạn không thể thêm item cho quán này.")
        }
        let item = await Item.findOne({
            where: {
                id_item: id_item,
                id_restaurant: id_restaurant
            }
        });
        if(!item){
            throw new Error("Bạn không thể cập nhật item này.")
        }
        await Item.update({
            ...req.body
        },{
            where: {
                id_item: id_item
            }
        });
        return res.json(response.buildSuccess({}))
    }
    catch(err){
        console.log("updateItem: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

//todo get image from s3
async function getItems(req, res){
    try{
        let {id_restaurant} = req.params;
        let restaurant = await Restaurant.findOne({
            where: {
                id_restaurant: id_restaurant,
                id_user: req.tokenData.id_user
            }
        });
        if(!restaurant){
            throw new Error("Bạn không phải là chủ nhà hàng này.")
        }
        let items = await Item.findAll({
            where: {
                id_restaurant: id_restaurant
            },
            order: [
                ["price", 'ASC']
            ]
        });
        res.json(response.buildSuccess({items}))
    }
    catch(err){
        console.log("getItems: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}


module.exports = {
    createItem,
    updateItem,
    getItems
};