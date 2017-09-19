var express = require('express');
var router = express.Router();

var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
var _ = require('lodash-node');
var dateFormat = require('dateformat');
var config = require('../secure')

router.get('/card.json', function (req, res, next) {
  var connection = oracledb.getConnection(
    {
      user          : config.user,
      password      : config.password,
      connectString : config.connectString
    },function(err, connection){
      if (err) {
        console.error(err.message);
        return;
      }else{
        connection.execute("select * from TX3_ALL_OPEN_ORDER_SUMTOT",function(err, result)
        {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }
          var responseObject=[];
          _.forEach(result.rows, function(value) {
            var singleObject={
              "value": value.TOTAL_ORDERS,
            };
            responseObject.push(singleObject);
          });
          res.json(responseObject[0]);
          doRelease(connection);
        });
      }
    });

  function doRelease(connection)
  {
    connection.close(
      function(err) {
        if (err) {
          console.error(err.message);
        }
      });
  }
});

module.exports = router;
