var express = require('express')
var app = express()
var fs = require('fs');



app.listen(2000, function() {
  console.log('Example app listening on port 2000!')
})


//get data from google trends api
const googleTrends = require('google-trends-api');

//every time theres a new selected country or new keyword, a new
//route is created with that keyword and selectedCountry
//https://expressjs.com/en/guide/routing.html//
app.get("/trends/:keyword/:selectedCountry/:startDate", function(req, res) {
  console.log(req.params);

  googleTrends.interestOverTime({
    keyword: req.params.keyword,
    geo: req.params.selectedCountry,
    startTime: new Date(req.params.startDate),
    endTime: new Date(Date.now()) //30days
    //resolution: 'CITY',
    //  granularTimeResolution: true,
  }, function(err, results) {
    if (err) console.log('oh no error!', err);
    else {
      console.log("hello");
      res.send(results);;
    }
  });
});



app.get("/trends/:worldinputTerm", function(req, res) {
  console.log("IM A RUNNING");

  googleTrends.interestByRegion({
      keyword: req.params.worldinputTerm,
      startTime: new Date(Date.now()),
      endTime: new Date('2018-01-01'),
      resolution: 'COUNTRY'
    },
    function(err, results) {
      if (err) console.log('oh no error!', err);
      else {
        console.log(results)
        res.send(results);;
      }
    });
});




//app use is called every time a request is sent to server
//serves a static file
app.use('/', express.static('public'));
