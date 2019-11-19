const db = require("../../models/index");
const response = require("../../util/response");
const moment = require("moment");


async function getOrders(req, res) {
    try{
        let {id_restaurant} = req.params;
        let {status, time} = req.query;
        // let time = Date.now();
        // time = moment(time).format("YYYY/MM/DD");
        let orders = await db.Order.findAll({
            where: {
                id_restaurant: id_restaurant,
                status: status,
                create_time: time
            },
            attributes: ['id_order', 'status', 'create_time'],
            include: [
                {
                    model: db.Table,
                    attributes: ['id_table', 'location']
                },
                {
                    model: db.Item,
                    as: 'items',
                    attributes: ['name', 'price']
                }
            ]
        });
        return res.json(response.buildSuccess({orders}));
    }
    catch (err) {
        console.log("getOrders: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}



module.exports = {
    getOrders
};
