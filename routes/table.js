var express = require('express');
var router = express.Router();

var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
var _ = require('lodash-node');
var dateFormat = require('dateformat');
var config = require('../secure')

router.get('/table.json', function (req, res, next) {
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
        connection.execute("SELECT * FROM TX3_TOP_NEW_ORDER_MV",function(err, result)
        {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }
          var responseObject=[];
          _.forEach(result.rows, function(value) {
            var singleObject={
              "Market": value.COUNTRY_FULL_NAME,
              "Order No.":value.ORDER_NO,
              "Date/Time":dateFormat(new Date(value.CREATED_DATE),'yyyy-mm-dd')
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
