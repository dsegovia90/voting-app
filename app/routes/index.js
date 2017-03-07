
var PollHandler = require('../controllers/pollController.js')

var pollHandler = new PollHandler();	

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
		.get(pollHandler.showAll)

	app.route('/mypolls')
		.get(isLoggedIn, pollHandler.showMine)	

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


  // Create new poll
	app.route('/createpoll')
		.post(isLoggedIn, pollHandler.createPoll)
	// Go to poll with :id
	app.route('/poll/:_id')
		.get(pollHandler.showOne)
		.post(pollHandler.vote)
	// Delete poll with :id (user must be owner, else it won't find the poll to delete)
	app.route('/poll/:_id/delete')
		.get(isLoggedIn, pollHandler.deletePoll)
}