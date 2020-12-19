const axios = require("axios");
const validator = require('validator');

exports.handler = async (event, context, callback) => {
  
  if (
    event.httpMethod !== 'POST' 
    || event.headers.origin !== 'https://isitdown.netlify.app'
	) {
		callback(null, {
			statusCode: 400,
			body: 'You are not allowed to do that.',
    });
    return;
  }

  const url = event.body.includes('http') ? event.body : `https://${event.body}`;

  if(!url || !validator.isURL(url)) {
    callback(null, {
			statusCode: 400,
			body: 'URL parameter is missing or is not correct.',
    });
    return;
  }

  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use((config) => {
    config.headers['request-startTime'] = process.hrtime();
    return config;
  });

  axiosInstance.interceptors.response.use((response) => {
    const start = response.config.headers['request-startTime'];
    const end = process.hrtime(start);
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000));
    response['requestDuration'] = milliseconds;
    return response;
  })

  const timeout = 3000;
  const response = await axiosInstance.get(url, {timeout}).catch(error => console.log(error));

  const isDown = response ? ![200, 201, 202, 301, 302].includes(response.status) : true;
  const requestDuration = response ? response.requestDuration : 0;

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      url,
      isDown,
      requestDuration
    })
  });

  return;
};

 
 
