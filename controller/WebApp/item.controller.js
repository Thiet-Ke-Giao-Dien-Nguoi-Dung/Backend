const db = require("../../models/index");
const Item = db.Item;
const Restaurant = db.Restaurant;
const uploadImageToS3 = require("../../util/s3/uploadImageToS3");
const createUrl = require("../../util/s3/createUrl");

const response = require("../../util/response");

async function createItem(req, res) {

    let {id_restaurant} = req.params;
    let {name, price, id_category} = req.body;
    try{
        if(!req.file){
            throw new Error("Vui lòng chọn ít nhất 1 ảnh.")
        }
        if(!name || !price){
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
        let type = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
        let url = await uploadImageToS3(req.file.buffer, type);
        await Item.create({
            ...req.body,
            status: "in_stock",
            id_restaurant,
            image: url,
            id_category
        });
        return res.json(response.buildSuccess({}))
    }
    catch(err){
        console.log("createItem: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

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

async function getItems(req, res){
    try{
        let {id_restaurant} = req.params;
        let {id_category} = req.query;
        let constrains = {
            id_restaurant: id_restaurant
        };
        if(id_category){
            constrains.id_category = id_category
        }
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
    createItem,
    updateItem,
    getItems
};