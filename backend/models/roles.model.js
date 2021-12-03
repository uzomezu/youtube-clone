module.exports = (sequelize, Sequelize) => {
    const UserRoles = sequelize.define("roles", {
        name : {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });

    return UserRoles;
}