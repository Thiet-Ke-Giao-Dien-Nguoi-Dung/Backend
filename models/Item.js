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
        },
        is_delete: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    Item.associate = (models) => {
        Item.belongsTo(models.Restaurant, {
            foreignKey: "id_restaurant",
            targetKey: "id_restaurant"
        });
        Item.belongsTo(models.Category, {
            foreignKey: "id_category",
            targetKey: "id_category"
        });
        Item.belongsToMany(models.Order, {
            through: models.OrderItem,
            as: "orders",
            foreignKey: "id_item"
        })
    };

    return Item;
};