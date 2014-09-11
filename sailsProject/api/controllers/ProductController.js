/**
 * ProductController
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

 var fs = require('fs');
 var path = require('path');
 var mkdirp = require('mkdirp');
 var im = require('imagemagick');
 var UPLOAD_PATH = 'assets/images/uploads/';
// var UPLOAD_PATH1= '/assets/images/testFolder';

module.exports = {
    
  'new' : function (req,res){
  	res.view();
  	
  },

  create: function (req,res,next) {
  	//create product with params 
    var extName = path.extname(req.files.prod_image.name);
    var fileName = req.param('id')+extName;
    var newPath = UPLOAD_PATH +fileName;
    var thumbPath = UPLOAD_PATH+"thumbs/"+fileName;

    var productObj = {
        prod_name: req.param('prod_name'),
        prod_desc: req.param('prod_desc'),
        prod_base_price: req.param('prod_base_price'),
        prod_image: fileName,
        createdBy: req.param('createdBy')
    }

  	Product.create(productObj, function productCreated(err,product){

  		//if error
  		if(err){
  			console.log(err);
  			req.session.flash = {
  				err: err
  			}
        //if error redirect to the product create page
        return res.redirect('/product/new');
      }

      if(req.files.prod_image.name!=''){
      //move file to UPLOAD_PATH
      fs.readFile(req.files.prod_image.path, function (err, data) {
          
          fs.exists(newPath, function(exists) { 
            
                console.log('Uploading image started....');

                /// write file to uploads/thumbs folder
                im.resize({
                  srcPath: newPath,
                  dstPath: thumbPath,
                  //width:   200,
                  height:  200
                  }, function(err, stdout, stderr){
                    if (err) {
                        throw err;
                      }
                      console.log('resized image to fit within 200x200px');
                  });

                fs.writeFile(newPath, data, function (err) {
                if (err) 
                console.log(err);
                res.redirect('/product/show/'+product.id);
                 }); 

          });

      
       });   

      }
  		//res.redirect('/product/');
  		

  	});


  },

  //show product details
  show: function(req,res,next){
  	Product.findOne(req.param('id'), function foundProduct(err,product) {
  		if(err) return next(err);

  		if(!product) return next();

  		res.view({
  			product: product
  		});
  	});
  },



  //show all products
  index: function(req,res,next){

  	//Get an array of all Products in the product collection
  	Product.find(function foundProduct(err,product){
  		if(err) return(err);

  		//pass array to the view
  		res.view({
  			product : product
  		});
  	});
  },

  //edit action 
  edit: function(req,res,next){

  	//Find the product by id 
  	Product.findOne(req.param('id'),function foundProduct(err,product){
  		if(err) return next(err);
  		if(!product) return next();

  		res.view({
  			product: product
  		});
  	});
  },

  //update the value from edit form
  update: function(req,res,next){
    //var fs = require('fs');
    var extName = path.extname(req.files.prod_image.name);
    var fileName = req.param('id')+extName;
    var newPath = UPLOAD_PATH +fileName;
    var thumbPath = UPLOAD_PATH+"thumbs/"+fileName;

    var productObj = {
        prod_name: req.param('prod_name'),
        prod_desc: req.param('prod_desc'),
        prod_base_price: req.param('prod_base_price'),
        prod_image: fileName,
        createdBy: req.param('createdBy')
    }
    
  	Product.update(req.param('id'),productObj, function productUpdated(err){
  		if(err) {
  			//console.log(err);
  			req.session.flash = {
  				err: err
  			}

  		 	return res.redirect('/product/edit/'+req.param('id'));
  		}

      //console.log(req.files);
      //console.log("File Name :"+req.files.prod_image['name']);

     // prod_image = req.files.prod_image['name'];



      if(req.files.prod_image.name!=''){
      //move file to UPLOAD_PATH
      fs.readFile(req.files.prod_image.path, function (err, data) {
          
          //req.param('prod_image') = newPath; 
          fs.exists(newPath, function(exists) { 
            // if (exists) { 
            //   console.log('File already exists');
      

            //   res.redirect('/product/edit/'+req.param('id'));

            // } else{

                console.log('Uploading image started....');

                /// write file to uploads/thumbs folder
                im.resize({
                  srcPath: newPath,
                  dstPath: thumbPath,
                  //width:   200,
                  height:  200
                  }, function(err, stdout, stderr){
                    if (err) {
                        throw err;
                      }
                      console.log('resized image to fit within 200x200px');
                  });

                fs.writeFile(newPath, data, function (err) {
                if (err) 
                console.log(err);
                res.redirect('/product/show/'+req.param('id'));
                 });

            //}

            // end of file upload

          });

      
       });   

      }

      //Product.create({createdbBy: 'admin'});
      // Product.update({prod_name: 'Water Bottle', prod_desc: 'Hot and cold Water', prod_base_price:33131, createdBy: 'admin', prod_image: 'abc.jpg'}).done(function(error, product) {
      //           if (error) {
      //               res.send(error);
      //           } else {
      //               console.log('Added Succesfully');
      //           }
      //         });

       //check if the directory exists
          // fs.exists(UPLOAD_PATH1, function(exists) {
          // if (!exists) {
          //     mkdirp('/assets/images/testFolder', function (err) {
          //     if (err) console.error(err)
          //     else console.log('Folder Created')
          //     });
          // }
          // });  
      //console.log(req.params.all());
  		
  	});
  },

  //delete action
  destroy: function(req,res,next){

  	Product.findOne(req.param('id'), function foundProduct(err,product){

  		if(err) return next(err);

  		if(!product) return next('Product doesn\'t exists.');

  		Product.destroy(req.param('id'), function productDestroyed(err){
  			if(err) return next(err);
  		});

  		res.redirect('/product');

  	});
  },

  //search product according to their login
  myProduct: function(req,res,next){
    //console.log(req.session.User);

    Product.find({ createdBy: req.session.User.id}).done(function(err, product) {
      if(err) {
        console.log("Coundnot find products");
        console.log(err);
      } 

      if(!product) return next('Product doesn\'t exists.');

      //pass array to the view
      res.view({
        product : product
      });

    });

  },

  //Get the latest 10 products

  latestProduct: function(req,res,next){

    Product.find().paginate({page:1, limit:10}).sort('createdAt DESC').done(function(err, product) {

    // Error handling
    if (err) {
      return console.log(err);

    // Found multiple users!
    } else {
      //send product to homepage(static/index.ejs)
      res.view({
        product : product
      });
    }
  });
},

addToCart: function(req,res,next){
    Product.find(req.param('id')).done(function(err,product){
      if(err)
        console.log(err);

      req.session.cart = req.param('id'); 
      console.log("Add to cart : "+req.session.cart);
      res.redirect('/product/latestProduct');
    });
  }
  
};
