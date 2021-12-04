const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/');
const userRolesJSON = require('../user.roles.json');
const {validUsername, validEmail, validPassword} = require("../middlewear/validator");
const db = require('./index');
module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("user", {
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
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
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
    };
    
    // ... Log in Function which issues a jwt
    Users.logIn = async (req,res,next) => {
        try {
            const {identifier, password} = req.body;
            const user = await Users.authenitcate(identifier, password);

            if (user instanceof Users) {
                // ... respond with JWT
                const token = jwt.sign({
                    id: user.id,
                    roles: await user.getRoles(),
                    email: user.email
                },config.JWT_SECRET,{
                    expiresIn: "72h" // 72 hour expiration time
                });

                res.status(200).send({
                    user: user,
                    token: token
                })
            } else {

                var error = user;
                res.status(400).send({
                    error
                })
            }
        } catch (err) {
            res.status(500).send({message: err.message})
        }

    };
    // ... register function which will create a user
    Users.register = async (req,res,next) => {
        try {
            // grab data from req.body;

            const {email, username, password} = req.body;
            
            // ... Validate the incoming data
            
            const isValidEmail = validEmail(email);
            const isValidUserName = validUsername(username);
            const isValidPassword = validPassword(password);
            const response = {
                email: isValidEmail ? "Email is valid!" : "Error: Invalid email address.",
                username : isValidUserName,
                password : isValidPassword 
            };
            if (!isValidEmail || isValidUserName.errors.length > 0 || isValidPassword.errors.length > 0){
                // ... send back the errors
                res.status(400).send(response);
            } else {
                // ... all conditions validated
                var salt = bcrypt.genSaltSync(10);
                var hashedPass = bcrypt.hashSync(password, salt);

                const newUser = await Users.create({
                    email: email,
                    username: username,
                    password: hashedPass
                });
               
                // ... add the authenticated roles
                //const authRole = userRolesJSON.authenticated.priviliges;
                const authRole = await db.roles.findOne({where:{
                    name : "authenticated"
                }});
                if(!authRole){
                    const newRole = await db.roles.create({
                        name: "authenticated"
                    });
                    await newUser.addRole(newRole);
                } else {
                    await newUser.addRole(authRole);
                }
                res.status(201).send({
                    message: "Success! New user created.",
                    data: {
                        user: newUser,
                        roles: await newUser.getRoles()
                    }
                });
            }
            
        } catch (err) {
            res.status(500).send({message: err.message});
        }

    };
   
    /**
     * Will validate an authenticated user from db
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    Users.isAuth = async (req,res,next) => {

    };
    /**
     * Will validate a content creator user from db
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    Users.isContentCreator = async (req,res,next) => {

    };
    /**
     * Will validate moderator from db
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    Users.isModerator = async (req,res,next) => {

    };
    /**
     * Will highest level user role validation from db
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    Users.isAdmin = async (req,res,next) => {

    };

    return Users;
}