const db = require("../../models/index");
const Employees = db.Employees;
const Item = db.Item;
const response = require("../../util/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

async function login(req, res) {
    try{
        let {user_name, password} = req.body;
        if(!user_name || !password){
            throw new Error("Something missing.")
        }
        let user = await db.Employees.findOne({
            where: {
                user_name: user_name
            }
        });
        if(!user){
            throw new Error("Tài khoản không tồn tại.")
        }else{
            let check = await bcrypt.compare(password, user.dataValues.password);
            if(check){
                const oneDay = 1000 * 60 * 60 * 24;
                const token = jwt.sign({
                    id_employees: user.dataValues.id_employees
                }, config.get("secretTokenEmployees"), {
                    expiresIn: oneDay
                });
                return res.json(response.buildSuccess({token}))
            }else{
                throw new Error("Mật khẩu không chính xác.")
            }
        }
    }
    catch(err){
        console.log("login: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

async function getItems(req, res){
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
        let items = await Item.findAll({
            where: {
                id_restaurant: employees.dataValues.id_restaurant
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

module.exports = {
    login,
    getItems,
    getTables
};