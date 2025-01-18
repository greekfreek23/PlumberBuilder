// script.js
(function(){
  let plumberData = null;

  // DOM references
  const previewContainer = document.getElementById("previewContainer");
  const templateFrame    = document.getElementById("templateFrame");
  const editSiteBtn      = document.getElementById("editSiteBtn");

  const wizardContainer  = document.getElementById("wizardContainer");
  // Steps
  const step1            = document.getElementById("step1");
  const step2            = document.getElementById("step2");
  const finishedStep     = document.getElementById("finishedStep");

  // Step1
  const step1NextBtn     = document.getElementById("step1NextBtn");
  const logoImg          = document.getElementById("logoImg");
  const heroSingleImg    = document.getElementById("heroSingleImg");
  const heroHeadline     = document.getElementById("heroHeadline");
  const rewriteHeroBtn   = document.getElementById("rewriteHeroBtn");

  // Step2
  const finishBtn        = document.getElementById("finishBtn");
  const aboutSingleDiv   = document.getElementById("aboutSingleDiv");
  const aboutTwoDiv      = document.getElementById("aboutTwoDiv");
  const aboutSingleImg   = document.getElementById("aboutSingleImg");
  const aboutImg1        = document.getElementById("aboutImg1");
  const aboutImg2        = document.getElementById("aboutImg2");
  const aboutText        = document.getElementById("aboutText");
  const rewriteAboutBtn  = document.getElementById("rewriteAboutBtn");

  // Final
  const publishBtn       = document.getElementById("publishBtn");
  const backToPreviewBtn = document.getElementById("backToPreviewBtn");

  // On load, parse ?site=, fetch data, fill the iframe
  window.addEventListener("DOMContentLoaded", initBuilder);

  async function initBuilder(){
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("site");
    if(!slug) {
      alert("No ?site= param. Can't load data.");
      return;
    }
    try {
      const resp = await fetch("https://raw.githubusercontent.com/greekfreek23/alabamaplumbersnowebsite/main/finalWebsiteData.json");
      if(!resp.ok) throw new Error("Failed to load finalWebsiteData.json");
      const json = await resp.json();
      const arr  = json.finalWebsiteData || [];
      plumberData = arr.find(b => (b.siteId||"").toLowerCase() === slug.toLowerCase());
      if(!plumberData) {
        console.warn("No matching site data. Using fallback.");
        plumberData = {};
      }
      // Put the template in the iframe
      templateFrame.src = `https://greekfreek23.github.io/ALPlumbersSite/?site=${slug}`;
    } catch(err) {
      console.error("Error fetching plumber data:", err);
      plumberData = {};
    }
  }

  // "Edit This Site" => hide preview, show wizard
  editSiteBtn.addEventListener("click", () => {
    previewContainer.style.display = "none";
    wizardContainer.style.display  = "block";
    step1.classList.add("active");
    // load step1 data
    loadStep1Data();
  });

  function loadStep1Data(){
    // Show existing logo
    logoImg.src = plumberData.logo || "https://via.placeholder.com/150";
    // Show hero single image
    const heroImgs = plumberData.photos?.heroImages || [];
    if(heroImgs.length > 0) {
      heroSingleImg.src = heroImgs[0].imageUrl || "https://via.placeholder.com/600x300";
      heroHeadline.value = heroImgs[0].callToAction || "Welcome to Our Plumbing!";
    } else {
      heroSingleImg.src = "https://via.placeholder.com/600x300";
      heroHeadline.value = "";
    }
  }

  // Step1 -> Step2
  step1NextBtn.addEventListener("click", () => {
    step1.classList.remove("active");
    step2.classList.add("active");
    loadStep2Data();
  });

  function loadStep2Data(){
    // aboutUsImages
    const aboutArr = plumberData.photos?.aboutUsImages || [];
    if(aboutArr.length === 2) {
      aboutSingleDiv.classList.remove("active");
      aboutTwoDiv.classList.add("active");
      aboutImg1.src = aboutArr[0] || "https://via.placeholder.com/300x200";
      aboutImg2.src = aboutArr[1] || "https://via.placeholder.com/300x200";
    } else {
      aboutSingleDiv.classList.add("active");
      aboutTwoDiv.classList.remove("active");
      aboutSingleImg.src = aboutArr[0] || "https://via.placeholder.com/300x200";
    }
    aboutText.value = plumberData.aboutUs || "";
  }

  // Step2 -> Finish
  finishBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    finishedStep.classList.add("active");
  });

  // Publish or Back
  publishBtn.addEventListener("click", () => {
    alert("Publish not implemented. You'd update finalWebsiteData.json or DB here.");
  });
  backToPreviewBtn.addEventListener("click", () => {
    wizardContainer.style.display = "none";
    previewContainer.style.display = "block";
    // Reset steps
    step1.classList.remove("active");
    step2.classList.remove("active");
    finishedStep.classList.remove("active");
  });

  // Claude rewriting (just a placeholder)
  rewriteHeroBtn.addEventListener("click", () => {
    heroHeadline.value = heroHeadline.value + " [Rewritten by Claude!]";
  });
  rewriteAboutBtn.addEventListener("click", () => {
    aboutText.value = aboutText.value + " [Rewritten by Claude!]";
  });
})();
