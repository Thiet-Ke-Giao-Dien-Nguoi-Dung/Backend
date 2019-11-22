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
        if(!name || !price || !id_category){
            throw new Error("Some thing missing");
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
        let item = await Item.findOne({
            where: {
                id_item: id_item,
                id_restaurant: id_restaurant
            }
        });
        if(!item){
            throw new Error("Item này không thuộc cửa hàng của bạn.")
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
        let {id_category, is_delete, page_size, page_number} = req.query;
        if(!page_number){
            page_number = 0
        }else{
            page_number = parseInt(page_number)
        }
        if(!page_size){
            page_size = 20
        }else{
            page_size = parseInt(page_size)
        }
        let constrains = {
            id_restaurant: id_restaurant
        };
        if(id_category){
            constrains.id_category = id_category
        }
        if(is_delete){
            constrains.is_delete = is_delete
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
        let items = await Item.findAndCountAll({
            where: constrains,
            order: [
                ["price", 'ASC']
            ],
            limit: page_size,
            offset: page_size * page_number
        });
        let data = {};
        data.count = items.count;
        data.items = items.rows.map(e => e.dataValues);
        for(let e of data.items){
            e.image = await createUrl(e.image)
        }
        res.json(response.buildSuccess(data))
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