const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv').config();
let dResources = require('../data/dResources.js');
dResources = dResources.dResources;
let pressReleases = require('../data/pressReleases.js');
pressReleases = pressReleases.pressReleases;

/* GET contact page */
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Contact', page: 'contact' });
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
        page: 'contact'
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
      res.render(('contact'), { title: 'Contact', page: 'contact', formSuccess: true });
    }
  }
]);

router.get('/resources', function (req, res, next) {
  console.log('/resources');
  res.render('resources', { title: 'Resources', page: 'resources' });
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
        page: 'resources'
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
      res.render(('resources'), { title: 'Resources', page: 'resources', formSuccess: true });
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
    'downloadable-resources', { language: language, page: 'resources', resources: resource, error: error }
  );
});

router.post('/downloadable-resources/:language', function (req, res, next) {
  // check for .pdf file
  let src = (req.body.file).toString();
  if ( src.slice(0,1) === 'i') {
    src = src.slice(1, src.length-3);
    src = src.concat('pdf');
    console.log(src);
  }

  // Send client downloadable file
  res.setHeader('Content-type', 'text/html');
  res.download(
    path.join(__dirname, "../public/dResources/" + src),
    (err) => {
      if (err) { res.render('downloadable-resources', {downloadError: err, page: 'resources'}); }
    }
  );
});

/* GET BC page */
router.get('/bc', function (req, res, next) {
  res.render('bc', { title: 'Workplace Concerns', page: 'bc' });
});

/* GET about page */
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'About Us', page: 'about' });
});

/* GET media page */
router.get('/media', function (req, res, next) {
  res.render('media', { pressReleases: pressReleases, page: 'media' });
});

/* POST media page
   Download chosen press release
*/
router.post('/media', function(req, res, next) {
  // Send client downloadable file
  res.setHeader('Content-type', 'text/html');
  res.download(
    path.join(__dirname, "../public/dResources/" + req.body.src),
    (err) => {
      if (err) { console.log('errrr'); }
    }
  );
});

router.get('/pressReleases/:pr', function (req, res, next) {
  console.log(req.params.pr);
  res.render('pressRelease', { page: 'media', pr: req.params.pr });
});

/* GET home page */
router.get('/home', function (req, res, next) {
  res.render('home', { title: 'South Asian Covid Task Force', page: 'home' });
});

/* GET default (home) page. */
router.get('/', function (req, res, next) {
  res.redirect('/home');
});

module.exports = router;
