


module.exports = function(app, passport){

	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()){
			return next();
		}else{
			res.redirect('/login')
		}
	}

	app.use(function(req, res, next) {
	  res.locals.user = req.user;
	  next();
	});

	app.route('/')
		.get(function(req, res){
			res.render('index')
		})

	app.route('/mypolls')
		.get(isLoggedIn, function(req, res){
			res.render('mypolls')
		})	

	app.route('/createpoll')
		.get(isLoggedIn, function(req, res){	
			res.render('createpoll')
		})
		
	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/login')
		.get(function(req, res){
			if(!req.isAuthenticated()){
				res.render('login')
			}else{
				res.redirect('/')
			}
		})

	app.route('/auth/github')
		.get(passport.authenticate('github'))

	app.get('/auth/github/callback', 
	  passport.authenticate('github', { failureRedirect: '/login' }),
	  function(req, res) {
	    res.redirect('/')
  })
}