require("dotenv").config()

const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();
const path = require('path')
const axios = require('axios').default
const Data = require("./models/data");

const dataRoutes = require("./routes/data")

// DB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("DB Connection succesful")
})

// Middlewares
app.use(bodyParser.json());
app.use(cors());


app.use(express.static(path.resolve(__dirname, './client')));

// Routes
app.use('/api/v1', dataRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client', 'index.html'));
});

// var indices = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'AARTIIND', 'ABB', 'ABBOTINDIA', 'ABCAPITAL', 'ABFRL', 'ACC', 'ADANIENT', 'ADANIPORTS', 'ALKEM', 'AMBUJACEM', 'APOLLOHOSP', 'APOLLOTYRE', 'ASHOKLEY', 'ASIANPAINT', 'ASTRAL', 'ATUL', 'AUBANK', 'AUROPHARMA', 'AXISBANK', 'BAJAJ-AUTO', 'BAJAJFINSV', 'BAJFINANCE', 'BALKRISIND', 'BALRAMCHIN', 'BANDHANBNK', 'BANKBARODA', 'BATAINDIA', 'BEL', 'BERGEPAINT', 'BHARATFORG', 'BHARTIARTL', 'BHEL', 'BIOCON', 'BOSCHLTD', 'BPCL', 'BRITANNIA', 'BSOFT', 'CANBK', 'CANFINHOME', 'CHAMBLFERT', 'CHOLAFIN', 'CIPLA', 'COALINDIA', 'COFORGE', 'COLPAL', 'CONCOR', 'COROMANDEL', 'CROMPTON', 'CUB', 'CUMMINSIND', 'DABUR', 'DALBHARAT', 'DEEPAKNTR', 'DELTACORP', 'DIVISLAB', 'DIXON', 'DLF', 'DRREDDY', 'EICHERMOT', 'ESCORTS', 'EXIDEIND', 'FEDERALBNK', 'GAIL', 'GLENMARK', 'GMRINFRA', 'GNFC', 'GODREJCP', 'GODREJPROP', 'GRANULES', 'GRASIM', 'GUJGASLTD', 'HAL', 'HAVELLS', 'HCLTECH', 'HDFC', 'HDFCAMC', 'HDFCBANK', 'HDFCLIFE', 'HEROMOTOCO', 'HINDALCO', 'HINDCOPPER', 'HINDPETRO', 'HINDUNILVR', 'IBULHSGFIN', 'ICICIBANK', 'ICICIGI', 'ICICIPRULI', 'IDEA', 'IDFC', 'IDFCFIRSTB', 'IEX', 'IGL', 'INDHOTEL', 'INDIACEM', 'INDIAMART', 'INDIGO', 'INDUSINDBK', 'INDUSTOWER', 'INFY', 'INTELLECT', 'IOC', 'IPCALAB', 'IRCTC', 'ITC', 'JINDALSTEL', 'JKCEMENT', 'JSWSTEEL', 'JUBLFOOD', 'KOTAKBANK', 'L&TFH', 'LALPATHLAB', 'LAURUSLABS', 'LICHSGFIN', 'LT', 'LTIM', 'LTTS', 'LUPIN', 'M&M', 'M&MFIN', 'MANAPPURAM', 'MARICO', 'MARUTI', 'MCDOWELL-N', 'MCX', 'METROPOLIS', 'MFSL', 'MGL', 'MOTHERSON', 'MPHASIS', 'MRF', 'MUTHOOTFIN', 'NATIONALUM', 'NAUKRI', 'NAVINFLUOR', 'NESTLEIND', 'NMDC', 'NTPC', 'OBEROIRLTY', 'OFSS', 'ONGC', 'PAGEIND', 'PEL', 'PERSISTENT', 'PETRONET', 'PFC', 'PIDILITIND', 'PIIND', 'PNB', 'POLYCAB', 'POWERGRID', 'PVR', 'PVRINOX', 'RAIN', 'RAMCOCEM', 'RBLBANK', 'RECLTD', 'RELIANCE', 'SAIL', 'SBICARD', 'SBILIFE', 'SBIN', 'SHREECEM', 'SHRIRAMFIN', 'SIEMENS', 'SRF', 'SUNPHARMA', 'SUNTV', 'SYNGENE', 'TATACHEM', 'TATACOMM', 'TATACONSUM', 'TATAMOTORS', 'TATAPOWER', 'TATASTEEL', 'TCS', 'TECHM', 'TITAN', 'TORNTPHARM', 'TRENT', 'TVSMOTOR', 'UBL', 'ULTRACEMCO', 'UPL', 'VEDL', 'VOLTAS', 'WIPRO', 'ZEEL', 'ZYDUSLIFE'];

var indices = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'NIFTYMDCAP'];
// var indices = ['NIFTY'];



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
            console.log('data created');
        }
    })
}

var URLChanger = (sym) => {
    if(sym == 'NIFTY' || sym == 'BANKNIFTY' || sym == 'FINNIFTY' || sym == 'NIFTYMDCAP')
    {
        return 'https://www.nseindia.com/api/option-chain-indices?symbol=' + sym;
    }
    else
    {
        return 'https://www.nseindia.com/api/option-chain-equities?symbol=' +sym;
    }
}

// PORT
const port = 4444;


// Starting a server
app.listen(port, () => {
    console.log(`Backend is running in port ${port}`)

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

    
    var dataCreatorMain = () =>{

        let da = new Date();

        //Time parser
        let datestr = da.toTimeString();
        // console.log(datestr)
        let datearr = datestr.split(':');
        let hour = parseInt(datearr[0]);
        let minute = parseInt(datearr[1]);

        let marketCondn = (hour > 8 && hour < 16);


        if(marketCondn)
        {
            console.log('market started')

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
                oldRecordN = newRecordN;

                // Create data to DB
                createData(newRecordN)
    
            })
            .catch(err => console.log(err))

            })

        }
        else
        {
            console.log('market closed')
        }

    }


    dataCreatorMain()

    setInterval(() => {

        dataCreatorMain()

    },60000)
})

module.exports = {indices, URLChanger}

