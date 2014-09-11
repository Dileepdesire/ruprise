/**
 * UserController
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
var passport = require('passport');

module.exports = {
    

  'new' : function (req,res){
  	res.view();
  	
  },

  create: function (req,res,next) {
  	//create user with params sent from
  	//the signup form i.e new.ejs

  	User.create(req.params.all(), function userCreated(err,user){

  		//if error
  		if(err){
  			console.log(err);
  			req.session.flash = {
  				err: err
  			}

  			//if error redirect to the signup page
  			return res.redirect('/user/new');
  		}

      //Log user in
      req.session.authenticated = true;
      req.session.User = user;

  		//If user create sucessfully, redeirect to the show acion
  		// res.json(user); //show json 

  		res.redirect('/user/show/'+user.id);
  		

  	});


  },

  //show user details
  show: function(req,res,next){
  	User.findOne(req.param('id'), function foundUser(err,user) {
  		if(err) return next(err);

  		if(!user) return next();

  		res.view({
  			user: user
  		});
  	});
  },

  //show all users
  index: function(req,res,next){

  	// console.log(new Date());
  	// console.log(req.session.authenticated);

  	//Get an array of all users in the user collection
  	User.find(function foundUser(err,user){
  		if(err) return(err);

  		//pass array to the view
  		res.view({
  			user : user
  		});
  	});
  },

  //edit action 
  edit: function(req,res,next){

  	//Find the user by id 
  	User.findOne(req.param('id'),function foundUser(err,user){
  		if(err) return next(err);
  		if(!user) return next();

  		res.view({
  			user:user
  		});
  	});
  },

  //update the value from edit form
  update: function(req,res,next){
  	User.update(req.param('id'),req.params.all(), function userUpdated(err){
  		if(err) {
  			return res.redirect('/user/edit/'+req.param('id'));
  		}

  		res.redirect('/user/show/'+req.param('id'));
  	});
  },

  //delete action
  destroy: function(req,res,next){

  	User.findOne(req.param('id'), function foundUser(err,user){

  		if(err) return next(err);

  		if(!user) return next('User doesn\'t exists.');

  		User.destroy(req.param('id'), function userDestroyed(err){
  			if(err) return next(err);
  		});

  		res.redirect('/user');

  	});
  },

  //Facebook Login 

  'login': function (req, res) {
    res.view();
  },

  'dashboard': function (req, res) {
    res.view();
  },

  logout: function (req, res){
    req.session.User = null;
    console.log("You have logged out");
    req.session.flash = 'You have logged out';
    res.redirect('user/login');
  },

  addShop: function(req,res){
    console.log("Adding Shop");
  },

  'facebook': function (req, res, next) {
     passport.authenticate('facebook', { scope: ['email', 'user_about_me']},
        function (err, user) {
            req.logIn(user, function (err) {
            if(err) {
                console.log("There was an error");
                req.session.flash = 'There was an error';
                res.redirect('user/login');
            } else {
                req.session.User = user;
                req.session.User.admin = true;
                res.redirect('/user/dashboard');
            }
        });
    })(req, res, next);
  },

  'facebook/callback': function (req, res, next) {
     passport.authenticate('facebook',
        function (req, res) {
            res.redirect('/user/dashboard');
        })(req, res, next);
  }


};
