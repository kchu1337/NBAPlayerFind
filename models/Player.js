const mongoose = require('mongoose');
mongoose.Promise = Promise;

const playerSchema = new mongoose.Schema({
    _id: String,
    teamId: String,
    name: String,
    team: String,
    rimFga: Number,
    rimFgp: Number,
    //5-10 ft
    closeFga: Number,
    closeFgp: Number,
    //11-24 ft
    midrangeFga: Number,
    midrangeFgp: Number,
    threeFga: Number,
    threeFgp: Number,
    driveFga: Number,
    catchShootFga: Number,
    postFga: Number,
    pullupFga: Number,
    ast: Number,
    tov: Number,
    usg: Number,
    catchShoot3pt: Number
    }, {safe:true});



//Collection name must be "players"
module.exports = mongoose.model('Player', playerSchema);
