var express = require('express');
var router = express.Router();

router.get('/map.json', function (req, res, next) {
    res.json({data: 'here is example'});
});

module.exports = router;
