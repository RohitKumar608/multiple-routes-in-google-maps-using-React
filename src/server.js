const express = require('express');
const app=express();
const axios = require('axios');
const port = process.env.PORT || 3001;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/getRoute',async(req,res)=>{
    const params = req.url.split('?')[1].split('&');
    const from = params[0].split('=')[1];
    const to = params[1].split('=')[1];
    console.log(from,to)
         axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=${API_KEY}&sensor=false&alternatives=true`)
        .then(function (response) {
            res.send(response.data)
          })
          .catch(function (error) {
            console.log(error);
          });

});
//show in which port running server
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};