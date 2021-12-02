const bcrypt = require('bcryptjs');
module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        email : {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        image: {
            type: Sequelize.STRING,
        }
    });

    Users.authenitcate = async function(identifier, password){
    
        const checkEmail = await Users.findOne({where: {
            email: identifier
        }});
        const checkUsername = await Users.findOne({where: {
            username: identifier
        }});
        console.log((checkEmail!== null || checkUsername !== null));
        if (checkEmail !== null || checkUsername !== null) {
            const user = checkEmail !== null ? checkEmail : checkUsername;
            console.log(user)
            const dbPassword = user.password;
    
            const isPasswordCorrect = await bcrypt.compare(password, dbPassword);
            console.log(isPasswordCorrect)
            if (isPasswordCorrect){
                // password is correct, username or email is correct
                // time to tell controller to generate token
    
                return user;
    
            } else {
                return {message: "Error: identifier or password is incorrect."}
            }
        } else {
            return {message: "Error authenticating user."}
        }
    }
    return Users;
}