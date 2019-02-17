var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fattest89@gmail.com',
        pass: 'Stanly106601'
    }
});


module.exports = {
    send_email: function(email, subject, body, callback) {
        var mailOptions = {
            from: 'fattest89@gmail.com',
            to: email,
            subject: subject,
            text: body,
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error)
                console.log(error);
            else
                console.log('Email sent: ' + info.response);
        });
    }
}


