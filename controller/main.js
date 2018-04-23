const mongoose = require('mongoose');
const Guest = require('../models/Guest');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');


exports.thePost = (req, res) => {
        console.log(req.body);
        
        const guest = new Guest({
            name: req.body.name,
            email: req.body.email,
            friendOf: req.body.friendOf,
            message: req.body.message,
            phone: req.body.phone
            });
    
        guest
        .save()
        .then(result => {
    
          res.status(201).json({
            message: "Success",
          });
        })
        .catch(err => {
          res.status(500).send({
            error:{
              message: err.message
            }
          });
        });    
    },

exports.theGet = (req, res) => {
  Guest.find({})
    .exec()
    .then( member =>{
        res.status(200).json(member)
    })
    .catch (err=>{
      res.status(500).json({error:{
        message: err
      }});
    });
}

exports.sendMail = (req, res) => {
  let transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    secure: false, // true for 465, false for other ports
    tls: {
          rejectUnauthorized:false
      },
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS
    }
  });
  
  //useing engine for mail view
  transporter.use('compile', hbs({
    viewPath: 'views/email',
    extName: '.hbs'
  }));
  
  transporter.sendMail({
  from: 'Hassan and Saratu <thankyou@hassanandsaratu.com>', // sender address
  to: req.body.email, // list of receivers
  subject: req.body.fullname + ' Thank You.', // Subject line
  template: 'emailtempl', // email template
  context: {
    full_name: req.body.fullname,

  }
}, function (err, info) {
  if (!err) {
    res.status(200).json({message: 'Success'})
  } else {
    res.status(400).json({message: 'Failed'})
    }
});
}


