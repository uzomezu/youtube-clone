const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/');
const userRolesJSON = require('../user.roles.json');
const {validUsername, validEmail, validPassword} = require("../middlewear/validator");
const db = require('./index');
const e = require('cors');
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

                const curUserRoles = await user.getRoles();

                let priviliges = [];

                for (const role of curUserRoles) {
                    var thingsICanDo = userRolesJSON[role.name].priviliges;

                    priviliges.concat(thingsICanDo);
                }

                const token = jwt.sign({
                    id: user.id,
                    priviliges: priviliges,
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
     * creates or finds a current user privilige
     * @param {String} roleName 
     * @returns UserRole Object
     */
    Users.newPrivilige = async (roleName) => {

        const checkForRole = await db.roles.findOne({where:{
            name: roleName
        }});

        if (!checkForRole){
            const newRole = await db.roles.create({
                name: roleName
            });

            if (newRole) {
                return newRole
            };
        } else {
            return checkForRole;
        }

    }
    Users.becomePriviliged = async (req,res,next) => {
        try{
            const userRole = await Users.newPrivilige(req.body.privilige);
        
            // assuming isAuth (user has a jwt during request)
    
            const user = req.user;
    
            const userPriviliges = await user.getRoles();
    
            if (!userPriviliges.includes(userRole)) {
                await user.addRole(userRole);
                res.status(200).send({
                    message: `${req.body.privilige} privilige added!`,
                    roles: await user.getRoles()
                })
            } else {
                await user.removeRole(userRole);
                res.status(200).send({
                        message: `${req.body.privilige} privilige removed.`,
                        roles : await user.getRoles()
                    });
            }
        } catch(err) {
            res.status(500).send({message: err.message})
        }
    };
    /**
     * Will validate an authenticated user from db
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    Users.isAuth = async (req,res,next) => {
        try{
            const bearerToken = req.headers.authorization;
            const onlyToken = bearerToken.slice(7,bearerToken.length);
            jwt.verify(onlyToken, config.JWT_SECRET, async(err, decoded)=>{
                if (err){
                    throw err
                } else {
                    req.user = await Users.findOne({where: {
                        id: decoded.id
                    }});
                    req.priviliges = decoded.priviliges
                    next();
                    return;
                }
            })
        } catch(err){
            res.status(500).send({message: err.message})
        }


    };
    return Users;
}