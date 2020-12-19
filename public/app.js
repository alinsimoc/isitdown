const endpoint = '/.netlify/functions/checkURL';

const handleForm = () => {
  const formEl = document.getElementById('checkURL');
  const messageEl = document.getElementById('checkMessage');
  
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(formEl);
    const inputURL = formData.get('url');
  
    [...formEl.elements].forEach(element => element.disabled = true);
    messageEl.innerHTML = 'Loading...'
  
    const response = await axios.post(endpoint, inputURL)
      .catch(e => messageEl.innerHTML = `
        <span class="text-red-500 font-bold">Error: </span> ${e.response.data}
      `);
  
    [...formEl.elements].forEach(element => element.disabled = false);
  
    if(response && response.data) {
      const {url, isDown, requestDuration} = response.data;
    
      messageEl.innerHTML = `
        It looks like <a href="${url}" class="underline">${url}</a> is 
        <span class="${isDown ? 'text-red-500' : 'text-green-400'} font-bold uppercase">
          ${isDown ? 'down' : 'up'}
        </span>
        ${!isDown ? `<p>Request duration: ${requestDuration}ms</p>` : ''}
      `
    }
  });
}
const renderPopularServices = () => {
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
  
  const popularServicesEl = document.getElementById('popularServices');
  services.forEach( async(service) => { 
    const response = await axios.post(endpoint, service.url);
    
    if(response && response.data) {
      const {isDown, url, requestDuration} = response.data;

      popularServicesEl.innerHTML += `
        <div class="table-row">
          <p class="table-cell text-gray-100"><a href="${url}">${service.name}</a></p>
          <p class="table-cell text-gray-400 text-sm">${requestDuration}ms</p>
          <p class="table-cell font-bold uppercase ${isDown ? 'text-red-500' : 'text-green-400'}">
            ${isDown ? 'down' : 'up'}
          </p>
        </div>
      `;
    }
  });
}


window.addEventListener('load', () => {
  handleForm();
  renderPopularServices();
});