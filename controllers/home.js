const express = require('express');
const router = express.Router();
const request = require('request');
const kmeans = require("node-kmeans");
const mongoose = require('mongoose')
const Player = require('../models/Player');
const statsDefinitions = {
    rimFga: 'Field goal % at the rim',
    rimFgp: '% of shots taken at the rim',
    closeFga: 'Field goal % 5-10 ft from the basket',
    closeFgp: '% of shots taken from 5-10 ft',
    midrangeFga: 'Field goal % 11-24 ft from the basket',
    midrangeFgp: '% of shots taken from 11-24 ft',
    threeFga: 'Field goal % of 3 pointers',
    threeFgp: '% of shots taken from 3',
    driveFga: '% of shots that are drives to the basket',
    catchShootFga: '% of shots that are catch and shoot',
    postFga: '% of shots that from posting up',
    pullupFga: '% of shots that are pullup jump shots',
    ast: 'Assist %',
    tov: 'Turnover %',
    usg: 'Usage %',
    catchShoot3pt: '% of shots that are catch and shoot 3s'
}

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
        title: 'Player List',
    });
};

exports.clusterInitial = (req, res) => {
    res.render('cluster', {
        title: 'Player Clustering'
    });
};

exports.getAllPlayers = (req, res) => {
    Player.find({}, function (err, result) {
        res.send(result);
    });
};

exports.details = (req, res) => {
    Player.findOne({_id: req.query.id}, function (err, result) {
        var fullName = result.name.split(' ');
        var fname = fullName[0].trim();
        var lname = fullName[1].trim();
        res.render('detail', {
            player: result, fname: fname, lname: lname
        });
    });
};

exports.getplayer = (req, res) => {
    //var playerId = require('mongodb').ObjectID(req.query.id);
    Player.findOne({_id: req.query.id}, function (err, result) {
        res.send(result);
    });
};

//returns 1/6th percentiles of
exports.getPercentiles = (req, res) => {
    Player.find({},
        {
            'rimFgp': true,
            'closeFgp': true,
            'midrangeFgp': true,
            'threeFgp': true,
            'ast': true,
            'tov': true,
            'usg': true
        },
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
                    'rimFgp': rim[percentile * i],
                    'closeFgp': close[percentile * i],
                    'midrangeFgp': midrange[percentile * i],
                    'threeFgp': three[percentile * i],
                    'ast': assist[percentile * i],
                    'tov': turnover[percentile * i],
                    'usg': usage[percentile * i]
                };
                allPercentiles.push(data);
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
        var answer = [];
        if (err) {
            res.send(err);
        }
        results.forEach((player) => { //TODO replace with map
            //Calculates the sum of the differnce between given
            //parameters and player stats
            var difference = 0;
            difference += Math.abs(player.rimFga - rimFga);
            difference += Math.abs(player.rimFgp - rimFgp);
            difference += Math.abs(player.closeFga - closeFga);
            difference += Math.abs(player.closeFgp - closeFgp) / 2;
            difference += Math.abs(player.midrangeFga - midrangeFga);
            difference += Math.abs(player.midrangeFgp - midrangeFgp) / 2;
            difference += Math.abs(player.threeFga - threeFga);
            difference += Math.abs(player.threeFgp - threeFgp) / 2;
            difference += Math.abs(player.ast - ast) / 2;
            difference += Math.abs(player.tov - tov) / 2;
            difference += Math.abs(player.usg - usg) / 2;
            difference += Math.abs(player.driveFga - drive);
            difference += Math.abs(player.catchShootFga - catchShoot);
            var fullName = player.name.split(' ');
            var fname = fullName[0].trim();
            var lname = fullName[1].trim();
            answer.push({
                'name': player.name, 'id': player._id, 'teamId': player.teamId, 'fname': fname, 'lname': lname,
                'diff': difference
            });
            
        })
        //sorts the list by difference greatest->least
        answer.sort(function (a, b) {
            return a.diff - b.diff;
        });
        //returns the top 5 values
        answer = answer.slice(0, 5);
        res.send(answer);
    });
    
};

exports.clusterize = (req, res) => {
    const {param1, param2, param3} = req.body;
    var clusters = [];
    clusters[0] = [];
    clusters[1] = [];
    clusters[2] = [];
    var centroids = [];
    Player.find({}, {name: 1, teamId: 1, [param1]: 1, [param2]: 1, [param3]: 1}, (err, dbResult) => {
        let vectors = [];
        //Create vectors that only contain the parameters used for clustering
        dbResult.forEach((player) => {
            player[param1] = player[param1] || 0;
            player[param2] = player[param2] || 0;
            player[param3] = player[param3] || 0;
            vectors.push([player[param1], player[param2], player[param3]]);
        })
        kmeans.clusterize(vectors, {k: 3}, (err, clusterResult) => {
            //clusterInd is the index of vectors who belong to that cluster
            for (var i = 0; i < 3; i++) {
                clusterResult[i].clusterInd.forEach((num) => {
                    clusters[i].push({id: dbResult[num]._id, name: dbResult[num].name, teamId: dbResult[num].teamId})
                })
                centroids.push(clusterResult[i].centroid);
            }
                res.send({clusters, centroids});
        })
      
    });
};


exports.getDefinitions = (req, res) => {
    res.send(statsDefinitions);
};
