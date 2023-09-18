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
const stockentryRoutes = require("./routes/stockentry")

const { indices, URLChanger, getDataOnly } = require("./controllers/data")

// DB Connection
mongoose.connect('mongodb://localhost:27017/PCR').then(() => {
    console.log("DB Connection succesful")
})

// Middlewares
app.use(bodyParser.json());
app.use(cors());


app.use(express.static(path.resolve(__dirname, './client')));

// Routes
app.use('/api/v1', dataRoutes);
app.use('/api/v1', stockentryRoutes);



app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client', 'index.html'));
});


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

    
    var dataCreatorMain = async () =>{

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

            let sum = (await indices).map((i) => {
                getDataOnly(i);
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


