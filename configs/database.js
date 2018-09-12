const shoot5Json = require("../json/shoot5");
const shoot8Json = require("../json/shoot8");
const shootZoneJson = require("../json/shootzone");
const driveStatsJson = require("../json/drives");
const catchShootStatsJson = require("../json/catchshoot");
const usageStatsJson = require("../json/usage");
const pullupJson = require("../json/pullup");
const dynamo = require("../helpers/dynamo");
const _ = require('lodash');


const playerMap = {}

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
for(let i =0; i<shoot5Stats.length; i++) {
  const id = shoot5Stats[i][0];
  let stats = {
    lt5Fgm: parseFloat(shoot5Stats[i][5]),
    lt5Fga: parseFloat(shoot5Stats[i][6]),
    lt9Fgm: parseFloat(shoot5Stats[i][8]),
    lt9Fga: parseFloat(shoot5Stats[i][9])
  }
  if(!(playerMap[id] || false)){
    playerMap[id] = {};
  }
  Object.assign(playerMap[id], stats);
}

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
for(let i =0; i<shoot8Stats.length; i++) {
  const id = shoot8Stats[i][0];
  let stats = {
    lt8Fgm: parseFloat(shoot8Stats[i][8]),
    lt8Fga: parseFloat(shoot8Stats[i][6]),
    lt16Fgm: parseFloat(shoot8Stats[i][8]),
    lt16Fga: parseFloat(shoot8Stats[i][9]),
    lt24Fgm: parseFloat(shoot8Stats[i][11]),
    lt24Fga: parseFloat(shoot8Stats[i][12]),
    gt24Fgm: parseFloat(shoot8Stats[i][14]),
    gt24Fga: parseFloat(shoot8Stats[i][15])

  }
  if(!(playerMap[id] || false)){
    playerMap[id] = {};
  }
  Object.assign(playerMap[id], stats);
}


const shootZoneStats = shootZoneJson.resultSets.rowSet;
/*
...
in restricted zone
5	"FGM"
6	"FGA"
7	"FG_PCT"
...
*/
for(let i =0; i<shootZoneStats.length; i++) {
  const id = shootZoneStats[i][0];
  let stats = {
    restrictedFgm: parseFloat(shootZoneStats[i][5]),
    restrictedFga: parseFloat(shootZoneStats[i][6])
  }
  if(!(playerMap[id] || false)){
    playerMap[id] = {};
  }
  Object.assign(playerMap[id], stats);
}


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
for(let i =0; i<driveStats.length; i++) {
  const id = driveStats[i][0];
  let stats = {
    gamespPlayed: parseFloat(driveStats[i][4]),
    minutes: parseFloat(driveStats[i][7]),
    driveFgm: parseFloat(driveStats[i][9]),
    driveFga: parseFloat(driveStats[i][10]),
    driveFtm: parseFloat(driveStats[i][12]),
    driveFta: parseFloat(driveStats[i][13])
  }
  if(!(playerMap[id] || false)){
    playerMap[id] = {};
  }
  Object.assign(playerMap[id], stats);
}


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
for(let i =0; i<catchShootStats.length; i++) {
  const id = catchShootStats[i][0];
  let stats = {
    catchShootFgm: parseFloat(catchShootStats[i][8]),
    catchShootFga: parseFloat(catchShootStats[i][9])
  }
  if(!(playerMap[id] || false)){
    playerMap[id] = {};
  }
  Object.assign(playerMap[id], stats);
}



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
for(let i =0; i<usageStats.length; i++) {
  const id = usageStats[i][0];
  let stats = {
    id,
    name: usageStats[i][1],
    teamId: usageStats[i][2],
    team: usageStats[i][3],
    gamesPlayed: parseFloat(usageStats[i][5]),
    minutes: parseFloat(usageStats[i][9]),
    ast: parseFloat(usageStats[i][15]),
    tov: parseFloat(usageStats[i][19]),
    usg: (parseFloat(usageStats[i][22]) * 100).toFixed(2)
  }
  if(!(playerMap[id] || false)){
    playerMap[id] = {};
  }
  Object.assign(playerMap[id], stats);
}

const pullupStats = pullupJson.resultSets[0].rowSet;
/*
8	"PULL_UP_FGM"
9	"PULL_UP_FGA"
10	"PULL_UP_FG_PCT"
11	"PULL_UP_FG3M"
12	"PULL_UP_FG3A"
...
 */
for(let i =0; i<pullupStats.length; i++) {
  const id = pullupStats[i][0];
  let stats = {
    pullupFgm: parseFloat(pullupStats[i][8]),
    pullupFga: parseFloat(pullupStats[i][9])
  }
  if(!(playerMap[id] || false)){
    playerMap[id] = {};
  }
  Object.assign(playerMap[id], stats);
}

_.forEach(playerMap, (playerStat) => {
  if (Object.keys(playerStat).length === 32 && playerStat.gamesPlayed > 10 && playerStat.minutes > 15 ) {
    //Get field goals from various areas at the rim, close range, mid range, and 3pters
    const totalFga = playerStat.lt8Fga + playerStat.lt16Fga + playerStat.lt24Fga + playerStat.gt24Fga;
    const totalFgm = playerStat.lt8Fgm + playerStat.lt16Fgm + playerStat.lt24Fgm + playerStat.gt24Fgm;
    const total3ptFga = playerStat.gt24Fga;
    const total3ptFgm = playerStat.gt24Fgm;
    //within circle
    const totalRimFga = playerStat.restrictedFga;
    const totalRimFgm = playerStat.restrictedFgm;
    //5-10 ft
    const totalCloseFga = playerStat.lt5Fga + playerStat.lt9Fga - totalRimFga;
    const totalCloseFgm = playerStat.lt5Fgm + playerStat.lt9Fgm - totalRimFgm;

    //11-24 ft
    const totalMidrangeFga = totalFga - total3ptFga - totalCloseFga - totalRimFga;
    const totalMidrangeFgm = totalFgm - total3ptFgm - totalCloseFgm - totalRimFgm;

    //total field goal attempts by type (C&S, drive, pullup, postup)
    //adds half of fta to fga
    const typeTotalFga = playerStat.driveFga + playerStat.driveFta / 2 + playerStat.catchShootFga + playerStat.pullupFga;
    const driveFga = ((playerStat.driveFga + playerStat.driveFta / 2) / typeTotalFga * 100).toFixed(2);
    const catchShootFga = (playerStat.catchShootFga/ typeTotalFga * 100).toFixed(2);
    const pullupFga = (playerStat.pullupFga / typeTotalFga * 100).toFixed(2);

    const player = {
      id: playerStat.id.toString(),
      teamId: playerStat.teamId.toString(),
      name: playerStat.name.toString(),
      team: playerStat.team.toString(),
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
      ast: playerStat.ast,
      tov: playerStat.tov,
      usg: playerStat.usg,
    };

    dynamo.put(player).then((res) =>{
    })

  }
});

