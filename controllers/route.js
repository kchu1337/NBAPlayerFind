'use strict'
const dynamo = require('../helpers/dynamo');

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

exports.details = (req, res) => {
  dynamo.get(req.query.id).then((response) =>{
    const result = response;
    const fullName = result.name.split(' ');
    const fname = fullName[0].trim();
    const lname = fullName[1].trim();
    return res.render('detail', {
      player: result, fname: fname, lname: lname
    });
  });
}

exports.singePlayerStats = (req, res) => {
  dynamo.get(req.query.id).then((response) =>{
    const result = response;
    const fullName = result.name.split(' ');
    const fname = fullName[0].trim();
    const lname = fullName[1].trim();
    return res.render('detail', {
      player: result, fname: fname, lname: lname
    });
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