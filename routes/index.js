const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

/* GET contact page */
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Contact' });
});

/* POST contact page
   Send email to sactf with volunteer contact 
   and description of their skills */
router.post('/contact', [

  // Sanitize data
  body('name', 'Please enter your name.').trim().isLength({ min: 1 }).escape(),
  body('email', 'Please enter valid E-mail address.').trim().isEmail().escape(),
  body('phone', 'Please enter valid phone number.').trim().escape(),
  body('howHelp').trim().isLength({ min: 1 }).escape(),
  body('relevantXP').trim().escape(),
  body('other').trim().escape(),

  async function (req, res, next) {
    // Validate data
    const errors = validationResult(req);
    // Create message with sanitized data
    const msg = `
      <p>You have a new contact request!</p> 
      <h3>Contact Details</h3>
      <ul> 
        <li> Name: ${req.body.name}</li>
        <li> Email: ${req.body.email}</li>
        <li> Phone: ${req.body.phone}</li>
      </ul>
      <h3>How they can help: </h3>
      <p>${req.body.howHelp}</p>
      <h3>Relevant experience: </h3>
      <p>${req.body.relevantXP}</p>
      <h3>Other info: </h3>
      <p>${req.body.other}</p>
    `;

    if (!errors.isEmpty()) {
      // There are errors, render form again and display error messages
      res.render('contact', {
        Title: 'Contact',
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        howHelp: req.body.howHelp,
        relevantXP: req.body.relevantXP,
        other: req.body.other,
        errors: errors.array(),
      });
      return;
    }
    else {
      // Data form is valid, send email
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SEND_EMAIL_USERNAME,
          pass: process.env.SEND_EMAIL_PASSWORD,
        },
      });
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"SACTF Website" <sactfNoReply@gmail.com>',
        to: "nicholasndelaney@gmail.com",  // change to southasiancovidtf@gmail.com
        subject: "Volunteer Request",
        html: msg,
      });
      // Render success page
      res.render(('contact'), { title: 'Contact', formSuccess: true });
    }
  }
]);

/* GET rescources page */
router.get('/resources', function (req, res, next) {
  res.render('resources', { title: 'Resources' });
});

/* POST resources page
   Send email to SACTF with workplace concern info
   including sender contact info description of the concern */
router.post('/resources', [

  // Sanitize data
  body('workplaceName', 'Workplace name must not empty.').trim().isLength({ min: 1 }).escape(),
  body('workplaceAddress', 'Workplace address must not be empty').trim().isLength({ min: 1 }).escape(),
  body('issues', 'Issues Observed must not be empty').trim().isLength({ min: 1 }).escape(),
  body('contactEmail', 'Invalid E-mail address').optional({ checkFalsy: true }).trim().isEmail().normalizeEmail().escape(),
  body('contactPhone', 'Invalid phone number').optional({ checkFalsy: true }).trim().isLength({ min: 1 }).escape(),
  body('contactOther').optional({ checkFalsy: true }).trim().isLength({ min: 1 }).escape(),

  async function (req, res, next) {
    // Validate data
    const errors = validationResult(req);
    // Create message with sanitized data
    const msg = `
      <p>New workplace concern submission</p> 
      <h3>Workplace Info</h3>
      <ul>
        <li> Workplace Name: ${req.body.workplaceName}</li>
        <li> Workplace Address: ${req.body.workplaceAddress}</li>
      </ul>
      <h3>Sender Contact Details</h3>
      <ul> 
        <li> Phone: ${req.body.contactEmail}</li>
        <li> Email: ${req.body.contactPhone}</li>
        <li> Other: ${req.body.contactOther}</li>
      </ul>
      <h3>Issue Observed: </h3>
      <p>${req.body.issues}</p>
    `;

    if (!errors.isEmpty()) {
      // There are errors, render form again and display error messages
      res.render('resources', {
        Title: 'Resources',
        workplaceName: req.body.workPlaceName,
        workPlaceAddress: req.body.workPlaceAddress,
        issues: req.body.issues,
        contactPhone: req.body.contactPhone,
        contactEmail: req.body.contactEmail,
        contactOther: req.body.contactOther,
        errors: errors.array(),
      });
      return;
    }
    else {
      // Data form is valid, send email
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SEND_EMAIL_USERNAME,
          pass: process.env.SEND_EMAIL_PASSWORD,
        },
      });
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"SACTF Website" <sactfNoReply@gmail.com>',
        to: "nicholasndelaney@gmail.com",                 // change to southasiancovidtf@gmail.com
        subject: "Workplace Concern",
        html: msg,
      });
      // Render success page
      res.render(('resources'), { title: 'Resources', formSuccess: true });
    }
  }
]);

/* GET BC page */
router.get('/bc', function (req, res, next) {
  res.render('bc', { title: 'Workplace Concerns' });
});

/* GET about page */
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'About Us' });
});

/* GET media page */
router.get('/media', function (req, res, next) {
  res.render('media', { title: 'Media' });
});

/* GET home page */
router.get('/home', function (req, res, next) {
  res.render('home', { title: 'South Asian Covid Task Force' });
});

/* GET default (home) page. */
router.get('/', function (req, res, next) {
  res.redirect('/home');
});

module.exports = router;
