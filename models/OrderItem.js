module.exports = (sequelize, Sequelize) => {

    const OrderItem = sequelize.define("OrderItem", {
        id_order_item: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: Sequelize.STRING
        },
        quantity: {
            type: Sequelize.INTEGER
        }
    });

    OrderItem.associate = (models) => {

    };

    return OrderItem;
};