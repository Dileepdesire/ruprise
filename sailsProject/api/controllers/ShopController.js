module.exports = {
	 
  //show all shops
  index: function(req,res,next){

  	//Get an array of all Products in the product collection
  	Shop.find(function foundShop(err,shop){
  		if(err) return(err);

  		//pass array to the view
  		res.view({
  			shop : shop
  		});
  	});
  },

  new: function(req,res){
    res.view();
  },

  create: function(req,res,next){
    //create shop with params sent from shop/new.ejs

    Shop.create(req.params.all(), function shopCreated(err,shop){

      //if error
      if(err){
        console.log(err);
        req.session.flash = {
          err: err
        }

        //if error redirect to the add new shop page
        return res.redirect('/shop/new');
      }

      //If shop create sucessfully, redeirect to the show acion
       res.json(shop); //show json 

      //res.redirect('/user/show/'+user.id);
      

    });
  }
};