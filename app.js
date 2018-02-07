/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');
const Player = require('./models/Player');
const shoot5Json = require("./json/shoot5");
const shoot8Json = require("./json/shoot8");
const shootZoneJson = require("./json/shootzone");
const driveStatsJson = require("./json/drives");
const catchShootStatsJson = require("./json/catchshoot");
const usageStatsJson = require("./json/usage");


const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');

/**
 * API keys and Passport configuration.
 */
//const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
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
/*app.use(session({
  resave: true,
  saveUninitialized: true,
  //secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));*/
/**
 * Primary app routes.
 */


app.get('/', homeController.index);
app.get('/sample', homeController.sample);
app.get('/search', homeController.search);
app.get('/details', homeController.details);
app.get('/playerlist', homeController.playerList);
app.get('/getall', homeController.getAllPlayers);
app.get('/build', homeController.build);

app.use(errorHandler());
/**
 * Initialize Database
 */


var shoot5Stats = shoot5Json.resultSets.rowSet;
/*
...
<5ft
5	"FGM"
6	"FGA"
7	"FG_PCT"
5-9ft
8	"FGM"
9	"FGA"
10	"FG_PCT"
*/

//http://stats.nba.com/stats/leaguedashplayershotlocations?DateFrom=&DateTo=&DistanceRange=8ft+Range&Division=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=G&PlusMinus=N&Rank=N&Season=2017-18&SeasonSegment=&SeasonType=Regular+Season&StarterBench=&TeamID=0&VsConference=&VsDivision=
var shoot8Stats = shoot8Json.resultSets.rowSet;
/*
0	"PLAYER_ID"
1	"PLAYER_NAME"
2	"TEAM_ID"
3	"TEAM_eABBREVIATION"
4	"AGE"
<8ft
5	"FGM"
6	"FGA"
7	"FG_PCT"
9-16ft
8	"FGM"
9	"FGA"
10	"FG_PCT"
16-24ft
11	"FGM"
12	"FGA"
13	"FG_PCT"
24ft+
14	"FGM"
15	"FGA"
16	"FG_PCT"
backcourt
17	"FGM"
18	"FGA"
19	"FG_PCT"
*/


var shootZoneStats = shootZoneJson.resultSets.rowSet;
//var Player = mongoose.model('Player', playerSchema);
/*
...
in restricted zone
5	"FGM"
6	"FGA"
7	"FG_PCT"
...
*/


//http://stats.nba.com/stats/leaguedashptstats?DateFrom=&DateTo=&Division=&GameScope=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PerMode=PerGame&PlayerExperience=&PlayerOrTeam=Player&PlayerPosition=G&PtMeasureType=Drives&Season=2017-18&SeasonSegment=&SeasonType=Regular+Season&StarterBench=&TeamID=0&VsConference=&VsDivision=
var driveStats = driveStatsJson.resultSets[0].rowSet;

/*
8	"DRIVES"
9	"DRIVE_FGM"
10	"DRIVE_FGA"
...
*/



//http://stats.nba.com/stats/leaguedashptstats?DateFrom=&DateTo=&Division=&GameScope=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PerMode=PerGame&PlayerExperience=&PlayerOrTeam=Player&PlayerPosition=G&PtMeasureType=CatchandShoot&Season=2017-18&SeasonSegment=&SeasonType=Regular+Season&StarterBench=&TeamID=0&VsConference=&VsDivision=
var catchShootStats = catchShootStatsJson.resultSets[0].rowSet;
/*
...
8	"CATCH_SHOOT_FGM"
9	"CATCH_SHOOT_FGA"
10	"CATCH_SHOOT_FG_PCT"
...
 */




//http://stats.nba.com/stats/leaguedashplayerstats?&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Usage&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=G&PlusMinus=N&Rank=N&Season=2017-18&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=
var usageStats = usageStatsJson.resultSets[0].rowSet;
/*
...
10	"USG_PCT"
...
20	"PCT_AST"
21	"PCT_TOV"
...
 */


for(var i =0; i<shoot8Stats.length/5;i++) {
    if (shoot8Stats[i][0] == driveStats[i][0] && shoot8Stats[i][0] == catchShootStats[i][0] && driveStats[i][7] != null
        && driveStats[i][7]/driveStats[i][4] > 10) {
        //Get field goals from various areas at the rim, close range, mid range, and 3pters
        var totalFga = shoot8Stats[i][6] + shoot8Stats[i][9] + shoot8Stats[i][12] + shoot8Stats[i][15]
        var totalFgm = shoot8Stats[i][5] + shoot8Stats[i][8] + shoot8Stats[i][11] + shoot8Stats[i][14]
        var total3ptFga = shoot8Stats[i][15];
        var total3ptFgm = shoot8Stats[i][14];
        var totalRimFga = shootZoneStats[i][6];
        var totalRimFgm = shootZoneStats[i][5];
        var totalCloseFga = shoot5Stats[i][6] + shoot5Stats[i][9] - totalRimFga;
        var totalCloseFgm = shoot5Stats[i][5] + shoot5Stats[i][8] - totalRimFgm;;
        var totalMidrangeFga = totalFga - total3ptFga - totalCloseFga - totalRimFga;
        var totalMidrangeFgm = totalFgm - total3ptFgm - totalCloseFgm - totalRimFgm;


        var driveFga = (driveStats[i][10] / totalFga * 100).toFixed(2)
        var catchShootFga = (catchShootStats[i][9] / totalFga * 100).toFixed(2)

        var player1 = new Player({
            _id: shoot8Stats[i][0],
            teamId: shoot8Stats[i][2],
            name: shoot8Stats[i][1],
            team: shoot8Stats[i][3],
            rimfga: (totalRimFga / totalFga * 100).toFixed(2),
            rimfgp: (totalRimFgm / totalRimFga * 100).toFixed(2),
            closefga: (totalCloseFga / totalFga * 100).toFixed(2),
            closefgp: (totalCloseFgm / totalCloseFga * 100).toFixed(2),
            midrangefga: (totalMidrangeFga / totalFga * 100).toFixed(2),
            midrangefgp: (totalMidrangeFgm / totalMidrangeFga * 100).toFixed(2),
            threefga: (total3ptFga / totalFga * 100).toFixed(2),
            threefgp: (total3ptFgm / total3ptFga * 100).toFixed(2),
            drivefga: driveFga,
            catchshootfga : catchShootFga,
            ast: (usageStats[i][20]*100).toFixed(2),
            tov: (usageStats[i][21]*100).toFixed(2),
            usg: (usageStats[i][10]*100).toFixed(2)

        });
        console.log(player1);
        /*player1.save(function (err) {
            if (err) {
                console.log(err);
            }
        })*/
    }
}
/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
