const express = require('express');
const router = express.Router();
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
       var fga0 = parseFloat(req.query.fga0);
       var fgp0 = parseFloat(req.query.fgp0);
       var fga8 = parseFloat(req.query.fga8);
       var fgp8 = parseFloat(req.query.fgp8);
       var fga16 = parseFloat(req.query.fga16);
       var fgp16 = parseFloat(req.query.fgp16);
       var fga24 = parseFloat(req.query.fga24);
       var fgp24 = parseFloat(req.query.fgp24);
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
          difference+=Math.abs(player.fga0-fga0);
          difference+=Math.abs(player.fgp0-fgp0);
          difference+=Math.abs(player.fga8-fga8);
          difference+=Math.abs(player.fgp8-fgp8);
          difference+=Math.abs(player.fga16-fga16);
          difference+=Math.abs(player.fgp16-fgp16);
          difference+=Math.abs(player.fga24-fga24);
          difference+=Math.abs(player.fgp24-fgp24);
          difference+=Math.abs(player.ast-ast);
          difference+=Math.abs(player.tov-tov);
          difference+=Math.abs(player.usg-usg);
          var fullName = player.name.split(' ');
          var fname = fullName[0].trim();
          var lname = fullName[1].trim();
          answer.push({'name':player.name, 'id':player._id, 'fname':fname, 'lname':lname,
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
