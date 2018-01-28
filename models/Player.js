const mongoose = require('mongoose');
mongoose.Promise = Promise;

const playerSchema = new mongoose.Schema({
    _id: String,
    name: String,
    team: String,
    fga0: Number,
    fgp0: Number,
    fga8: Number,
    fgp8: Number,
    fga16: Number,
    fgp16: Number,
    fga24: Number,
    fgp24: Number,
    ast: Number,
    tov: Number,
    usg: Number
    }, {safe:true});

//Collection name must be "players"
module.exports = mongoose.model('Player', playerSchema);
