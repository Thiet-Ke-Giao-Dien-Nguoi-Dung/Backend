module.exports = (sequelize, Sequelize) => {

    const Restaurant = sequelize.define("Restaurant", {
        id_restaurant: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        }
    });

    Restaurant.associate = (models) => {
        Restaurant.belongsTo(models.User, {
            foreignKey: "id_user",
            targetKey: "id_user"
        });
        Restaurant.hasMany(models.Table, {
            foreignKey: "id_restaurant",
            sourceKey: "id_restaurant"
        });
        Restaurant.hasMany(models.Employees, {
            foreignKey: "id_restaurant",
            sourceKey: "id_restaurant"
        })
    };

    return Restaurant;
};