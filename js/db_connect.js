var http = require('http');
var oracledb = require('oracledb');
var url = require('url');

var connection = oracledb.getConnection(
  {
    user          : "CT_DM_1",
    password      : "CTPRODPX#10",
    connectString : "10.202.16.10:1525/yspdb016"
  });


http.createServer(function (request, response) {
request.on('end', function () {
// 查询数据表
connection.execute('SELECT * FROM TX3_TOP_NEW_ORDER_MV;', function (error, data) {
response.writeHead(200, {
'Content-Type': 'x-application/json'
});
// 数据以json形式返回
response.end(JSON.stringify(data.rows));
});
});
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
