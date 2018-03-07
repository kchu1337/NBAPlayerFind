const mongoose = require('mongoose');
mongoose.Promise = Promise;

const playerSchema = new mongoose.Schema({
    _id: String,
    teamId: String,
    name: String,
    team: String,
    rimFga: Number,
    rimFgp: Number,
    closeFga: Number,
    closeFgp: Number,
    midrangeFga: Number,
    midrangeFgp: Number,
    threeFga: Number,
    threeFgp: Number,
    driveFga: Number,
    catchshootFga: Number,
    ast: Number,
    tov: Number,
    usg: Number
    }, {safe:true});



//Collection name must be "players"
module.exports = mongoose.model('Player', playerSchema);
