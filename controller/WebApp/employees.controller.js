const db = require("../../models/index");
const Employees = db.Employees;
const response = require("../../util/response");
const bcrypt = require("bcrypt");

async function addEmployees(req, res) {
    try{
        let {name, user_name, password, phone_number} = req.body;
        let {id_restaurant} = req.params;
        if(!name|| !user_name || !password || !phone_number){
            throw new Error("Something missing")
        }
        if(password.length < 8){
            throw new Error("Mật khẩu phải có ít nhất 8 kí tự.")
        }
        let employees = await Employees.findOne({
            where: {
                user_name: user_name
            }
        });
        if(employees){
            throw new Error("User name đã tồn tại.")
        }
        const saltRounds = 10;
        let salt = await bcrypt.genSalt(saltRounds);
        req.body.password = await bcrypt.hash(password, salt);
        await Employees.create({
            ...req.body,
            id_restaurant,
            create_time: Date.now()
        });
        return res.json(response.buildSuccess({}));
    }
    catch(err){
        console.log("addEmployees: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

async function getEmployees(req, res){
    let {id_restaurant} = req.params;
    try{
        let employees = await Employees.findAll({
            where: {
                id_restaurant: id_restaurant
            },
            order: [
                ['create_time', 'ASC']
            ]
        });
        return res.json(response.buildSuccess({employees}))
    }
    catch(err){
        console.log("addEmployees: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

async function deleteEmployees(req, res){
    try{
        let {id_restaurant, id_employees} = req.params;
        let employees = await Employees.findOne({
            where: {
                id_restaurant: id_restaurant,
                id_employees: id_employees
            }
        });
        if(!employees){
            throw new Error("Nhân viên này không thuộc cửa hàng của bạn.")
        }
        await Employees.destroy({
            where: {
                id_employees: id_employees
            }
        });
        return res.json(response.buildSuccess({}))
    }
    catch(err){
        console.log("deleteEmployees: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

async function updateEmployees(req, res){
    try{
        let {id_restaurant, id_employees} = req.params;
        let employees = await Employees.findOne({
            where: {
                id_restaurant: id_restaurant,
                id_employees: id_employees
            }
        });
        if(!employees){
            throw new Error("Nhân viên này không thuộc cửa hàng của bạn.")
        }
        if(req.body.new_password){
            const saltRounds = 10;
            let salt = await bcrypt.genSalt(saltRounds);
            req.body.password = await bcrypt.hash(req.body.new_password, salt);
        }
        await Employees.update(req.body, {
            where: {
                id_employees: id_employees
            }
        });
        return res.json(response.buildSuccess({}))
    }
    catch(err){
        console.log("deleteEmployees: ", err.message );
        return res.json(response.buildFail(err.message))
    }
}

module.exports = {
    addEmployees,
    getEmployees,
    deleteEmployees,
    updateEmployees
};