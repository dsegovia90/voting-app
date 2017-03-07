var Polls = require('../models/polls.js')

function PollHandler() {

	this.createPoll = function(req, res){
		console.log('creating a poll')
		console.log(req.body)
		var options = req.body.poll_options
		for (i = 0; i < options.length; i++) {
			if(options[i] === ''){
				options.splice(i, 1)
				i--
			}
		}
		var options_votes = []
		for(i = 0; i < options.length; i++){
			options_votes.push(0)
		}
		console.log(options_votes)
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

	this.showAll = function(req, res){
		Polls.find({}, function(err, db_polls){
			if(err) {throw err}
			res.locals.polls = db_polls
			res.render('index')
		})
	}

	this.showOne = function(req, res){
		Polls.findOne({ _id: req.params._id }, function(err, db_poll){
			if(err){throw err}
			res.locals.poll = db_poll
			res.render('poll')
		})
	}

	this.showMine = function(req, res) {
		Polls.find({owner_id: req.user._id}, function(err, db_mypolls){
			if(err){throw err}
			res.locals.mypolls = db_mypolls
			console.log(db_mypolls.length)
			console.log(typeof db_mypolls)
			res.render('mypolls')
		})
	}

	this.deletePoll = function(req, res) {
		Polls.remove({_id: req.params._id, owner_id: req.user._id}, function(err){
			if(err) throw err
			res.redirect('/mypolls')
		})
	}

	this.vote = function(req, res) {
		console.log(req.body)
		var query = 'options_votes.' + req.body.selector

		console.log(typeof req.body.selector)
		Polls.findOneAndUpdate({ _id: req.params._id}, { $inc: { ['options_votes.'+req.body.selector]: 1 } }, function(err, result){
			if(err) throw err
			res.redirect('/poll/' + req.params._id)
		})

	}

}

module.exports = PollHandler