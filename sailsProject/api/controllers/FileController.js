/**
 * FileController
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
var im = require('imagemagick');
var UPLOAD_PATH = 'assets/files';

module.exports = {

index: function(req,res){
    res.view();
},
    
 uploadFiles: function(req, res) {
        
        console.log(req.files);
        var fileName = req.files.file.name;
        fs.readFile(req.files.file.path, function (err, data) {

            if(err){
                console.log(err);
            }
          // ...
        var newPath = UPLOAD_PATH+'/'+fileName;
            fs.writeFile(newPath, data, function (err) {
                if(err){
                    console.log(err);
                }
                res.redirect("back");
            });
        });

    }

};
