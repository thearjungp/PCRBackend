const express = require("express");
const router = express.Router();

const { getDataForSymbol, readSymbol, fetchSingleData, dropDatabase } = require("../controllers/data");

router.param('symbol', readSymbol);
router.get('/fetchsingledata/:symbol', readSymbol, fetchSingleData);
router.get('/fetchdata/:symbol', readSymbol, getDataForSymbol);
router.delete('/dropdatabase', dropDatabase)

module.exports = router;