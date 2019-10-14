module.exports = (sequelize, Sequelize) => {

    const Employees = sequelize.define("Employees", {
        id_employees: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        user_name: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.INTEGER
        },
        create_time: {
            type: Sequelize.STRING
        }
    });

    Employees.associate = (models) => {
        Employees.belongsTo(models.Restaurant, {
            foreignKey: "id_restaurant",
            targetKey: "id_restaurant"
        })
    };

    return Employees;
};