var express = require('express');
var router = express.Router();

var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
var _ = require('lodash-node');
var dateFormat = require('dateformat');
var config = require('../secure')

router.get('/bar.json', function (req, res, next) {
  console.info("Request bar data at "+ new Date());
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
        connection.execute("select * from (select * from tx3_all_open_order_sum order by total_orders DESC) WHERE rownum<=5",function(err, result)
        {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }
          var responseObject=[];
          _.forEach(result.rows, function(value) {
            var singleObject={
              "label": value.COUNTRY_FULL_NAME,
              "value":value.TOTAL_ORDERS
            };
            responseObject.push(singleObject);
          });
          res.json(responseObject);
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
