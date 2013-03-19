/**
 * Module dependencies.
 */

var express = require('express'),
    app = module.exports = express.createServer(),

    // SimpleUser Setup - Step 1. - Connect to a mongo database via Mongolian
    Mongolian = require('mongolian'),
    db = new Mongolian('mongo://localhost:27017/simpleuser'),

    // SimpleUser Setup - Step 2. - Create a simpleuser instance by passing in a config containing a mongo collection
    simpleuser = require('simpleuser')({ collection: db.collection('users') });

// Configuration
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

    // SimpleUser Setup - Step 3. - If you intend to use SimpleUser default views then you'll need to set layout to false in your view options.
	app.set('view options', { layout: false });

	app.use(express.bodyParser());
	app.use(express.methodOverride());

    // SimpleUser Setup - Step 4. - Ensure you have sessions setup properly or SimpleUser won't keep your users logged in
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'changeThisAndKeepItSecret!' }));

	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});


// Routes

// Index
app.get('/', function(req, res){
    res.render('index', { title: 'SimpleUser Boilerplate' });
});	

// SimpleUser Setup - Step 5. - Setup a route to your signup view. 
app.get('/signup', function(req, res){
    res.render(simpleuser.signupTemplate, { title: 'flatform', msg: 'Signup' });
});	

// SimpleUser Setup - Step 6. - Setup a route to your login view. 
app.get('/login', function(req, res){
    res.render(simpleuser.loginTemplate, { title: 'SimpleUser - Login', msg: 'Login' });
});	

// SimpleUser Setup - Step 7. - Setup a route to a protected view. 
app.get('/protected', simpleuser.authenticate, function(req, res){
    res.render(simpleuser.messageTemplate, { title: 'SimpleUser - Protected', msg: 'This is a protected resource.' });
});	

// SimpleUser Setup - Step 8. - Setup a route to post login to. 
app.post('/login', simpleuser.authenticate, function(req, res){
    res.render(simpleuser.messageTemplate, { title: 'SimpleUser - Logged In', msg: 'You are now logged in.' });
});	

// SimpleUser Setup - Step 9. - Setup a route to post logout to. 
app.post('/logout', simpleuser.logout, simpleuser.loggedOut);

// SimpleUser Setup - Step 10. - Setup a route to post signup to. 
app.post('/signup', simpleuser.save, simpleuser.saved);	


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

