const db = require("../../models/index");
const response = require("../../util/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

async function register(req, res) {
    try{
        let {user_name, password, restaurant_name, restaurant_address, count_table} = req.body;
        if(!user_name || !password || !restaurant_address || !restaurant_name || !count_table){
            throw new Error("Something missing.")
        }
        if(password.length < 8){
            throw new Error("Mật khẩu phải có ít nhất 8 kí tự.")
        }
        let user = await db.User.findOne({
            where: {
                user_name: user_name
            }
        });
        if(user){
            throw new Error("Tài khoản này đã có người sử dụng.")
        }
        const saltRounds = 10;
        let salt = await bcrypt.genSalt(saltRounds);
        let new_pass = await bcrypt.hash(password, salt);
        user = await db.User.create({
            user_name: user_name,
            password: new_pass,
            name: name
        });
        let restaurant = await db.Restaurant.create({
            name: restaurant_name,
            address: restaurant_address,
            id_user: user.dataValues.id_user
        });
        for (let i = 0; i < count_table; i++) {
            await db.Table.create({
                location: `Bàn số ${i + 1}`,
                id_restaurant: restaurant.dataValues.id_restaurant
            })
        }
        return res.json(response.buildSuccess({}));
    }
    catch(err){
        console.log("register: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}


async function login(req, res) {
    try{
        let {user_name, password} = req.body;
        if(!user_name || !password){
            throw new Error("Something missing.")
        }
        let user = await db.User.findOne({
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
                    id_user: user.dataValues.id_user
                }, config.get("secretTokenAdmin"), {
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


module.exports = {
    login,
    register
};