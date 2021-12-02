module.exports = (sequelize, Sequelize) => {
    const Videos = sequelize.define("video", {
        title: {
            type: Sequelize.STRING, 
            allowNull:false,
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        views: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        likes: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        disLikes: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
    });

    return Videos;
}