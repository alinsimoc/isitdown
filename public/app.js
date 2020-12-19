const form = document.getElementById('checkURL');
const message = document.getElementById('checkMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const inputURL = formData.get('url');

  [...form.elements].forEach(element => element.disabled = true);
  message.innerHTML = 'Loading...'

  const response = await axios.post(
    'http://localhost:8888/.netlify/functions/checkURL', 
    inputURL
  ).catch(e => message.innerHTML = `
    <span class="text-red-500 font-bold">Error: </span> ${e.response.data}
  `);

  [...form.elements].forEach(element => element.disabled = false);

  if(response && response.data) {
    const {url, isDown, requestDuration} = response.data;
  
    message.innerHTML = `
      It looks like <a href="${url}" class="underline">${url}</a> is 
      <span class="${isDown ? 'text-red-500' : 'text-green-400'} font-bold uppercase">
        ${isDown ? 'down' : 'up'}
      </span>
      ${!isDown ? `<p>Request duration: ${requestDuration}ms</p>` : ''}
    `
  }
});

const services = [{
  name: 'Facebook',
  url: 'facebook.com'
}, {
  name: 'Google',
  url: 'google.com'
},{
  name: 'Instagram',
  url: 'instagram.com'
},{
  name: 'Softisfy',
  url: 'softisfy.com'
}];

const popularServices = document.getElementById('popularServices');

services.forEach( async(service, index) => { 
  const response = await axios.post(
    'http://localhost:8888/.netlify/functions/checkURL', 
    service.url
  );

  const {isDown, requestDuration} = response.data;
  popularServices.innerHTML += `
    <div class="table-row">
      <p class="table-cell text-gray-100"><a href="${service.url}">${service.name}</a></p>
      <p class="table-cell text-gray-400 text-sm">${requestDuration}ms</p>
      <p class="table-cell font-bold uppercase ${isDown ? 'text-red-500' : 'text-green-400'}">
        ${isDown ? 'down' : 'up'}
      </p>
    </div>
  `;
});
