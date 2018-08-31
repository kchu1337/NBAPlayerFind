const dotenv = require('dotenv');
const chai = require("chai");
const assert = chai.assert;
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app.js');
const dynamo = require('../helpers/dynamo');

chai.use(chaiHttp);
dotenv.load({ path: '.env.example' });
const playerId = '203897';


describe("Testing", function(){

    it("test framework", function(){
        assert(2===2,"Test functionality works");
    });

    it('Finds a specific player from the database', function(){
       return dynamo.get(playerId).then(function(result){
            assert.isNotNull(result, "Zach Lavine found");
        });
    });

    it('Gets a list of all Players directly from database', function(){
        return dynamo.scan().then(function(result){
            assert.isAbove(result.length,100,"Records Found");
        });
    });
    it('Gets list of all Players from URL', function() {
        return chai.request(app)
            .get('/getAll')
            .then((res) => {
                expect(res).to.have.status(200);
            })
        .catch((err) =>{
          console.log(err);
      });
    });

    it('Gets a specific player from URL', function() {
       return chai.request(app)
            .get('/getplayer')
            .query(({id: playerId}))
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.name).to.equal('Zach LaVine');
            });
    });
  it('Gets list of closely matched players', function() {
    const body = {
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
        driveFga: 30,
        pullupFga: 30
      };
    return chai.request(app)
      .post('/search')
      .set('content-type', 'application/json')
      .send(body)
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(5);
      });
  });

    it('Gets clusters', function() {
        return chai.request(app)
            .post('/cluster')
            .set('content-type', 'application/json')
            .send({
                'param1': 'rimFga',
                'param2': 'rimFgp',
                'param3': 'closeFga'
            })
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body.clusters).to.have.lengthOf(3);
                expect(res.body.centroids).to.have.lengthOf(3);
            });
    });
});