const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv').config();
const dResources = {
  english:  [ 
              'e1.png', 'e2.png', 'e3.jpg', 'e4.jpg', 'e5.png', 'e6.pdf', 'e7.jpg', 'e8.png', 'e9.png', 'e10.png', 'e11.png',
              'e12.png', 'e13.png', 'e14.jpg', 'e15.jpg', 'e16.png', 'e17.pdf', 'e18.pdf', 'e19.pdf', 'e20.png', 'e21.png',
              'e22.png', 'e23.jpg', 'e24.jpg', 'e25.jpg', 'e26.jpg', 'e27.jpg', 'e28.png', 'e29.jpg', 'e30.pdf', 'e31.jpg',
              'e32.jpg', 'e33.jpg', 'e34.jpg', 'e35.jpg', '36.pdf'
            ],
  bengali:  [ 'b1.png', 'b2.png', 'b3.png', 'b4.png', 'b5.pdf' ],
  gujarati: [ 'g1.jpg', 'g2.png', 'g3.png', 'g4.jpg', 'g5.jpg'],
  hindi:    [ 'h1.png', 'h2.png', 'h3.png', 'h4.pdf', 'h5.png', 'h6.png', 'h7.png', 'h8.png', 'h9.png', 'h10.jpg' ],
  punjabi:  [ 
              'p1.jpg', 'p2.png', 'p3.png', 'p4.png', 'p5.jpg', 'p6.jpg', 'p7.jpg', 'p8.jpg', 'p9.jpg', 'p10.jpg', 'p11.jpg',
              'p12.pdf', 'p13.png', 'p14.pdf', 'p15.png', 'p16.jpg', 'p17.png', 'p18.jpg'
            ],
  tamil:    [ 't1.png', 't2.png', 't3.jpg', 't4.png', 't5.pdf', 't6.png', 't7.png', 't8.png', 't9.png', 't10.png', 't11.pdf', 't12.jpg' ]
}

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

router.get('/resources', function (req, res, next) {
  console.log('/resources');
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
    console.log('email');
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

/* GET downloadable-resources page */
router.get('/downloadable-resources/:language', function (req, res, next) {
  const language = req.params.language;
  const cLanguage = language.toLowerCase();
  let resource = [];
  let error = null;
  if (cLanguage === 'english') {
    resource = dResources.english;
  }
  else if (cLanguage === 'bengali') {
    resource = dResources.bengali;
  }
  else if (cLanguage === 'gujarati') {
    resource = dResources.gujarati;
  }
  else if (cLanguage === 'hindi') {
    resource = dResources.hindi;
  }
  else if (cLanguage === 'punjabi') {
    resource = dResources.punjabi;
  }
  else if (cLanguage === 'tamil') {
    resource = dResources.tamil;
  }
  else {
    error = 'Resource not found.';
    console.log('resource not found.');
  }
  res.render(
    'downloadable-resources', { language: language, resources: resource, error: error }
  );
});

router.post('/downloadable-resources/:language', function (req, res, next) {
  res.setHeader('Content-type', 'text/html');
  res.download(
    path.join(__dirname, "../public/dResources" + req.body.file),
    (err) => {
      if (err) { res.render('downloadable-resources', {downloadError: err}); }
    }
  );
});

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
