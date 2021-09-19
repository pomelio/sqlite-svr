const {asyncMiddleware} = require('middleware-async');
const express = require('express');

var router = express.Router();
const {list, get, update} = require('./DBHandler');


router.post('/list', asyncMiddleware( list ));
router.post('/get', asyncMiddleware( get ));
router.post('/update', asyncMiddleware( update ));

module.exports = router;
