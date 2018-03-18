// Set variables (change these)
var sLoginName = "admin" // Your WordPress username
var sLoginPassword = 'myoldpassword' // Your current WordPress password
var sNewPassword = 'mynewpassword' // Your new WordPress password

// Initialize CasperJS
var page = require('webpage').create();
var casper = require('casper').create({
     pageSettings: {
         loadImages:  false
     },
     waitTimeout: 4000, // Default wait timeout, for wait* family functions
     logLevel: "debug", // Can be debug, info, warning, error http://docs.casperjs.org/en/latest/logging.html
     verbose: false // Set to true if you want to see where te script fails

});

// Get variables from command-line
var sAdminpath = '/'+(casper.cli.raw.get('adminpath') || 'wp-admin').replace(/\//g,'')+'/' // Optional, default adminpath is 'wp-admin'
var sDomainURL = casper.cli.raw.get(0) // For example: https://mysite.com
if (sDomainURL === undefined){
  casper.echo('Please provide an URL: ea. casper.js https://www.mysite.com','ERROR')
  casper.exit(); // Unfortunatly Casper doesn't really exit (the function is async), please see: , https://github.com/casperjs/casperjs/issues/193
} else {
  casper.echo('['+sDomainURL+'] Running.. ','INFO');
}

// Build the URL's
var sUrLogin = sDomainURL+"/wp-login.php";
var sUrlOptionsPage = sDomainURL+sAdminpath+"profile.php";

// Step 1, go to login URL
casper.start(sUrLogin);

// Step 2, wait for login form to appear
casper.waitForSelector('form[method="post"]', function() {
   // When the form's there, fill it in, and set the redirect URL to the options page
   casper.fillSelectors('form[method="post"]', {
     'input[name="log"]': sLoginName,
     'input[name="pwd"]': sLoginPassword,
     'input[name="redirect_to"]': sUrlOptionsPage
   }, true);
});

// Step 3, wait for the options page to appear
casper.waitForUrl(sUrlOptionsPage, function() {
     this.log('Login succesful', 'debug');
     // Click on the button to generate a pasword, this will show the password input field
     this.click('.wp-generate-pw');
}, function(){
   // If the options page doesn't appear something will have gone wrong with logging in
   // Take a screenshot of it, so we can see the error message
   this.viewport(960, 1000);
   this.capture('./screenshots/login_failed.png', {top: 0,left: 0,width: 960, height: 3000});
   this.log('Log in failed for domain: '+sDomainURL, 'error');
   this.echo('['+sDomainURL+'] Log-in failed','ERROR');
   this.exit();
}, 5000);

// Step 4, wait for the password input field to show
casper.waitForSelector('#pass1', function() {
   // Fill in the new password
   casper.fillSelectors('form[method="post"]', {
     '#pass1': sNewPassword,
     '#pass1-text': sNewPassword
   }, false);
});

// Step 5, wait for the (optional) weak password checkbox to appear
casper.waitUntilVisible('.pw-checkbox', function then() {
     // If checkbox to allow weak password is shown, click it to check the checkbox, this will make the submit button available
     this.click('.pw-checkbox');
}, function onTimeout(){
    // The password is strong enough, so no checkbox is shown, so move on..
},500);

// Step 6, submit the form
casper.then( function() {
   casper.log('.Submit', 'info');
   this.click('input[type="submit"]');
});

// Step 7, show the result notices
casper.waitForSelector('div.notice.updated', function() {
  this.echo( 'WP notice: '+this.fetchText('div.notice.updated p'), 'INFO');
  this.exit();
}, function(){
   this.log('No success message shown for domain: '+sDomainURL, 'error');
}, 5000);

casper.then( function() {
   this.echo('['+sDomainURL+'] Profile not updated','ERROR');
});

// Run the traaaaaap!
casper.run();