module.exports = (sequelize, Sequelize) => {

    const Order = sequelize.define("Order", {
        id_order: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        create_time: {
            type: Sequelize.STRING
        },
        update_time: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM,
            values: ["pending", "doing", "done"]
        },
        id_restaurant: {
            type: Sequelize.INTEGER
        },
        is_payment: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    Order.associate = (models) => {
        Order.belongsTo(models.Table, {
            foreignKey: "id_table",
            targetKey: "id_table"
        });
        Order.belongsToMany(models.Item, {
            through: models.OrderItem,
            as: "items",
            foreignKey: "id_order"
        })
    };

    return Order;
};