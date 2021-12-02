module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define("comment", {
        text: {
            type: Sequelize.STRING,
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

    return Comments;
}