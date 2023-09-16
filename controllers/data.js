const axios = require('axios').default
const Data = require("../models/data");

let mycookie = null;

// var indices = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY', 'AARTIIND', 'ABB', 'ABBOTINDIA', 'ABCAPITAL', 'ABFRL', 'ACC', 'ADANIENT', 'ADANIPORTS', 'ALKEM', 'AMBUJACEM', 'APOLLOHOSP', 'APOLLOTYRE', 'ASHOKLEY', 'ASIANPAINT', 'ASTRAL', 'ATUL', 'AUBANK', 'AUROPHARMA', 'AXISBANK', 'BAJAJ-AUTO', 'BAJAJFINSV', 'BAJFINANCE', 'BALKRISIND', 'BALRAMCHIN', 'BANDHANBNK', 'BANKBARODA', 'BATAINDIA', 'BEL', 'BERGEPAINT', 'BHARATFORG', 'BHARTIARTL', 'BHEL', 'BIOCON', 'BOSCHLTD', 'BPCL', 'BRITANNIA', 'BSOFT', 'CANBK', 'CANFINHOME', 'CHAMBLFERT', 'CHOLAFIN', 'CIPLA', 'COALINDIA', 'COFORGE', 'COLPAL', 'CONCOR', 'COROMANDEL', 'CROMPTON', 'CUB', 'CUMMINSIND', 'DABUR', 'DALBHARAT', 'DEEPAKNTR', 'DELTACORP', 'DIVISLAB', 'DIXON', 'DLF', 'DRREDDY', 'EICHERMOT', 'ESCORTS', 'EXIDEIND', 'FEDERALBNK', 'GAIL', 'GLENMARK', 'GMRINFRA', 'GNFC', 'GODREJCP', 'GODREJPROP', 'GRANULES', 'GRASIM', 'GUJGASLTD', 'HAL', 'HAVELLS', 'HCLTECH', 'HDFC', 'HDFCAMC', 'HDFCBANK', 'HDFCLIFE', 'HEROMOTOCO', 'HINDALCO', 'HINDCOPPER', 'HINDPETRO', 'HINDUNILVR', 'IBULHSGFIN', 'ICICIBANK', 'ICICIGI', 'ICICIPRULI', 'IDEA', 'IDFC', 'IDFCFIRSTB', 'IEX', 'IGL', 'INDHOTEL', 'INDIACEM', 'INDIAMART', 'INDIGO', 'INDUSINDBK', 'INDUSTOWER', 'INFY', 'INTELLECT', 'IOC', 'IPCALAB', 'IRCTC', 'ITC', 'JINDALSTEL', 'JKCEMENT', 'JSWSTEEL', 'JUBLFOOD', 'KOTAKBANK', 'L&TFH', 'LALPATHLAB', 'LAURUSLABS', 'LICHSGFIN', 'LT', 'LTIM', 'LTTS', 'LUPIN', 'M&M', 'M&MFIN', 'MANAPPURAM', 'MARICO', 'MARUTI', 'MCDOWELL-N', 'MCX', 'METROPOLIS', 'MFSL', 'MGL', 'MOTHERSON', 'MPHASIS', 'MRF', 'MUTHOOTFIN', 'NATIONALUM', 'NAUKRI', 'NAVINFLUOR', 'NESTLEIND', 'NMDC', 'NTPC', 'OBEROIRLTY', 'OFSS', 'ONGC', 'PAGEIND', 'PEL', 'PERSISTENT', 'PETRONET', 'PFC', 'PIDILITIND', 'PIIND', 'PNB', 'POLYCAB', 'POWERGRID', 'PVR', 'PVRINOX', 'RAIN', 'RAMCOCEM', 'RBLBANK', 'RECLTD', 'RELIANCE', 'SAIL', 'SBICARD', 'SBILIFE', 'SBIN', 'SHREECEM', 'SHRIRAMFIN', 'SIEMENS', 'SRF', 'SUNPHARMA', 'SUNTV', 'SYNGENE', 'TATACHEM', 'TATACOMM', 'TATACONSUM', 'TATAMOTORS', 'TATAPOWER', 'TATASTEEL', 'TCS', 'TECHM', 'TITAN', 'TORNTPHARM', 'TRENT', 'TVSMOTOR', 'UBL', 'ULTRACEMCO', 'UPL', 'VEDL', 'VOLTAS', 'WIPRO', 'ZEEL', 'ZYDUSLIFE'];

const indices = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY'];


const URLChanger = (sym) => {
    if(sym == 'NIFTY' || sym == 'BANKNIFTY' || sym == 'FINNIFTY' || sym == 'MIDCPNIFTY')
    {
        return 'https://www.nseindia.com/api/option-chain-indices?symbol=' + sym;
    }
    else
    {
        return 'https://www.nseindia.com/api/option-chain-equities?symbol=' +sym;
    }
}

const readSymbol = (req, res, next, symbol) => {
    // console.log(symbol)
    req.symbol = symbol;
    next();
}

const getDataForSymbol = (req, res) => {

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

const dropDatabase = (req, res)=>{
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



const fetchSingleData = (req, res) => {

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

    // getDataOnly(i)

    indices.map(i => {
        getDataOnly(i)
    }) 

    
    Data.find({ sym : req.symbol }).exec((err, dat) => {
        if(err || !dat)
        {
            return res.status(400).json({
                error: "Unable to fetch data from DB"
            })
        }
        return res.json(dat);
    })

}



const getDataOnly = async (symbol) => {

    axios.get(URLChanger(symbol), {
        headers:
        {
            'cookie': await setCookieIfNotSet()
        }
    })
    .then(respo => {

        if(Object.keys(respo.data).length == 0)
        {
            console.log('EMPTY DATA - ' + symbol)
            return;
        }
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
        newRecordN.sym = symbol
        oldRecordN = newRecordN;
        createData(newRecordN)

        // console.log(newRecordN)

    })
    .catch(err => 
    { 
        mycookie = null;
        // console.log(err)
        console.log('ERROR - from controller')
    })
}

const setCookieIfNotSet = () => {
    
    return new Promise((resolve, reject) => {
        
        if(mycookie == null)
        {
            axios.get('https://www.nseindia.com/', {
                withCredentials: true
              }).then
            ((initresp) => {
                return resolve(getCookieString(initresp));
            })
            .catch(err => {
                console.log("IP BLOCKED BY NSE")
            })
        }
        return mycookie;
    })
}


const getCookieString = (fullresp) => {
    return allCookiesValuesOnly(fullresp.headers['set-cookie']).join(";")
}

const allCookiesValuesOnly = (cookies) => 
{
    return cookies.map(c => {
        return getCookieValueOnly(c);
    })
}

const getCookieValueOnly = (cookie) =>
{
    return cookie.split("; ")[0]
}


module.exports = { indices, URLChanger, fetchSingleData, dropDatabase, getDataForSymbol, readSymbol, getDataOnly};