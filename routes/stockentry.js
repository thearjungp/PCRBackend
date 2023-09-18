const express = require("express");
const router = express.Router();

const { getEnabledStocks, enableStock, deleteStock, readSymbol } = require("../controllers/stockentry");

router.param('symbol', readSymbol);
router.get('/getenabledstocks',  getEnabledStocks);
router.post('/enablestock/:symbol', readSymbol, enableStock);
router.delete('/disablestock/:symbol', readSymbol, deleteStock);

module.exports = router;