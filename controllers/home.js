const express = require('express');
const router = express.Router();
const request = require('request');
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

exports.getAllPlayers = (req, res) => {
    Player.find({}, function(err, result){
        res.send(result);
    });
};

exports.details = (req, res) => {
    Player.findOne({name:req.query.name}, function(err, result){
        console.log(result);
        var fullName = result.name.split(' ');
        var fname = fullName[0].trim();
        var lname = fullName[1].trim();
        res.render('detail', {
        player: result,fname :fname, lname:lname});
    });
};


exports.getplayer = (req, res) => {
    //var playerId = require('mongodb').ObjectID(req.query.id);
    Player.findOne({name:req.query.name}, function(err, result){
        console.log(req.query.name);
        res.send(result);
    });
};

exports.sample = (req, res) => {
   Player.find({}, function(err, results){
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
       //"answer" will be the caculated list the api returns
       var answer=[];
       if (err){
           res.send(err);
       }
      results.forEach(function(player){
          //Calculates the sum of the differnce between given
          //parameters and player stats
          var difference=0;
          difference+=Math.abs(player.rimFga-rimFga);
          difference+=Math.abs(player.rimFgp-rimFgp);
          difference+=Math.abs(player.closeFga-closeFga);
          difference+=Math.abs(player.closeFgp-closeFgp);
          difference+=Math.abs(player.midrangeFga-midrangeFga);
          difference+=Math.abs(player.midrangeFgp-midrangeFgp);
          difference+=Math.abs(player.threeFga-threeFga);
          difference+=Math.abs(player.threeFgp-threeFgp);
          difference+=Math.abs(player.ast-ast);
          difference+=Math.abs(player.tov-tov);
          difference+=Math.abs(player.usg-usg);
          var fullName = player.name.split(' ');
          var fname = fullName[0].trim();
          var lname = fullName[1].trim();
          answer.push({'name':player.name, 'id':player._id, 'teamId':player.teamId, 'fname':fname, 'lname':lname,
              'diff':difference});

      })
       //soets the list by difference greatest->least
       answer.sort(function(a,b){
           return a.diff-b.diff;
       });
       //returns the top 3 values
       answer=answer.slice(0,3);
       res.send(answer);
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