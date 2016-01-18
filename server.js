var express = require("express"),
	app = express(),
	errorHandler = require('errorhandler'),
	hostname = 'localhost',
	port = 2045,
	publicDir = './dist';

app.get("/", function (req, res) {
	res.redirect("/index.html");
});

app.use(express.static(publicDir));
app.use(errorHandler({
	dumpExceptions: true,
	showStack: true
}));

console.log('Server Started');
app.listen(port, hostname);