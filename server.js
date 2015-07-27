var express = require("express"),
    app = express(),
//bodyParser = require('body-parser'),
//errorHandler = require('errorhandler'),
//methodOverride = require('method-override'),
    hostname = process.env.HOSTNAME || '10.0.59.23',
    port = parseInt(process.env.PORT, 10) || 2015,
    publicDir = process.argv[2] || __dirname + '/';
var sql = require('mssql');


//var compression = require('compression');
app.get("/", function (req, res) {
    res.redirect("/index.html");
});



//app.use(methodOverride());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({
//  extended: true
//}));
//app.use(compression());
app.use(express.static(publicDir));
//app.use(errorHandler({
//  dumpExceptions: true,
//  showStack: true
//}));
//app.use(express.static(__dirname));

var router = express.Router();

var config = {
    user: 'jiraro',
    password: 'P@55SQ!',
    server: '10.0.48.139', // You can use 'localhost\\instance' to connect to named instance
    database: 'JIRA',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

var query  = "SELECT s.pname,COUNT(*) "+
    "FROM jiraissue j "+
    "INNER JOIN PROJECT p on p.ID = j.PROJECT "+
    "INNER JOIN issuestatus s on j.issuestatus = s.ID "+
    "WHERE p.pname = 'ADFAN SACWIS-PR' "+
    "GROUP BY s.pname ";

router.route('/jira')
    .get(function (req, res) {
        var connection = new sql.Connection(config, function(err) {
            var request = new sql.Request(connection); // or: var request = connection.request();
            request.query(query, function(err, recordset) {
                res.send(recordset);
            });
        });
    });



console.log("Simple static server showing %s listening at http://%s:%s", publicDir, hostname, port);
app.use('/mayhem', router);
app.listen(port, hostname);
