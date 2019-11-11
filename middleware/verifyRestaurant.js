const response = require("../util/response");
const db = require("../models/index");

async function verifyRestaurant(req, res, next) {
    let {id_restaurant} = req.params;
    try{
        let restaurant = await db.Restaurant.findOne({
            where: {
                id_restaurant: id_restaurant,
                id_user: req.tokenData.id_user
            }
        });
        if(restaurant){
            next()
        }else{
            throw new Error("Bạn không phải chủ của cửa hàng này.")
        }
    }
    catch(err){
        console.log("verifyAdmin: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

module.exports = verifyRestaurant;