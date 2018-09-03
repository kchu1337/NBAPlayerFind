/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');

require("./configs/database.js");
dotenv.load({ path: '.env.example' });

/**
 * Create Express server.
 */
const app = express();


/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());


/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const routeController = require('./controllers/route');

/**
 * Primary app routes.
 */
//returns home page
app.get('/', routeController.search);
//loads search page
app.get('/search', routeController.search);
//shows webpage of all players
app.get('/playerlist', routeController.playerList);
//shows webpage of specific player
app.get('/details', routeController.details);
//redirects to initial clusterize page
app.get('/cluster', routeController.clusterInitial);
app.get('/getPlayer', homeController.getplayer);
//returns top 5 matches
app.post('/search', homeController.getSearchResults);
//returns json list of all players
app.get('/getall', homeController.getAllPlayers);
//returns percentile of fg%,ast,tov,usg
app.get('/getPercentiles', homeController.getPercentiles);
app.post('/cluster', homeController.clusterize);
app.get('/getdefinitions', homeController.getDefinitions);

app.use(errorHandler());

/**
 * Initialize Database
 */
/*Player.find({}).then(function (result) {
    if (result == null || result.length < 1) {
        require("./configs/database.js");
    }
});*/

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
