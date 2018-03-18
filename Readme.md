# WordPress Bulk Password Changer
Helps you change the password of a user on multiple WordPress sites quickly.

## Goal
Imagine having accounts on different WordPress sites that have the same username and password, and suddenly you get the urge to change your password for all these sites. This script logs in and uses the profile page to change it.

## How does it work?
This script makes use of [PhantomJS](http://phantomjs.org) (A headless browser) and [CasperJS](http://casperjs.orgl) (Navigating scripting) to login to the WP sites, change the password, and return feedback of the result.

## OK, I'm sold, set me up!

Sure thing, just follow the steps below:

1. Install [PhantomJS](http://phantomjs.org/download.html)
2. Install [CasperJS](http://docs.casperjs.org/en/latest/installation.html)
3. Alter the default variables in the script `sLoginName`, `sLoginPassword` and `sNewPassword`.
4. Run the script for a single site to make sure it's working correctly using the following command: `casperjs src/wp-bulk-psw-change.js http://www.your.site`
5. By default the script uses the 'wp-admin' path to log in, you can change this using: --adminpath="my-hidden-backend-path"
6. If all goes well you should see a green-colored message like this: `WP notice: Profile updated`.
* Please beware: This doesn't always mean it was successful. If you update a password on the profile page WP returns a <div> with classes `notice` and `updated`. This can be the success message, but also a message from a plug-in. There is no way to check if it really was succesfull because the message is dependent on the language you run the WP backend in.

## Nice, but that's only one site. You promised Bulk!

Calm down, you can automate it for more sites using Bash to feed your URL's

1. Create a textfile (sites.txt) containing all your URL's, 1 per line:
    http://mysite.com 
    https://www.anothersite.com
    http://andyetanother.com/intranet

2. Use bash to run the script on every of the sites with this command: 
 `for i in 'cat sites.txt'; do src/wp-bulk-psw-change.js $i; done`

## FAQ
Q: Why not use [WP-CLI](http://wp-cli.org) for changing passwords?
A: Well...  you should! But unfortunately it's not always available on your hosting.

Q: Which WordPress versions does it work with?
A: I've only tested it with 4.9.x so far.

Q: Does it also work with captcha protected logins?
A: No, it's just a login script, not Skynet. 
