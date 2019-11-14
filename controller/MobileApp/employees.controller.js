const db = require("../../models/index");
const Employees = db.Employees;
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
        let user = await Employees.findOne({
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

module.exports = {
    login
};