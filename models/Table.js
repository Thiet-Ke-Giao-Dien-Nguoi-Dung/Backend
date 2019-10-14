module.exports = (sequelize, Sequelize) => {

    const Table = sequelize.define("Table", {
        id_table: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        location: {
            type: Sequelize.STRING
        },
        is_ordered: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    Table.associate = (models) => {
        Table.belongsTo(models.Restaurant, {
            foreignKey: "id_restaurant",
            targetKey: "id_restaurant"
        })
    };

    return Table;
};