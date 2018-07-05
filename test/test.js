const Player = require('../models/Player');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chai = require("chai")
const assert = chai.assert;
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app.js');

chai.use(chaiHttp);
dotenv.load({ path: '.env.example' });
var length;
var playerId;

/**
 * Connect to MongoDB.
 */
before(function(done) {
    /*mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
    mongoose.connection.on('error', (err) => {
        console.error(err);
        console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
        process.exit();
    });*/
    app;
    done();
});

describe("Testing", function(){

    it("test framework", function(){
        assert(2===2,"Test functionality works");
    })



    it('Finds a specific player from the database', function(done){
       Player.findOne({name: 'Zach LaVine'}).then(function(result){
            assert.isNotNull(result, "Zach Lavine found");
            playerId = result._id;
            done();
        });
    });

    it('Gets a list of all Players directly from database', function(done){
        Player.find().then(function(result){
            assert.isAbove(result.length,100,"Records Found");
            length = result.length;
            done();
        });
    });
    it('Gets list of all Players from URL', function(done) {
        chai.request(app)
            .get('/playerlist')
            .end(function (err, res) {
                expect(res).to.have.status(200);
            });
        done();
    });

    it('Gets a specific player from URL', function(done) {
        chai.request(app)
            .get('/details')
            .query(({id: playerId}))
            .then(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.name).to.equal('Zach LaVine');
            });
        done();
    });

    it('Gets list of closely matched players', function(done) {
        chai.request(app)
            .get('/sample')
            .query({
                rimFga: 30,
                rimFgp: 30,
                closeFga: 30,
                closeFgp: 30,
                midrangeFga: 30,
                midrangeFgp: 30,
                threeFga: 30,
                threeFgp: 30,
                ast: 30,
                tov: 30,
                usg: 30,
                drive: 30,
                catchshoot: 30
            })
            .then(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.length.to.equal(5));
            });
        done();
    });
})