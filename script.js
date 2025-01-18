// script.js
(function(){
  let plumberData = null;

  // DOM references
  const previewContainer = document.getElementById("previewContainer");
  const templateFrame    = document.getElementById("templateFrame");
  const editSiteBtn      = document.getElementById("editSiteBtn");

  const wizardContainer  = document.getElementById("wizardContainer");
  const step1            = document.getElementById("step1");
  const step2            = document.getElementById("step2");
  const finishedStep     = document.getElementById("finishedStep");

  // Step1
  const step1NextBtn     = document.getElementById("step1NextBtn");
  const logoImg          = document.getElementById("logoImg");
  const heroSingleImg    = document.getElementById("heroSingleImg");
  const heroHeadline     = document.getElementById("heroHeadline");

  // Step2
  const finishBtn        = document.getElementById("finishBtn");
  const aboutSingleImg   = document.getElementById("aboutSingleImg");
  const aboutText        = document.getElementById("aboutText");

  // Final
  const publishBtn       = document.getElementById("publishBtn");
  const backToPreviewBtn = document.getElementById("backToPreviewBtn");

  window.addEventListener("DOMContentLoaded", initBuilder);

  async function initBuilder(){
    console.log("Script loaded - initBuilder fired.");

    // Parse ?site=
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("site");
    if(!slug) {
      alert("No ?site= param found, can't load data.");
      return;
    }
    console.log("Site param is:", slug);

    // Load data from your finalWebsiteData.json
    try {
      const resp = await fetch("https://raw.githubusercontent.com/greekfreek23/alabamaplumbersnowebsite/main/finalWebsiteData.json");
      if(!resp.ok) throw new Error("Failed to load finalWebsiteData.json");
      const json = await resp.json();
      const arr  = json.finalWebsiteData || [];
      plumberData = arr.find(b => (b.siteId||"").toLowerCase() === slug.toLowerCase());
      if(!plumberData) {
        console.warn("No matching site data for slug:", slug);
        plumberData = {};
      }
      // Put the template in the iframe
      const templateURL = `https://greekfreek23.github.io/ALPlumbersSite/?site=${slug}`;
      templateFrame.src = templateURL;
      console.log("iframe set to:", templateURL);

    } catch(err) {
      console.error("Error fetching plumber data:", err);
      plumberData = {};
    }
  }

  // "Edit This Site" -> hide preview, show wizard
  editSiteBtn.addEventListener("click", () => {
    console.log("Edit This Site button clicked!");
    alert("Edit This Site button clicked! Let's open the wizard.");

    // Hide preview
    previewContainer.style.display = "none";
    // Show wizard
    wizardContainer.style.display  = "block";

    // step1 visible
    step1.classList.add("active");
    step2.classList.remove("active");
    finishedStep.classList.remove("active");

    loadStep1Data();
  });

  function loadStep1Data(){
    console.log("Loading step1 data from plumberData:", plumberData);

    // Logo
    logoImg.src = plumberData.logo || "https://via.placeholder.com/150";
    // Hero Single
    const heroImgs = plumberData.photos?.heroImages || [];
    if(heroImgs.length > 0) {
      heroSingleImg.src = heroImgs[0].imageUrl || "https://via.placeholder.com/600x300";
      heroHeadline.value = heroImgs[0].callToAction || "Your default headline...";
    } else {
      heroSingleImg.src = "https://via.placeholder.com/600x300";
      heroHeadline.value = "";
    }
  }

  // step1 -> step2
  step1NextBtn.addEventListener("click", () => {
    console.log("step1NextBtn clicked");
    step1.classList.remove("active");
    step2.classList.add("active");
    loadStep2Data();
  });

  function loadStep2Data(){
    console.log("Loading step2 data...");
    const aboutArr = plumberData.photos?.aboutUsImages || [];
    if(aboutArr.length >= 1) {
      aboutSingleImg.src = aboutArr[0] || "https://via.placeholder.com/300x200";
    } else {
      aboutSingleImg.src = "https://via.placeholder.com/300x200";
    }
    aboutText.value = plumberData.aboutUs || "";
  }

  // step2 -> finished
  finishBtn.addEventListener("click", () => {
    console.log("finishBtn clicked");
    step2.classList.remove("active");
    finishedStep.classList.add("active");
  });

  publishBtn.addEventListener("click", () => {
    console.log("Publish clicked - not implemented yet.");
    alert("Would push changes to finalWebsiteData.json or DB here. [Not implemented]");
  });

  backToPreviewBtn.addEventListener("click", () => {
    console.log("Back to preview clicked");
    wizardContainer.style.display = "none";
    previewContainer.style.display = "block";

    step1.classList.remove("active");
    step2.classList.remove("active");
    finishedStep.classList.remove("active");
  });

})();

