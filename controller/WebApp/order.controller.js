const db = require("../../models/index");
const response = require("../../util/response");
const moment = require("moment");


async function getOrders(req, res) {
    try{
        let {id_restaurant} = req.params;
        let {status} = req.query;
        let time = Date.now();
        time = moment(time).format("YYYY/MM/DD");
        let orders = await db.Order.findAll({
            where: {
                id_restaurant: id_restaurant,
                status: status,
                create_time: time
            },
            attributes: ['id_order', 'status', 'create_time', 'update_time'],
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
            ],
            order: [
                ['update_time', 'ASC']
            ]
        });
        return res.json(response.buildSuccess({orders}));
    }
    catch (err) {
        console.log("getOrders: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

async function changeStatusOfOrder(req, res){
    try{
        let {status} = req.body;
        let {id_restaurant, id_order} = req.params;
        let order = await db.Order.findOne({
            where: {
                id_order: id_order
            }
        });
        if(!order){
            throw new Error("Đơn hàng này không tồn tại.")
        }
        if(order.dataValues.status === "done"){
            throw new Error("Đơn hàng này đã đạt trạng thái cuối.")
        }
        await db.Order.update({
            status: status,
            update_time: Date.now(),
            is_payment: true
        },{
            where: {
                id_order: id_order
            }
        });
        if(status === "done"){
            await db.Table.update({
                is_ordered: false
            },{
                where: {
                    id_table: order.dataValues.id_table
                }
            })
        }
        return res.json(response.buildSuccess({}));
    }
    catch(err){
        console.log("changeStatusOfOrder: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}


async function getOrder(req, res){
    try{
        let {id_restaurant, id_order} = req.params;
        let order = await db.Order.findAll({
            where: {
                id_restaurant: id_restaurant,
                id_order: id_order
            },
            attributes: ['id_order', 'status', 'create_time', 'update_time'],
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
        return res.json(response.buildSuccess({order}));
    }
    catch (err) {
        console.log("getOrder: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}


module.exports = {
    getOrders,
    changeStatusOfOrder,
    getOrder
};
