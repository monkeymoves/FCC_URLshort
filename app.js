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
        return res.json(data);
        

    }
  
    var data = new shortUrl({
        originalUrl: urlToShorten + ' does not match expected URL format',
        shorterUrl: 'Invalid URL'

    });
    return res.json(data);

});
//query db & forward to orginal URL

app.get('/:urlToForward', (req, res, next)=>{
    //store value of params in shorterURL
    var  shorterUrl = req.params.urlToForward;
    //shortUrl = mongodb collectio
    shortUrl.findOne({'shorterUrl': shorterUrl}, (err, data)=>{
        if (err) return res.send('error reading db');
        var re = new RegExp("^(http|https)://", "i");
        var strToCheck = data.originalUrl;
        if(re.test(strToCheck)){
            res.redirect(301, data.originalUrl )
        }
        else{
            res.redirect(301, 'http://' + data.originalUrl)
        }
    });
});




app.listen(3000, () => {
    console.log('working server');
})