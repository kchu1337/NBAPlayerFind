
const kmeans = require("node-kmeans");
const dynamo = require('../helpers/dynamo');
const _ = require('lodash');
const statsDefinitions = {
    rimFga: '% of shots taken at the rim ',
    rimFgp: 'Field goal % at the rim',
    closeFgp: 'Field goal % 5-10 ft from the basket',
    closeFga: '% of shots taken from 5-10 ft',
    midrangeFga: '% of shots taken from 11-24 ft',
    midrangeFgp: 'Field goal % 11-24 ft from the basket',
    threeFga: '% of shots taken from 3',
    threeFgp: 'Field goal % of 3 pointers',
    driveFga: '% of shots that are drives to the basket',
    catchShootFga: '% of shots that are catch and shoot',
    postFga: '% of shots that from posting up',
    pullupFga: '% of shots that are pullup jump shots',
    ast: 'Assist %',
    tov: 'Turnover %',
    usg: 'Usage %',
    catchShoot3pt: '% of shots that are catch and shoot 3s'
};

exports.getAllPlayers = (req, res) => {
    dynamo.scan().then((result) => res.send(result));
};

exports.getplayer = (req, res) => {
  dynamo.get(req.query.id).then((result) =>{
        return res.send(result);
    });
};

//returns 1/6th percentiles of
exports.getPercentiles = (req, res) => {
  dynamo.scan({
    proj1: 'rimFgp',
    proj2: 'closeFgp',
    proj3: 'midrangeFgp',
    proj4: 'threeFgp',
    proj5: 'ast',
    proj6: 'tov',
    proj7: 'usg'
  }).then((result) => {
            const length = result.length;
            const rim = [];
            const close = [];
            const midrange = [];
            const three = [];
            const assist = [];
            const turnover = [];
            const usage = [];
            for (let i = 0; i < length; i++) {
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
            
            const percentile = Math.floor(length / 6);
            const allPercentiles = [];
            
            for (let i = 1; i < 6; i++) {
                let data = {
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
            return res.send(allPercentiles);
        });
};

exports.getSearchResults = (req, res) => {
  //Only calculates stats are numbers
  const statsToCalculate = _.pickBy(req.body, _.toNumber);
  return dynamo.scan().then((results) => {
      //Map-Reduces all players into the difference in stats between the user's
      //given data and the players actual stats
      let arrayOfPlayers = _.map(results, (playerStats) => {
        let diff =  _.reduce(statsToCalculate, (sum, userStat, key) =>{
          return sum + (Math.abs(_.toNumber(userStat)-playerStats[key]));
        }, 0);

        const { name, id, teamId} = playerStats;
        const fullName = name.split(' ');
        const fname = fullName[0].trim();
        const lname = fullName[1].trim();
        return {
          name, id, teamId, fname, lname,
          diff
        };
      });
      //sorts the list by difference greatest->least
        arrayOfPlayers.sort(function (a, b) {
            return a.diff - b.diff;
        });
        //returns the top 5 values
        arrayOfPlayers = arrayOfPlayers.slice(0, 5);
        return res.send(arrayOfPlayers);
    })
    .catch((err) => {
      console.log(err);
    });

};

exports.clusterize = (req, res) => {
    const {param1, param2, param3} = req.body;
    const clusters = [];
    clusters[0] = [];
    clusters[1] = [];
    clusters[2] = [];
    const centroids = [];
  return dynamo.scan({
    id: 'id',
    '#name': '#name',
    'teamId': 'teamId',
    param1,
    param2,
    param3
  }).then((dbResult) => {
        let vectors = [];
        //Create vectors that only contain the parameters used for clustering
        dbResult.forEach((player) => {
            player[param1] = parseFloat(player[param1]) || 0;
            player[param2] = parseFloat(player[param2]) || 0;
            player[param3] = parseFloat(player[param3]) || 0;
            vectors.push([player[param1], player[param2], player[param3]]);
        });
        kmeans.clusterize(vectors, {k: 3}, (err, clusterResult) => {
            //clusterInd is the index of vectors who belong to that cluster
            for (let i = 0; i < 3; i++) {
                clusterResult[i].clusterInd.forEach((num) => {
                    clusters[i].push({id: dbResult[num].id, name: dbResult[num].name, teamId: dbResult[num].teamId})
                });
                centroids.push(clusterResult[i].centroid);
            }
                return res.send({clusters, centroids});
        })
      
    });
};


exports.getDefinitions = (req, res) => {
    res.send(statsDefinitions);
};
