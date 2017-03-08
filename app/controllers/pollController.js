var Polls = require('../models/polls.js')

function PollHandler() {

	//Creates poll from form and stores in db
	this.createPoll = function(req, res){
		var options = req.body.poll_options
		options = options.split(' ')
		var options_votes = []
		for(i = 0; i < options.length; i++){
			options_votes.push(0)
		}
		var newPoll = new Polls()
		newPoll.name = req.body.poll_name
		newPoll.options = options
		newPoll.options_votes = options_votes
		newPoll.owner_id = req.user._id
		newPoll.owner = req.user.github.displayName
		newPoll.date_created = new Date()

		newPoll.save()
		res.redirect('/')
	}

	//Checks db and sends all polls to views as 'polls'
	this.showAll = function(req, res){
		Polls.find({}, function(err, db_polls){
			if(err) {throw err}
			res.locals.polls = db_polls
			res.render('index')
		})
	}

	//Checks db and sends one poll to views as 'poll'
	this.showOne = function(req, res){
		Polls.findOne({ _id: req.params._id }, function(err, db_poll){
			if(err){throw err}
			res.locals.poll = db_poll
			res.render('poll')
		})
	}

	//Checks db and sends all polls belonging to user to views as 'mypolls'
	this.showMine = function(req, res) {
		Polls.find({owner_id: req.user._id}, function(err, db_mypolls){
			if(err){throw err}
			res.locals.mypolls = db_mypolls
			res.render('mypolls')
		})
	}

	//Checks db and removes poll, user must be owner else it wont delete
	this.deletePoll = function(req, res) {
		Polls.remove({_id: req.params._id, owner_id: req.user._id}, function(err){
			if(err) throw err
			res.flash('danger', 'Poll deleted.').redirect('/mypolls')
		})
	}

	//Votes on option and updates database count
	this.vote = function(req, res) {
		if(req.body.alternative === '' || req.body.alternative === undefined){
			var selector = req.body.selector
			var query = 'options_votes.' + selector
			var option = 1 + parseInt(selector)
			req.flash('info', 'You voted for option ' + option + '.') 
			Polls.findOneAndUpdate({ _id: req.params._id }, { $inc: { [query]: 1 } }, function(err, result){
				if(err) throw err

				res.redirect('/poll/' + req.params._id)
			})
		}else{
			var newOption = req.body.alternative
			Polls.findOne({ _id: req.params._id }, function(err, poll) {
				if(err) throw err
				poll.options.push(newOption)
				poll.options_votes.push(1)
				req.flash('info', 'You voted for option ' + newOption + '.') 
				poll.save()
				res.redirect('/poll/' + req.params._id)
			})
		}
	}

}

module.exports = PollHandler