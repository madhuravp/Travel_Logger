const express = require('express');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const middlewares = require('./middlewares');
const logs = require('./api/logs');
const app = express();

app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.use(morgan('common'));
app.use(helmet());
console.log('origin: ', process.env.CORS_ORIGIN);

app.use(cors({
origin:process.env.CORS_ORIGIN,
}));

app.use(express.json()) ;

app.get('/', (req, res) =>{
    res.json({
        message:'Hello World',
    });

});


// Route used for accessing data
app.use('/api/logs', logs);

// Error handling
app.use(middlewares.notFound);

app.use(middlewares.errorHandler);



const port = process.env.PORT||1337;
app.listen(port, ()=>{
    console.log("listening at http://localhost:1337");
});