const mongoose = require('mongoose');
mongoose.Promise = Promise;

const playerSchema = new mongoose.Schema({
    _id: String,
    teamId: String,
    name: String,
    team: String,
    rimfga: Number,
    rimfgp: Number,
    closefga: Number,
    closefgp: Number,
    midrangefga: Number,
    midrangefgp: Number,
    threefga: Number,
    threefgp: Number,
    drivefga: Number,
    catchshootfga: Number,
    ast: Number,
    tov: Number,
    usg: Number
    }, {safe:true});



//Collection name must be "players"
module.exports = mongoose.model('Player', playerSchema);
