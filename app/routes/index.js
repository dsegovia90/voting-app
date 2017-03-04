
var authenticated = false

module.exports = function(app, passport){

	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()){
			authenticated = true
			return next();
		}else{
			authenticated = false
			res.redirect('/login')
		}
	}

	app.route('/')
		.get(function(req, res){
			res.render('index', {
			// if authenticated pass true, if not pass false.
				authenticated: authenticated
			})
		})

	app.route('/mypolls')
		.get(isLoggedIn, function(req, res){
			res.render('mypolls', {
			// if authenticated pass true, if not pass false.
				authenticated: authenticated
			})
		})	

	app.route('/createpoll')
		.get(isLoggedIn, function(req, res){	
			res.render('createpoll', {
			// if authenticated pass true, if not pass false.
				authenticated: authenticated
			})
		})
		
	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			authenticated = false
			res.redirect('/login');
		});

	app.route('/login')
		.get(function(req, res){
			if(!authenticated){
				res.render('login', {
				// if authenticated pass true, if not pass false.
					authenticated: authenticated
				})
			}else{
				res.redirect('/')
			}
		})

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.get('/auth/github/callback', 
	  passport.authenticate('github', { failureRedirect: '/login' }),
	  function(req, res) {
	  	authenticated = true
	    // Successful authentication, redirect home.
	    res.redirect('/');
  });
}