require('dotenv')

const nodemailer = require('nodemailer')

class Email {
  send (to, subject, html) {
    let mailConfig

    if (process.env.NODE_ENV === 'dev') {
      mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'eveline74@ethereal.email',
          pass: 'mqyS3E2GmAMF6XeU7q'
        },
        logger: false,
        debug: false // include SMTP traffic in the logs
      }
    } else {
      mailConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'dev.beatrizfelix@gmail.com',
          pass: 'E8mycsXbB9dP9KCJ'
        }
      }
    }

    let transporter = nodemailer.createTransport(mailConfig)

    let mailOptions = {
      from: {
        name: 'Beatriz Felix',
        email: 'dev.beatrizfelix@gmail.com'
      },
      to: to,
      subject: subject,
      html: html
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'production') {
        if (error) {
          console.log(error)
        } else {
          console.log('Email sent: ' + info.response)
          console.log(nodemailer.getTestMessageUrl(info))
        }
      }
    })
  }
}

module.exports = new Email()
