module.exports = (sequelize, Sequelize) => {
    const Channels = sequelize.define("channel", {
        name:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },

    })

    return Channels;
}