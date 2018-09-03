const shoot5Json = require("../json/shoot5");
const shoot8Json = require("../json/shoot8");
const shootZoneJson = require("../json/shootzone");
const driveStatsJson = require("../json/drives");
const catchShootStatsJson = require("../json/catchshoot");
const usageStatsJson = require("../json/usage");
const pullupJson = require("../json/pullup");
const dynamo = require("../helpers/dynamo");



const shoot5Stats = shoot5Json.resultSets.rowSet;
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
const shoot8Stats = shoot8Json.resultSets.rowSet;
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


const shootZoneStats = shootZoneJson.resultSets.rowSet;
/*
...
in restricted zone
5	"FGM"
6	"FGA"
7	"FG_PCT"
...
*/


//http://stats.nba.com/stats/leaguedashptstats?DateFrom=&DateTo=&Division=&GameScope=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PerMode=PerGame&PlayerExperience=&PlayerOrTeam=Player&PlayerPosition=G&PtMeasureType=Drives&Season=2017-18&SeasonSegment=&SeasonType=Regular+Season&StarterBench=&TeamID=0&VsConference=&VsDivision=
const driveStats = driveStatsJson.resultSets[0].rowSet;
/*
0   PLAYER_ID
1   PLAYER_NAME
2   TEAM_ID
4   GP
...
7   MIN
8	"DRIVES"
9	"DRIVE_FGM"
10	"DRIVE_FGA"
11  "DRIVE_FG_PCT"
12  "DRIVE_FTM"
13  "DRIVE_FTA"
...
*/



//http://stats.nba.com/stats/leaguedashptstats?DateFrom=&DateTo=&Division=&GameScope=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PerMode=PerGame&PlayerExperience=&PlayerOrTeam=Player&PlayerPosition=G&PtMeasureType=CatchandShoot&Season=2017-18&SeasonSegment=&SeasonType=Regular+Season&StarterBench=&TeamID=0&VsConference=&VsDivision=
const catchShootStats = catchShootStatsJson.resultSets[0].rowSet;
/*
...
8	"CATCH_SHOOT_FGM"
9	"CATCH_SHOOT_FGA"
10	"CATCH_SHOOT_FG_PCT"
...
13  "CATCH_SHOOT_FG3A"
 */




//http://stats.nba.com/stats/leaguedashplayerstats?&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Usage&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=G&PlusMinus=N&Rank=N&Season=2017-18&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=
const usageStats = usageStatsJson.resultSets[0].rowSet;
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

const pullupStats = pullupJson.resultSets[0].rowSet;
/*
8	"PULL_UP_FGM"
9	"PULL_UP_FGA"
10	"PULL_UP_FG_PCT"
11	"PULL_UP_FG3M"
12	"PULL_UP_FG3A"
...
 */


//removes misatched players
function removeId(id,i){



    (shoot8Stats[i][0] === id)?shoot8Stats.splice(i,1):null;

    (shoot5Stats[i][0] === id)? shoot5Stats.splice(i,1):null;

    (shootZoneStats[i][0] === id)?shootZoneStats.splice(i,1):null;

    (driveStats[i][0] === id)?driveStats.splice(i,1):null;

    (pullupStats[i][0] === id)?pullupStats.splice(i,1):null;

    (usageStats[i][0] === id)?usageStats.splice(i,1):null;

    (catchShootStats[i][0] === id)?catchShootStats.splice(i,1):null;

}


for(let i =0; i<shoot5Stats.length; i++) {
    //checks consistency of data
  //console.log(shoot8Stats[i][0]+" "+ driveStats[i][0]+" "+ shootZoneStats[i][0]+" "+ pullupStats[i][0]+" "+ catchShootStats[i][0]+" "+ usageStats[i][0]);
    if (shoot8Stats[i][0] !== driveStats[i][0] || shoot8Stats[i][0] !== catchShootStats[i][0]
        || shoot8Stats[i][0] !== shoot5Stats[i][0] || shoot8Stats[i][0] !== shootZoneStats[i][0]
        || shoot8Stats[i][0] !== pullupStats[i][0] || shoot8Stats[i][0] !== usageStats[i][0]) {
        removeId(shoot8Stats[i][0],i);
        i--;
    }
    else {

      // filters min>15 & gp>10
      if (driveStats[i][7] > 15 && driveStats[i][4] > 10) {
        //Get field goals from various areas at the rim, close range, mid range, and 3pters
        const totalFga = shoot8Stats[i][6] + shoot8Stats[i][9] + shoot8Stats[i][12] + shoot8Stats[i][15];
        const totalFgm = shoot8Stats[i][5] + shoot8Stats[i][8] + shoot8Stats[i][11] + shoot8Stats[i][14];
        const total3ptFga = shoot8Stats[i][15];
        const total3ptFgm = shoot8Stats[i][14];
        //within circle
        const totalRimFga = shootZoneStats[i][6];
        const totalRimFgm = shootZoneStats[i][5];
        //5-10 ft
        const totalCloseFga = shoot5Stats[i][6] + shoot5Stats[i][9] - totalRimFga;
        const totalCloseFgm = shoot5Stats[i][5] + shoot5Stats[i][8] - totalRimFgm;

        //11-24 ft
        const totalMidrangeFga = totalFga - total3ptFga - totalCloseFga - totalRimFga;
        const totalMidrangeFgm = totalFgm - total3ptFgm - totalCloseFgm - totalRimFgm;

        //total field goal attempts by type (C&S, drive, pullup, postup)
        //adds half of fta to fga
        const typeTotalFga = driveStats[i][10] + driveStats[i][13] / 2 + catchShootStats[i][9] + pullupStats[i][9];
        const driveFga = ((driveStats[i][10] + driveStats[i][13] / 2) / typeTotalFga * 100).toFixed(2);
        const catchShootFga = (catchShootStats[i][9] / typeTotalFga * 100).toFixed(2);
        const pullupFga = (pullupStats[i][9] / typeTotalFga * 100).toFixed(2);

        //Gets 3pt catch and shoot %
        const catchShoot3pt = (catchShootStats[i][13] / typeTotalFga * 100).toFixed(2);

        //Start creating player object
        const player = {
          id: shoot8Stats[i][0].toString(),
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
          driveFga,
          catchShootFga,
          pullupFga,
          ast: usageStats[i][15],
          tov: usageStats[i][19],
          usg: (usageStats[i][22] * 100).toFixed(2),
          catchShoot3pt
        };

        dynamo.put(player).then((res) =>{
        })
      }
    }
}

