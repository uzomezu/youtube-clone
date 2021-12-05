const tlds = require('./tlds.json');
var capitals = /[A-Z]/;
var lowerCase = /[a-z]/;
var numbers = /[0-9]/;
var specialChars = /[!@#$%^&*?.;:,<>~]/;
exports.validEmail = (email) => {
    const emailRegex = (tlds) => {
        let str = "^[^\s@]+@[^\s@]+\."
        
        for (let i = 0; i < tlds.length; i++) {
            if (i == 0) {
                str += `${tlds[i]}|`
            } else if (i == tlds.length - 1 ) {
                str += `${tlds[i]}`
            } else {
                str += `${tlds[i]}|`
            }
        }

        return new RegExp(str);
    };

    const commonEmailsRegex = emailRegex(tlds.most_common);
    const rareEmailsRegex = emailRegex(tlds.less_common);
    const avoidEmailsRegex = emailRegex(tlds.avoid);

    console.log(`Is ${email} a common email? `, commonEmailsRegex.test(email));
    console.log(`Is ${email} a rare email? `, rareEmailsRegex.test(email));
    console.log(`Is ${email} a spam email? `, avoidEmailsRegex.test(email));

    if ((commonEmailsRegex.test(email) || rareEmailsRegex.test(email)) && !avoidEmailsRegex.test(email)) {
        // ... this is a good email or a rare one not spam
        return true;
    } else {
        // ... its a spam email or it just has invalid syntax
        return false
    }
};

exports.validUsername = (username) => {
    let errors = [];
    let color = "";
    if (!capitals.test(username)){
        errors.push("usernames must contain at least one uppercase character.");
    }
    if (!lowerCase.test(username)){
        errors.push("usernames must contain at least one lowercase character.");
    }
    if (!numbers.test(username)){
        errors.push("usernames must contain at least 1 number (0-9).")
    };
    if (errors.length > 0) {
        color = "red"
    } else {
        color = "green"
    };

    return {
        errors: errors,
        color: color
    }
};

exports.validPassword = (password) => {
    let errors = [];
    let color = "";

    if (password.length < 8) {
        errors.push("passwords must be at least 8 characters long.")
    } 
    if (!capitals.test(password)){  
        errors.push("passwords must contain a uppercase character.")
    }
    if (!lowerCase.test(password)){
        errors.push("passwords must contain a lowercase character.")
    }
    if (!numbers.test(password)){
        errors.push("passwords must contain at least one number (0-9).") 
    }
    if (!specialChars.test(password)){
        errors.push("passwords must contain a special character.")
    }
    if (errors.length > 0) {
        color = "red"
    } else {
        color = "green"
    }

    return {
        errors: errors,
        color: color
    }
}

