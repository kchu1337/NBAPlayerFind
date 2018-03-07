const mongoose = require('mongoose')
const Player = require('../models/Player');
const shoot5Json = require("../json/shoot5");
const shoot8Json = require("../json/shoot8");
const shootZoneJson = require("../json/shootzone");
const driveStatsJson = require("../json/drives");
const catchShootStatsJson = require("../json/catchshoot");
const usageStatsJson = require("../json/usage");

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
13	"AST_PCT"
14	"AST_TO"
15	"AST_RATIO"
...
19	"TM_TOV_PCT"
...
22	"USG_PCT"
...
 */



for(var i =0; i<shoot8Stats.length;i++) {
    if (shoot8Stats[i][0] == driveStats[i][0] && shoot8Stats[i][0] == catchShootStats[i][0] && driveStats[i][7] != null
        && driveStats[i][7]/driveStats[i][4] > 10) {
        //Get field goals from various areas at the rim, close range, mid range, and 3pters
        var name = shoot8Stats[i][1];
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
            rimFga: (totalRimFga / totalFga * 100).toFixed(2),
            rimFgp: (totalRimFgm / totalRimFga * 100).toFixed(2),
            closeFga: (totalCloseFga / totalFga * 100).toFixed(2),
            closeFgp: (totalCloseFgm / totalCloseFga * 100).toFixed(2),
            midrangeFga: (totalMidrangeFga / totalFga * 100).toFixed(2),
            midrangeFgp: (totalMidrangeFgm / totalMidrangeFga * 100).toFixed(2),
            threeFga: (total3ptFga / totalFga * 100).toFixed(2),
            threeFgp: (total3ptFgm / total3ptFga * 100).toFixed(2),
            driveFga: driveFga,
            catchshootFga: catchShootFga,
            ast: usageStats[i][15],
            tov: usageStats[i][19],
            usg: (usageStats[i][22] * 100).toFixed(2)

        });
        //console.log(player1);
        player1.save(function (err) {
            if (err) {
                console.log(name + " has an error");
            }
        })
    }

}
