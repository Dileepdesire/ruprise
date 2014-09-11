/**
 * SessionController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var bcrypt = require('bcrypt');


module.exports = {
    
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionController)
   */
  //_config: {}

  'new': function(req,res){

  	// var oldDateObj = new Date();
  	// var newDateObj = new Date(oldDateObj.getTime()+60000);
  	// req.session.cookie.expires = newDateObj;

  	// req.session.authenticated = true;
  	// console.log(req.session);
  	
  	res.view('session/new');
  },

  create: function(req,res,next){

  	//check for email and password in params  sent via the form,
  	// if none redirect to sigin form

  	if(!req.param('email') || !req.param('password')){

  		var usernamePasswordRequiredError = [{name:'usernamePasswordRequired', message:'You must enter username and password.'}]

  		//Remember that err is the object being passed down (a.k.a flash.err) whose value is 
  		// another object with the key of usernamePasswordRequiredError

  		req.session.flash = {
  			err: usernamePasswordRequiredError
  		} 

  		res.redirect('/session/new');
  		return;
  	}


  	//Try to find the user by their email address
  	User.findOneByEmail(req.param('email')).done(function(err,user){
  		if(err) return next(err);

  		//if no user is found
  		if(!user){
  			var noAccountError = [{name:'noAccount', message: 'The email ' + req.param('email')+' doesn\'t exist.'}]
  			req.session.flash = {
  				err: noAccountError
  			}
  			res.redirect('/session/new');
  			return;
  		}

  	// Compare the password from param to the encrpted password 
  	bcrypt.compare(req.param('password'), user.encryptedPassword, function foundUser(err,valid) {
  		if(err) return next(err);

  		//if the password from form doesn't match the password in database
  		if(!valid){
  			var usernamePasswordMismatchError = [{name:'usernamePasswordMismatch', message: 'Invalid username and password combination.'}]
  			req.session.flash = {
  				err: usernamePasswordMismatchError
  			}
  			res.redirect('/session/new');
  			return;
  		}

  		//Log user in
  		req.session.authenticated = true;
  		req.session.User = user;
      

      //If the user is also admin redirect to user list
      //This is used in conjuction with config/policies.js
      if(req.session.User.admin){
        //res.redirect('/user');
        res.redirect('/user/show/'+user.id);
        return;
      }
      else{
  		//redirect to the user profile 
  		res.redirect('/user/show/'+user.id);
  	  }
    });

  	});
  },

  //Logout ( Destroy) function

  destroy: function(req,res,next){

  	//wipe out the session (logout)
  	req.session.destroy();

  	//Redirect the browser to the signin form
  	res.redirect('/session/new');
  }

  
};
