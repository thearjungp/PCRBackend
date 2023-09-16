const axios = require('axios').default
const Data = require("../models/data");
const indices = require("../app").indices;
const URLChanger = require("../app").URLChanger;

exports.readSymbol = (req, res, next, symbol) => {
    // console.log(symbol)
    req.symbol = symbol;
    next();
}

exports.getDataForSymbol = (req, res) => {

    Data.find({ sym : req.symbol }).exec((err, dat) => {
        if(err || !dat)
        {
            return res.status(400).json({
                error: "Unable to fetch data from DB"
            })
        }
        res.json(dat);
    })

}

exports.dropDatabase = (req, res)=>{
    Data.deleteMany().exec((err, dat) => {

        if(err || !dat)
        {   
            return res.status(400).json({
                error: "Unable to delete"
            })
        }

        res.json(dat);
    })
}

var oldRecordN = {
    time: '',
    totalCE: 0,
    totalPE: 0,
    pcr: '',
    ltp: 0,
    sym: ''
  };

var newRecordN =  {
    time: '',
    totalCE: 0,
    totalPE: 0,
    pcr: '',
    ltp: 0,
    sym: ''
  }

var createData = (data) => {
    
    const dat = new Data(data);
    // status.postedOn = dateformat(new Date(), "dd-mmm-yyyy @ hh:MM TT")
    // Saturday, June 9th, 2007, 5:46:21 PM
    dat.save((err, rdata) => {
        if(err){
            console.log('error creating to DB')
        }
        else
        {
            // console.log('data created');
        }
    })
}



exports.fetchSingleData = (req, res) => {

    var createData = (data) => {
    
        const dat = new Data(data);
        // status.postedOn = dateformat(new Date(), "dd-mmm-yyyy @ hh:MM TT")
        // Saturday, June 9th, 2007, 5:46:21 PM
        dat.save((err, rdata) => {
            if(err){
                console.log('error creating to DB')
            }
            else
            {
                // console.log('data created');
            }
        })
    }


    indices.map((i) => {

        axios.get(URLChanger(i))
            .then(respo => {
                let cmp = respo.data['records']['data'][0].hasOwnProperty('PE') ? respo.data['records']['data'][0]['PE']['underlyingValue'] : respo.data['records']['data'][0]['CE']['underlyingValue'];
                let foo = respo.data['filtered']
                let CE = foo["CE"]
                let PE = foo["PE"]
                let d = new Date();
                newRecordN.time = d
                newRecordN.totalCE = CE['totOI']
                newRecordN.totalPE = PE['totOI'];
                newRecordN.pcr = (Math.floor(PE['totOI'] / CE['totOI'] * 1000) / 1000).toFixed(3);
                newRecordN.ltp = cmp
                newRecordN.sym = i
                console.log(newRecordN)
                oldRecordN = newRecordN;
                createData(newRecordN)
    
            })
            .catch(err => console.log(err))

    })

    



    Data.find({ sym : req.symbol }).exec((err, dat) => {
        if(err || !dat)
        {
            return res.status(400).json({
                error: "Unable to fetch data from DB"
            })
        }
        res.json(dat);
    })


}
