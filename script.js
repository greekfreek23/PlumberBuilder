// script.js
(function(){
  let plumberData = null;

  // DOM references
  const previewContainer = document.getElementById("previewContainer");
  const templateFrame    = document.getElementById("templateFrame");
  const editSiteBtn      = document.getElementById("editSiteBtn");

  const wizardContainer  = document.getElementById("wizardContainer");
  // Step Bar
  const barStep1 = document.getElementById("barStep1");
  const barStep2 = document.getElementById("barStep2");
  const barFinish= document.getElementById("barFinish");

  // Steps
  const step1         = document.getElementById("step1");
  const step2         = document.getElementById("step2");
  const finishedStep  = document.getElementById("finishedStep");

  // Step1 elements
  const step1NextBtn  = document.getElementById("step1NextBtn");
  const logoImg       = document.getElementById("logoImg");
  const keepLogoBtn   = document.getElementById("keepLogoBtn");
  const uploadLogoBtn = document.getElementById("uploadLogoBtn");
  const generateLogoBtn= document.getElementById("generateLogoBtn");

  const heroSingleDiv = document.getElementById("heroSingleDiv");
  const heroSliderDiv = document.getElementById("heroSliderDiv");
  const heroSingleImg = document.getElementById("heroSingleImg");
  const heroHeadline  = document.getElementById("heroHeadline");
  const rewriteHeroBtn= document.getElementById("rewriteHeroBtn");
  const addSliderImageBtn   = document.getElementById("addSliderImageBtn");
  const sliderImagesContainer= document.getElementById("sliderImagesContainer");

  // Step2 elements
  const finishBtn       = document.getElementById("finishBtn");
  const aboutSingleDiv  = document.getElementById("aboutSingleDiv");
  const aboutTwoDiv     = document.getElementById("aboutTwoDiv");
  const aboutSingleImg  = document.getElementById("aboutSingleImg");
  const aboutImg1       = document.getElementById("aboutImg1");
  const aboutImg2       = document.getElementById("aboutImg2");
  const aboutText       = document.getElementById("aboutText");
  const rewriteAboutBtn = document.getElementById("rewriteAboutBtn");

  // Finished
  const publishBtn      = document.getElementById("publishBtn");
  const backToPreviewBtn= document.getElementById("backToPreviewBtn");

  // On load
  window.addEventListener("DOMContentLoaded", initBuilder);

  async function initBuilder(){
    console.log("Builder loaded!");
    const params = new URLSearchParams(window.location.search);
    const slug   = params.get("site");
    if(!slug) {
      alert("No ?site= param found. Can't load data!");
      return;
    }
    console.log("slug is:", slug);
    // fetch data
    try {
      const resp = await fetch("https://raw.githubusercontent.com/greekfreek23/alabamaplumbersnowebsite/main/finalWebsiteData.json");
      if(!resp.ok) throw new Error("Failed to fetch finalWebsiteData.json");
      const json = await resp.json();
      const arr  = json.finalWebsiteData || [];
      plumberData = arr.find(b => (b.siteId||"").toLowerCase() === slug.toLowerCase());
      if(!plumberData) {
        console.warn("No data for that slug, using fallback.");
        plumberData = {};
      }
      const templateURL = `https://greekfreek23.github.io/ALPlumbersSite/?site=${slug}`;
      templateFrame.src = templateURL;
    } catch(err) {
      console.error("Error loading data:", err);
      plumberData = {};
    }
  }

  // "Edit This Site"
  editSiteBtn.addEventListener("click", () => {
    console.log("Edit site clicked");
    // Hide preview
    previewContainer.style.display = "none";
    // Show wizard
    wizardContainer.style.display  = "block";
    step1.classList.add("active");
    step2.classList.remove("active");
    finishedStep.classList.remove("active");

    barStep1.classList.add("active");
    barStep2.classList.remove("active");
    barFinish.classList.remove("active");

    loadStep1Data();
  });

  function loadStep1Data(){
    // Logo
    logoImg.src = plumberData.logo || "https://via.placeholder.com/150";
    // Hero single
    const heroImgs = plumberData.photos?.heroImages || [];
    if(heroImgs.length>0) {
      heroSingleImg.src = heroImgs[0].imageUrl || "https://via.placeholder.com/600x300";
      heroHeadline.value = heroImgs[0].callToAction || "Default Headline...";
    } else {
      heroSingleImg.src = "https://via.placeholder.com/600x300";
      heroHeadline.value = "";
    }
    // if more than 1 hero image, we might show them in slider
  }

  // Step1 next -> Step2
  step1NextBtn.addEventListener("click", () => {
    console.log("step1Next clicked");
    step1.classList.remove("active");
    step2.classList.add("active");
    barStep1.classList.remove("active");
    barStep2.classList.add("active");
    loadStep2Data();
  });

  function loadStep2Data(){
    console.log("Loading step2 data");
    const aboutArr = plumberData.photos?.aboutUsImages || [];
    if(aboutArr.length ===2){
      aboutSingleDiv.classList.remove("active");
      aboutTwoDiv.classList.add("active");
      aboutImg1.src = aboutArr[0];
      aboutImg2.src = aboutArr[1];
    } else {
      aboutSingleDiv.classList.add("active");
      aboutTwoDiv.classList.remove("active");
      aboutSingleImg.src = aboutArr[0] || "https://via.placeholder.com/300x200";
    }
    aboutText.value = plumberData.aboutUs || "";
  }

  // Step2 -> finish
  finishBtn.addEventListener("click", () => {
    console.log("finish clicked");
    step2.classList.remove("active");
    finishedStep.classList.add("active");
    barStep2.classList.remove("active");
    barFinish.classList.add("active");
  });

  // Finished step
  publishBtn.addEventListener("click", () => {
    console.log("Publish - not implemented");
    alert("Would push changes to GitHub or DB here (not implemented).");
  });
  backToPreviewBtn.addEventListener("click", () => {
    console.log("Back to preview");
    wizardContainer.style.display = "none";
    previewContainer.style.display = "block";

    // reset
    step1.classList.remove("active");
    step2.classList.remove("active");
    finishedStep.classList.remove("active");
    barStep1.classList.remove("active");
    barStep2.classList.remove("active");
    barFinish.classList.remove("active");
  });

  // Some button interactions for demonstration
  keepLogoBtn.addEventListener("click", () => {
    console.log("Clicked Keep Logo");
    alert("We'll keep the existing logo as-is!");
  });
  uploadLogoBtn.addEventListener("click", () => {
    console.log("Clicked Upload Logo");
    alert("You can prompt a file input or do real upload logic here!");
  });
  generateLogoBtn.addEventListener("click", () => {
    console.log("Clicked Generate Logo (DALL·E)");
    alert("We would call DALL·E here and replace the logo with AI output!");
    logoImg.src = "https://via.placeholder.com/150/ff0000?text=AI+Logo";
  });

  rewriteHeroBtn.addEventListener("click", () => {
    console.log("Rewrite hero text with Claude");
    heroHeadline.value = heroHeadline.value + " [Rewritten by Claude!]";
  });
  addSliderImageBtn.addEventListener("click", () => {
    console.log("Add slider image clicked (demo)");
    const div = document.createElement("div");
    div.innerHTML = `<img src="https://via.placeholder.com/600x300?text=NewSlide" class="preview-image" />`;
    sliderImagesContainer.appendChild(div);
  });
  rewriteAboutBtn.addEventListener("click", () => {
    console.log("Rewrite about text with Claude");
    aboutText.value = aboutText.value + " [Rewritten by Claude!]";
  });

  // Also handle toggles for hero single vs slider
  document.querySelectorAll('input[name="heroType"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if(radio.value==="single"){
        heroSingleDiv.classList.add("active");
        heroSliderDiv.classList.remove("active");
      } else {
        heroSingleDiv.classList.remove("active");
        heroSliderDiv.classList.add("active");
      }
    });
  });
  // about images 1 or 2
  document.querySelectorAll('input[name="aboutImagesCount"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if(radio.value==="2"){
        aboutSingleDiv.classList.remove("active");
        aboutTwoDiv.classList.add("active");
      } else {
        aboutSingleDiv.classList.add("active");
        aboutTwoDiv.classList.remove("active");
      }
    });
  });
})();

