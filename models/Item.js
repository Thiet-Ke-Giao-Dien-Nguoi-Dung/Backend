module.exports = (sequelize, Sequelize) => {

    const Item = sequelize.define("Item", {
        id_item: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM,
            values: ["in_stock", "out_of_stock"]
        }
    });

    Item.associate = (models) => {
        Item.belongsTo(models.Restaurant, {
            foreignKey: "id_restaurant",
            targetKey: "id_restaurant"
        });
        Item.belongsToMany(models.Order, {
            through: models.OrderItem,
            as: "orders",
            foreignKey: "id_item"
        })
    };

    return Item;
};