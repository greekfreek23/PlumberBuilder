// script.js
(function(){
  let plumberData = null;

  // -- DOM Refs
  const previewContainer = document.getElementById("previewContainer");
  const templateFrame    = document.getElementById("templateFrame");
  const editSiteBtn      = document.getElementById("editSiteBtn");

  const wizardContainer  = document.getElementById("wizardContainer");
  // Step bar
  const barStep1         = document.getElementById("barStep1");
  const barStep2         = document.getElementById("barStep2");
  const barFinish        = document.getElementById("barFinish");

  // Steps
  const step1            = document.getElementById("step1");
  const step2            = document.getElementById("step2");
  const finishedStep     = document.getElementById("finishedStep");

  // Step1
  const step1NextBtn     = document.getElementById("step1NextBtn");
  const logoImg          = document.getElementById("logoImg");
  const keepLogoBtn      = document.getElementById("keepLogoBtn");
  const uploadLogoBtn    = document.getElementById("uploadLogoBtn");
  const generateLogoBtn  = document.getElementById("generateLogoBtn");
  const logoFileInput    = document.getElementById("logoFileInput");

  const heroSingleDiv    = document.getElementById("heroSingleDiv");
  const heroSliderDiv    = document.getElementById("heroSliderDiv");
  const heroSingleImg    = document.getElementById("heroSingleImg");
  const heroHeadline     = document.getElementById("heroHeadline");
  const rewriteHeroBtn   = document.getElementById("rewriteHeroBtn");

  const uploadHeroSingleBtn   = document.getElementById("uploadHeroSingleBtn");
  const generateHeroSingleBtn = document.getElementById("generateHeroSingleBtn");
  const heroSingleFileInput   = document.getElementById("heroSingleFileInput");

  const addSliderImageBtn     = document.getElementById("addSliderImageBtn");
  const sliderImagesContainer = document.getElementById("sliderImagesContainer");

  // Step2
  const finishBtn        = document.getElementById("finishBtn");
  const step2PrevBtn     = document.getElementById("step2PrevBtn");
  const aboutSingleDiv   = document.getElementById("aboutSingleDiv");
  const aboutTwoDiv      = document.getElementById("aboutTwoDiv");
  const aboutSingleImg   = document.getElementById("aboutSingleImg");
  const aboutImg1        = document.getElementById("aboutImg1");
  const aboutImg2        = document.getElementById("aboutImg2");
  const aboutText        = document.getElementById("aboutText");
  const rewriteAboutBtn  = document.getElementById("rewriteAboutBtn");

  const uploadAboutSingleBtn  = document.getElementById("uploadAboutSingleBtn");
  const generateAboutSingleBtn= document.getElementById("generateAboutSingleBtn");
  const aboutSingleFileInput  = document.getElementById("aboutSingleFileInput");

  const uploadAboutImg1Btn    = document.getElementById("uploadAboutImg1Btn");
  const generateAboutImg1Btn  = document.getElementById("generateAboutImg1Btn");
  const aboutImg1FileInput    = document.getElementById("aboutImg1FileInput");

  const uploadAboutImg2Btn    = document.getElementById("uploadAboutImg2Btn");
  const generateAboutImg2Btn  = document.getElementById("generateAboutImg2Btn");
  const aboutImg2FileInput    = document.getElementById("aboutImg2FileInput");

  // Finished
  const publishBtn       = document.getElementById("publishBtn");
  const backToPreviewBtn = document.getElementById("backToPreviewBtn");

  // On load
  window.addEventListener("DOMContentLoaded", initBuilder);

  async function initBuilder(){
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("site");
    if(!slug){
      alert("No ?site= param found. Can't load plumber data!");
      return;
    }
    try {
      const resp = await fetch("https://raw.githubusercontent.com/greekfreek23/alabamaplumbersnowebsite/main/finalWebsiteData.json");
      if(!resp.ok) throw new Error("Failed to fetch finalWebsiteData.json");
      const json = await resp.json();
      const arr  = json.finalWebsiteData || [];
      plumberData = arr.find(b => (b.siteId||"").toLowerCase() === slug.toLowerCase());
      if(!plumberData) {
        console.warn("No matching site data. Using fallback empty object.");
        plumberData = {};
      }
      // Set the template in the iFrame
      const templateURL = `https://greekfreek23.github.io/ALPlumbersSite/?site=${slug}`;
      templateFrame.src = templateURL;
    } catch(err) {
      console.error("Error fetching plumber data:", err);
      plumberData = {};
    }
  }

  // "Edit This Site"
  editSiteBtn.addEventListener("click", () => {
    previewContainer.style.display = "none";
    wizardContainer.style.display  = "block";

    barStep1.classList.add("active");
    barStep2.classList.remove("active");
    barFinish.classList.remove("active");

    step1.classList.add("active");
    step2.classList.remove("active");
    finishedStep.classList.remove("active");

    loadStep1Data();
  });

  function loadStep1Data(){
    // Show existing logo
    logoImg.src = plumberData.logo || "https://via.placeholder.com/150";
    // If we have hero images
    const heroImgs = plumberData.photos?.heroImages || [];
    if(heroImgs.length > 0){
      heroSingleImg.src = heroImgs[0].imageUrl || "https://via.placeholder.com/600x300";
      heroHeadline.value = heroImgs[0].callToAction || "Default Headline...";
    } else {
      heroSingleImg.src = "https://via.placeholder.com/600x300";
      heroHeadline.value = "";
    }
  }

  // Step1 -> Step2
  step1NextBtn.addEventListener("click", () => {
    step1.classList.remove("active");
    step2.classList.add("active");
    barStep1.classList.remove("active");
    barStep2.classList.add("active");
    loadStep2Data();
  });

  function loadStep2Data(){
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

  // Step2 Prev -> Step1
  step2PrevBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    step1.classList.add("active");
    barStep2.classList.remove("active");
    barStep1.classList.add("active");
  });

  // Step2 -> Finish
  finishBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    finishedStep.classList.add("active");
    barStep2.classList.remove("active");
    barFinish.classList.add("active");
  });

  // Finished
  publishBtn.addEventListener("click", () => {
    alert("Publishing logic not implemented. Add your own backend or GitHub commit logic.");
  });
  backToPreviewBtn.addEventListener("click", () => {
    wizardContainer.style.display = "none";
    previewContainer.style.display = "block";
    step1.classList.remove("active");
    step2.classList.remove("active");
    finishedStep.classList.remove("active");
    barStep1.classList.remove("active");
    barStep2.classList.remove("active");
    barFinish.classList.remove("active");
  });

  // Radiobutton toggles
  document.querySelectorAll('input[name="heroType"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if(radio.value === "single"){
        heroSingleDiv.classList.add("active");
        heroSliderDiv.classList.remove("active");
      } else {
        heroSingleDiv.classList.remove("active");
        heroSliderDiv.classList.add("active");
      }
    });
  });
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

  // File Upload & Generate for LOGO
  keepLogoBtn.addEventListener("click", () => {
    alert("Keeping existing logo as-is!");
  });
  uploadLogoBtn.addEventListener("click", () => {
    logoFileInput.click();
  });
  logoFileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0){
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        logoImg.src = e.target.result; 
      };
      reader.readAsDataURL(file);
    }
  });
  generateLogoBtn.addEventListener("click", async() => {
    const prompt = "Professional plumbing logo, strong pipe visuals, color navy and white";
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
          prompt,
          n:1,
          size:"256x256"
        })
      });
      const data = await response.json();
      logoImg.src = data.data[0].url;
      alert("DALL·E generated a new logo!");
    } catch(err) {
      console.error("DALL·E logo error:", err);
      alert("Failed to generate new logo. Check console/logs.");
    }
  });

  // File Upload & Generate for Hero Single
  uploadHeroSingleBtn.addEventListener("click", () => {
    heroSingleFileInput.click();
  });
  heroSingleFileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0){
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        heroSingleImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  generateHeroSingleBtn.addEventListener("click", async() => {
    const prompt = "Hero banner for a plumbing company, bright and modern style";
    try {
      const resp = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: "512x512"
        })
      });
      const data = await resp.json();
      heroSingleImg.src = data.data[0].url;
      alert("DALL·E generated your hero image!");
    } catch(err){
      console.error("DALL·E hero error:", err);
      alert("Failed to generate hero image. See console.");
    }
  });

  // Add Slider Images (just a local demo)
  addSliderImageBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.style.marginBottom = "10px";
    div.innerHTML = `
      <img src="https://via.placeholder.com/600x300?text=Slide" class="preview-image" style="margin-right:8px;">
      <button class="secondary-btn remove-slide-btn">Remove</button>
    `;
    sliderImagesContainer.appendChild(div);

    const removeBtn = div.querySelector(".remove-slide-btn");
    removeBtn.addEventListener("click", () => {
      sliderImagesContainer.removeChild(div);
    });
  });

  // Claude rewriting hero text
  rewriteHeroBtn.addEventListener("click", () => {
    heroHeadline.value = heroHeadline.value + " [Claude rewriting placeholder!]";
    alert("Rewrote hero text (placeholder).");
  });

  // Step2: Single about
  uploadAboutSingleBtn.addEventListener("click", () => {
    aboutSingleFileInput.click();
  });
  aboutSingleFileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0){
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        aboutSingleImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  generateAboutSingleBtn.addEventListener("click", async() => {
    const prompt = "Interior plumber at work, friendly style, for About Us section";
    try {
      const resp = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({ prompt, n:1, size:"512x512" })
      });
      const data = await resp.json();
      aboutSingleImg.src = data.data[0].url;
      alert("Generated about single image!");
    } catch(err){
      console.error("gen about single error:", err);
      alert("Failed to generate about single. Check console.");
    }
  });

  // About #1
  uploadAboutImg1Btn.addEventListener("click", () => {
    aboutImg1FileInput.click();
  });
  aboutImg1FileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0){
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        aboutImg1.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  generateAboutImg1Btn.addEventListener("click", async() => {
    const prompt = "Plumber working on sink for About image #1";
    try {
      const resp = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({ prompt, n:1, size:"512x512" })
      });
      const data = await resp.json();
      aboutImg1.src = data.data[0].url;
    } catch(err){
      console.error("gen about1 error:", err);
      alert("Failed to generate about image #1. Check console.");
    }
  });

  // About #2
  uploadAboutImg2Btn.addEventListener("click", () => {
    aboutImg2FileInput.click();
  });
  aboutImg2FileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0){
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        aboutImg2.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  generateAboutImg2Btn.addEventListener("click", async() => {
    const prompt = "Plumber with big smile, city background, About image #2";
    try {
      const resp = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({ prompt, n:1, size:"512x512" })
      });
      const data = await resp.json();
      aboutImg2.src = data.data[0].url;
    } catch(err){
      console.error("gen about2 error:", err);
      alert("Failed to generate about image #2. See console.");
    }
  });

  rewriteAboutBtn.addEventListener("click", () => {
    aboutText.value = aboutText.value + " [Claude rewriting placeholder!]";
    alert("Rewrote about text (placeholder).");
  });
})();


