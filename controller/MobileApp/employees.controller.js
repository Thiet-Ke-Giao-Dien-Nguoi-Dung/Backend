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

async function changePassword(req, res){
    try{
        let {old_password, new_password} = req.body;
        if(!new_password || !old_password){
            throw new Error("Something missing.");
        }
        let employees = await db.Employees.findOne({
            where: {
                id_employees: req.tokenData.id_employees
            }
        });
        let check = await bcrypt.compare(old_password, employees.dataValues.password);
        if(!check){
            throw new Error("Mật khẩu cũ không đúng.")
        }
        const saltRounds = 10;
        let salt = await bcrypt.genSalt(saltRounds);
        let new_pass = await bcrypt.hash(new_password, salt);
        await db.Employees.update({
            password: new_pass
        },{
            where: {
                id_employees: req.tokenData.id_employees
            }
        });
        return res.json(response.buildSuccess({}))
    }
    catch(err){
        console.log("changePassword: ", err.message);
        return res.json(response.buildFail(err.message))
    }
}

module.exports = {
    login,
    changePassword
};