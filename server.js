var express = require('express')

// Call the routes file
var routes = require('./app/routes/index.js')

var mongoose = require('mongoose')
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')


// Initialize de App
var app = express()
require('dotenv').load()
require('./app/config/passport.js')(passport)

mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = global.Promises

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Set view engine to pug
app.set('view engine', 'pug')
app.set('views', './app/views')

// Set static folder
app.use(express.static('./public'))

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

routes(app, passport)




var port = process.env.PORT || 3000;
app.listen(port,  function () {
  console.log('Node.js listening on port ' + port + '...');
});