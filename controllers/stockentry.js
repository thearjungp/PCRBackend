
const axios = require('axios').default
const Stock = require("../models/stockentry");


const readSymbol = (req, res, next, symbol) => {
    req.symbol = symbol;
    next();
}

const getEnabledStocks = (req, res) => {

    Stock.find().exec((err, dat) => {
        if(err || !dat)
        {
            return res.status(400).json({
                error: "No stock data"
            })
        }
        return res.json(dat);
    })
}

const enabledStockNamesOnly = () => {
    

    return new Promise((resolve, reject) => {

        Stock.find().exec(async (err, dat) => {
            if(err || !dat)
            {
                reject({
                    error: "No stock data"
                })
            }
            let indices = dat.map(e => e.symbol)
            return resolve(indices);
        })

    })

}



const enableStock = (req, res) => {

    const stock = new Stock({ symbol: req.symbol });

    stock.save((err, rdata) => {
        if(err){
            console.log('error enabling the stock to DB')
            return res.status(400).json({
                error: 'error enabling the stock to DB'
            })
        }
        else
        {
            return res.status(201).json({
                error: 'Stock enabled'
            })
        }
    })
}


const deleteStock = (req, res) => {

    Stock.findOneAndDelete({symbol : req.symbol}).exec((err, dat) => {

        if(err || !dat)
        {   
            return res.status(400).json({
                error: "Unable to disable stock"
            })
        }
        res.json(dat);
    })
    
}


module.exports = {readSymbol, getEnabledStocks, enableStock, deleteStock, enabledStockNamesOnly};