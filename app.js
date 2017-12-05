const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
app.use(bodyParser.json());
app.use(cors());
// connect to db
mongoose.connect(process.env.MONGODB_URI || 'mongodb://cat:catman@ds141351.mlab.com:41351/glitch_db');



//

app.use(express.static(__dirname + '/public'));

//creates db entry
app.get('/new/:urlToShorten(*)', (req, res, next) => {
    //es5 req.params.urlToshorten
    let { urlToShorten } = req.params;
    //regex for url
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;﻿
    var regex = expression;



    if(regex.test(urlToShorten)===true){
        var short = Math.floor(Math.random()*100000).toString();

        var data = new shortUrl({
            originalUrl: urlToShorten,
            shorterUrl: short
        });
        data.save(err=>{
            if(err){
                return res.send('error saving to db');
            }
        })
        return res.json({ data });
        

    }
  
    console.log(urlToShorten);
    return res.json({ urlToShorten: "failed" });

});
//

app.listen(3000, () => {
    console.log('working server');
})