module.exports = function(req,res,ok){
	
	var sessionUserMatchesId = req.session.User.id == req.param('id');
	var isAdmin = req.session.User.admin;

	//The requested id doesnot match the user's id
	//and this is not an admin
	if(!(sessionUserMatchesId || isAdmin)){
		var noRightsError = [{name: 'noRights', message:'you must be an admin'}]

		req.session.flash = {
			err: noRightsError
		}
		res.redirect('/session/new');
		return;
	}

	ok();
};