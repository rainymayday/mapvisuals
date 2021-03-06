var express = require('express');
var router = express.Router();

var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
var _ = require('lodash-node');
var dateFormat = require('dateformat');
var config = require('../secure')

var sql  = "select * from (SELECT * FROM TX3_TOP_NEW_ORDER_MV order by CREATED_DATE desc) where rownum <=8"

router.get('/table.json', function (req, res, next) {
  console.info("Request table data at "+ new Date());
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
        connection.execute(sql,function(err, result)
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
              "Order No.": value.ORDER_NO,
              // "Date/Time": value.CREATED_DATE
              "Date/Time":dateFormat(new Date(value.CREATED_DATE),'yyyy-mm-dd HH:MM:ss')
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
