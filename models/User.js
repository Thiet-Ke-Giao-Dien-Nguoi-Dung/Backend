module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define("User", {
        id_user: {
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
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Restaurant, {
            foreignKey: "id_user",
            sourceKey: "id_user"
        })
    };

    return User;
};