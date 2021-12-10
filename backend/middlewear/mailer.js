const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const config = require('../config');

/**
 * Nodemailer Gmail interface
 * @param {String} subject subject of email
 * @param {String} body html body in string form
 * @param {Object[]} recipients array of recipients 
 */
function mailer(subject, body, recipients){
    const oauth2Client = new OAuth2(
        config.gmail.CLIENT_ID,//client id
        config.gmail.CLIENT_SECRET,//client secre
        config.gmail.REDIRECT_URIS,//redirect uris
    );

    oauth2Client.setCredentials(
        {
            // refresh token 
            refresh_token: config.gmail.REFRESH_TOKEN
        }
    );

    const access_token = oauth2Client.getAccessToken();
    const mailOptions = {
        from : config.gmail.ROOT_USER, // from sender
        to: recipients.join(),
        subject : subject,
        generateTextFromHTML: true,
        html: body
    }
    // SMTP tranpsort object
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        tls : {
            rejectUnauthorized: false
        },
        auth :  {
            type: "OAUTH2",
            user: '',
            clientId: config.gmail.CLIENT_ID,
            clientSecret: config.gmail.CLIENT_SECRET,
            refreshToken: config.gmail.REFRESH_TOKEN,
            accessToken: access_token,
        }
    });

    smtpTransport.sendMail(mailOptions, (err, res)=>{
        if (err) {
            throw err
        } else {  
            console.log(res);
        }
        smtpTransport.close();
    })
}

module.exports = mailer;