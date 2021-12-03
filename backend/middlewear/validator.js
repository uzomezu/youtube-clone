const tlds = require('./tlds.json');
exports.validEmail = (email) => {
    const emailRegex = (tlds) => {
        let str = "[a-z0-9]+@[a-z.]" + "'+\'"
        
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

};

exports.validPassword = (password) => {

}

