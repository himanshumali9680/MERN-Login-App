import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js'



// https://ethereal.email/create
let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: ENV.EMAIL, // generated ethereal user
      pass: ENV.PASSWORD, // generated ethereal password
    },
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js'
    }
})

/** POST: http://localhost:4001/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : ""
}
*/

export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject} = req.body;

    // body of the email
    var email = {
        body: {
            name: username,
            intro: text || 'Its Himanshu',
            outro: 'himanshu.varni@gmail.com'
        }
    }

    var emailBody = MailGenerator.generate(email)

    let message = {
        from : ENV.EMAIL,
        to: userEmail,
        sub: subject || 'signup successfull',
        html: emailBody
    }

    
    // send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from us."})
        })
        .catch(error => res.status(500).send({ error }))

}