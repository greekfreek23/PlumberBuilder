(function(){
  // 1) Grab ?site= from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const siteParam = urlParams.get('site');

  const instructionsEl = document.getElementById('instructions');
  const logoImg = document.getElementById('currentLogoImage');

  // If no site param, show a warning
  if(!siteParam) {
    instructionsEl.textContent = 
      "No ?site= parameter found. Use something like ?site=dansplumbing in the URL.";
    return;
  }

  // 2) Fetch data from your "Live Site" repo (ALPlumbersSite)
  //    Points to finalWebsiteData.json on your GitHub
  const DATA_URL = 'https://raw.githubusercontent.com/greekfreek23/ALPlumbersSite/main/finalWebsiteData.json';

  fetch(DATA_URL)
    .then(response => {
      if(!response.ok){
        throw new Error("Failed to load data. Status: " + response.status);
      }
      return response.json();
    })
    .then(jsonData => {
      // Adjust based on how your JSON is structured
      const businesses = jsonData.finalWebsiteData || [];

      // 3) Find the business matching siteParam (case-insensitive check)
      const foundBiz = businesses.find(biz => 
        (biz.siteId || '').toLowerCase() === siteParam.toLowerCase()
      );

      if(!foundBiz) {
        instructionsEl.textContent =
          `No matching siteId found for: ${siteParam}`;
        return;
      }

      // 4) Display the current logo, if any
      if(foundBiz.logo) {
        logoImg.src = foundBiz.logo;
      } else {
        logoImg.alt = `No 'logo' field found for ${siteParam}`;
        instructionsEl.textContent =
          `No logo found in data for ${siteParam}`;
      }
    })
    .catch(err => {
      instructionsEl.textContent = 
        "Error fetching data: " + err.message;
    });
})();

