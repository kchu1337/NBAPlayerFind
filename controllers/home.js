const express = require('express');
const router = express.Router();
const request = require('request');
const kmeans = require("node-kmeans");
const mongoose = require('mongoose')
const Player = require('../models/Player');


exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

exports.search = (req, res) => {
    res.render('search', {
        title: 'search'
    });
};

exports.playerList = (req, res) => {
    res.render('allplayers', {
            title: 'Player List'
        });
};

exports.clusterInitial = (req, res) => {
    res.render('cluster', {
        title: 'Player Clustering'
    });
};

exports.getAllPlayers = (req, res) => {
    Player.find({}, function(err, result){
        res.send(result);
    });
};

exports.details = (req, res) => {
    Player.findOne({_id:req.query.id}, function(err, result){
        var fullName = result.name.split(' ');
        var fname = fullName[0].trim();
        var lname = fullName[1].trim();
        res.render('detail', {
        player: result,fname :fname, lname:lname});
    });
};

exports.getplayer = (req, res) => {
    //var playerId = require('mongodb').ObjectID(req.query.id);
    Player.findOne({_id:req.query.id}, function(err, result){
        res.send(result);
    });
};

//returns 1/6th percentiles of
exports.getPercentiles = (req, res) => {
    Player.find({},
        {'rimFgp': true, 'closeFgp': true,'midrangeFgp': true, 'threeFgp': true, 'ast': true, 'tov': true, 'usg': true},
        (err, result) => {
        var length = result.length;
        var rim = [];
        var close = [];
        var midrange = [];
        var three = [];
        var assist = [];
        var turnover = [];
        var usage = [];
        for (var i = 0; i < length; i++) {
            rim.push(Number(result[i].rimFgp));
            close.push(Number(result[i].closeFgp));
            midrange.push(Number(result[i].midrangeFgp));
            three.push(Number(result[i].threeFgp));
            assist.push(Number(result[i].ast));
            turnover.push(Number(result[i].tov));
            usage.push(Number(result[i].usg));
            console.log(result[i].tov);
        }

            rim.sort((a, b) => {
                return a - b;
            });
            close.sort((a, b) => {
                return a - b;
            });
            midrange.sort((a, b) => {
                return a - b;
            });
            three.sort((a, b) => {
                return a - b;
            });
            assist.sort((a, b) => {
                return a - b;
            });
            turnover.sort((a, b) => {
                return a - b;
            });
            usage.sort((a, b) => {
                return a - b;
            });

        var percentile = Math.floor(length / 6);
        var allPercentiles = [];

        for (var i = 1; i < 6; i++) {
            var data = {
                'rimFgp' : rim[percentile*i],
                'closeFgp' : close[percentile*i],
                'midrangeFgp' : midrange[percentile*i],
                'threeFgp' : three[percentile*i],
                'ast' : assist[percentile*i],
                'tov' : turnover[percentile*i],
                'usg' : usage[percentile*i]
            };
            allPercentiles.push(data);
            console.log(percentile*i + " " + turnover[percentile*i])
        }
        res.send(allPercentiles);
    });
};

exports.sample = (req, res) => {
    Player.find({}, (err, results) => {//TODO replace with object destructuring
       //parse all query parameters into numbers.
       var rimFga = parseFloat(req.query.rimFga);
       var rimFgp = parseFloat(req.query.rimFgp);
       var closeFga = parseFloat(req.query.closeFga);
       var closeFgp = parseFloat(req.query.closeFgp);
       var midrangeFga = parseFloat(req.query.midrangeFga);
       var midrangeFgp = parseFloat(req.query.midrangeFgp);
       var threeFga = parseFloat(req.query.threeFga);
       var threeFgp = parseFloat(req.query.threeFgp);
       var ast = parseFloat(req.query.ast);
       var tov = parseFloat(req.query.tov);
       var usg = parseFloat(req.query.usg);
       var drive = parseFloat(req.query.drive);
       var catchShoot = parseFloat(req.query.catchshoot);
       //"answer" will be the caculated list the api returns
       var answer=[];
       if (err){
           res.send(err);
       }
        results.forEach((player) => { //TODO replace with map
          //Calculates the sum of the differnce between given
          //parameters and player stats
          var difference=0;
          difference+=Math.abs(player.rimFga-rimFga);
          difference+=Math.abs(player.rimFgp-rimFgp);
          difference+=Math.abs(player.closeFga-closeFga);
          difference+=Math.abs(player.closeFgp-closeFgp)/2;
          difference+=Math.abs(player.midrangeFga-midrangeFga);
          difference+=Math.abs(player.midrangeFgp-midrangeFgp)/2;
          difference+=Math.abs(player.threeFga-threeFga);
          difference+=Math.abs(player.threeFgp-threeFgp)/2;
          difference+=Math.abs(player.ast-ast)/2;
          difference+=Math.abs(player.tov-tov)/2;
          difference+=Math.abs(player.usg-usg)/2;
          difference+=Math.abs(player.driveFga-drive);
          difference+=Math.abs(player.catchShootFga-catchShoot);
          var fullName = player.name.split(' ');
          var fname = fullName[0].trim();
          var lname = fullName[1].trim();
          answer.push({'name':player.name, 'id':player._id, 'teamId':player.teamId, 'fname':fname, 'lname':lname,
              'diff':difference});

      })
       //sorts the list by difference greatest->least
       answer.sort(function(a,b){
           return a.diff-b.diff;
       });
       //returns the top 5 values
       answer=answer.slice(0,5);
       res.send(answer);
    });

};

exports.clusterize = (req, res) => {
    const {param1, param2} = req.body;
    var cluster = [];
    cluster[0] = [];
    cluster[1] = [];
    cluster[2] = [];
    Player.find({}, {name: 1, [param1]: 1, [param2]: 1}, (err, dbResult) => {
        let vectors = [];
        //Create vectors that only contain the parameters used for clustering
        dbResult.forEach((player) => {
            vectors.push([player[param1], player[param2]]);
        })
        kmeans.clusterize(vectors, {k: 3}, (err, clusterResult) => {
            //clusterInd is the index of vectors who belong to that cluster
            for (var i = 0; i < 3; i++) {
                clusterResult[i].clusterInd.forEach((num) => {
                    cluster[i].push({id: dbResult[num]._id, name: dbResult[num].name})
                })
            }
        })
    }).then(() => {
        res.send(cluster);
    });
};

exports.build = (req, res) => {
    /*var url = "http://stats.nba.com/stats/leaguedashplayershotlocations?DateFrom=&DateTo=&DistanceRange=8ft+Range&Division=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=G&PlusMinus=N&Rank=N&Season=2017-18&SeasonSegment=&SeasonType=Regular+Season&StarterBench=&TeamID=0&VsConference=&VsDivision="
    request(url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred and handle it
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        var body2 = JSON.parse(body);
        console.log('body', body);
        res.send(body2);
    });*/


    res.send("");
};