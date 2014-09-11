/**
 * Product
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */


module.exports = {

  schema : true,

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/

  	prod_name: {
  		type: 'string',
  		required: true
  	},

  	prod_desc: {
  		type: 'string',
  		required: true
  	},

  	prod_base_price:{
  		type: 'integer',
  		required: true
  	},

    prod_image: {
     
        type: 'string'
       
    },

    createdBy: {
      type: 'string'
    },

  	// feature:{
  	// 	 type: 'boolean',
   //    defaultsTo : false
  	// }

  	// beforeValidation: function(values,next){
   //  console.log(values);
   //  if(typeof values.feature !== 'undefined'){
   //    if(values.feature === 'unchecked'){
   //      values.feature = false;
   //    }else if(values.feature[1] === 'on'){
   //      values.feature = true;
   //    }
   //  }
   //  next();
  	// }

  beforeUpdate: function(values, cb) {
    // accessing the function defined above the module.exports
      console.log("Updating product Information");
      values.prod_name = 'Santosh';
      cb();
    
  }



    
  }

};
