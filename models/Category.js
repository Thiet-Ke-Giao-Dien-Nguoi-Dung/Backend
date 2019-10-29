module.exports = (sequelize, Sequelize) => {

    const Category = sequelize.define("Category", {
        id_category: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        }
    });

    Category.associate = (models) => {
        Category.belongsTo(models.Restaurant, {
            foreignKey: "id_restaurant",
            targetKey: "id_restaurant"
        });
        Category.hasMany(models.Item, {
            foreignKey: "id_category",
            targetKey: "id_category"
        });
    };

    return Category;
};