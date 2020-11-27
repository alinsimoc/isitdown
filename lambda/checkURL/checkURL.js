const request = require('request');

const link = "https://nodejs124.org/";

request(link , function (error, response, body) {
  if(error){
    console.log('Err: '+ error);
    return false;
  }

  if(response.statusCode == 200 || response.statusCode == 201 || response.statusCode == 202){
    console.log(link + ' is up!!');
    return false;
  }

  if(response.statusCode == 301 || response.statusCode == 302){
    console.log(link + ' is redirecting us!!');
    return false;
  }

  if(response.statusCode == 401){
    console.log("you are unauthorized to " + link);
    return false;
  }else{
    console.log(link + ' is down!!');
  }
});