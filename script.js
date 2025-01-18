// script.js
(function(){
  let plumberData = null;

  // DOM Refs
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

  // Finished
  const publishBtn       = document.getElementById("publishBtn");
  const backToPreviewBtn = document.getElementById("backToPreviewBtn");

  // On load
  window.addEventListener("DOMContentLoaded", initBuilder);

  async function initBuilder(){
    console.log("Init builder with ?site param");
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("site");
    if(!slug) {
      alert("No ?site= param found. Can't load data!");
      return;
    }
    try {
      const resp = await fetch("https://raw.githubusercontent.com/greekfreek23/alabamaplumbersnowebsite/main/finalWebsiteData.json");
      if(!resp.ok) throw new Error("Failed to fetch finalWebsiteData.json");
      const json = await resp.json();
      const arr  = json.finalWebsiteData || [];
      plumberData = arr.find(b => (b.siteId||"").toLowerCase() === slug.toLowerCase());
      if(!plumberData) {
        console.warn("No matching site data, fallback to empty.");
        plumberData = {};
      }
      // iFrame your single template
      const templateURL = `https://greekfreek23.github.io/ALPlumbersSite/?site=${slug}`;
      templateFrame.src = templateURL;
      console.log("iframe set to:", templateURL);
    } catch(err) {
      console.error("Error fetching plumber data:", err);
      plumberData = {};
    }
  }

  // "Edit This Site"
  editSiteBtn.addEventListener("click", () => {
    console.log("Edit site clicked");
    previewContainer.style.display = "none";
    wizardContainer.style.display  = "block";

    // step bar
    barStep1.classList.add("active");
    barStep2.classList.remove("active");
    barFinish.classList.remove("active");

    step1.classList.add("active");
    step2.classList.remove("active");
    finishedStep.classList.remove("active");

    loadStep1Data();
  });

  function loadStep1Data(){
    console.log("Loading Step1 data from plumberData");
    logoImg.src = plumberData.logo || "https://via.placeholder.com/150";

    // Hero single
    const heroImgs = plumberData.photos?.heroImages || [];
    if(heroImgs.length > 0) {
      heroSingleImg.src = heroImgs[0].imageUrl || "https://via.placeholder.com/600x300";
      heroHeadline.value = heroImgs[0].callToAction || "Default headline...";
    } else {
      heroSingleImg.src = "https://via.placeholder.com/600x300";
      heroHeadline.value = "";
    }
  }

  // Step1 -> Step2
  step1NextBtn.addEventListener("click", () => {
    console.log("Clicked next from Step1");
    step1.classList.remove("active");
    step2.classList.add("active");

    barStep1.classList.remove("active");
    barStep2.classList.add("active");
    barFinish.classList.remove("active");

    loadStep2Data();
  });

  function loadStep2Data(){
    console.log("Loading Step2 data");
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
    aboutText.value = plumberData.aboutUs || "We are a plumbing company...";
  }

  // Step2 -> Finish
  finishBtn.addEventListener("click", () => {
    console.log("Finish clicked");
    step2.classList.remove("active");
    finishedStep.classList.add("active");

    barStep2.classList.remove("active");
    barFinish.classList.add("active");
  });

  // Step2 prev -> Step1
  step2PrevBtn.addEventListener("click", () => {
    console.log("Prev from Step2 -> Step1");
    step2.classList.remove("active");
    step1.classList.add("active");

    barStep2.classList.remove("active");
    barStep1.classList.add("active");
  });

  // Final Step
  publishBtn.addEventListener("click", () => {
    console.log("Publish clicked - not implemented");
    alert("Would push updated data to GitHub or DB here if we had a backend.");
  });
  backToPreviewBtn.addEventListener("click", () => {
    console.log("Back to preview from finished");
    wizardContainer.style.display = "none";
    previewContainer.style.display = "block";
    // reset steps
    step1.classList.remove("active");
    step2.classList.remove("active");
    finishedStep.classList.remove("active");
    barStep1.classList.remove("active");
    barStep2.classList.remove("active");
    barFinish.classList.remove("active");
  });

  // Some logic for hero toggles
  document.querySelectorAll('input[name="heroType"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if(radio.value==="single") {
        heroSingleDiv.classList.add("active");
        heroSliderDiv.classList.remove("active");
      } else {
        heroSingleDiv.classList.remove("active");
        heroSliderDiv.classList.add("active");
      }
    });
  });
  // About toggles
  document.querySelectorAll('input[name="aboutImagesCount"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if(radio.value==="2") {
        aboutSingleDiv.classList.remove("active");
        aboutTwoDiv.classList.add("active");
      } else {
        aboutSingleDiv.classList.add("active");
        aboutTwoDiv.classList.remove("active");
      }
    });
  });

  // File Upload Logic
  uploadLogoBtn.addEventListener("click", () => {
    console.log("Clicked upload logo");
    document.getElementById("logoFileInput").click();
  });
  logoFileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        logoImg.src = e.target.result; // preview the new logo
      };
      reader.readAsDataURL(file);
    }
  });

  // Keep Logo
  keepLogoBtn.addEventListener("click", () => {
    console.log("Keep existing logo clicked - do nothing special");
    alert("We'll keep the existing logo as is.");
  });

  // Generate Logo (DALL·E)
  generateLogoBtn.addEventListener("click", async() => {
    console.log("Generate logo with DALL·E clicked");
    // Example prompt
    const prompt = "Professional plumbing logo with pipe icon, navy and white colors";
    // Call DALL·E endpoint
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: "256x256"
        })
      });
      const data = await response.json();
      // Assuming we got data.data[0].url
      const imageUrl = data.data[0].url;
      logoImg.src = imageUrl;
      alert("DALL·E generated a new logo! See preview above.");
    } catch(err) {
      console.error("DALL·E error:", err);
      alert("Failed to generate new logo with DALL·E. Check console.");
    }
  });

  // Upload Hero Single
  uploadHeroSingleBtn.addEventListener("click", () => {
    heroSingleFileInput.click();
  });
  heroSingleFileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        heroSingleImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Generate Hero Single with DALL·E
  generateHeroSingleBtn.addEventListener("click", async() => {
    const prompt = "A plumbing-themed hero banner, realistic pipes and water imagery";
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
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
      const data = await response.json();
      const imageUrl = data.data[0].url;
      heroSingleImg.src = imageUrl;
      alert("DALL·E generated a new hero image!");
    } catch(err) {
      console.error("DALL·E hero error:", err);
      alert("Failed to generate hero image. Check console.");
    }
  });

  // Rewrite hero text with Claude
  rewriteHeroBtn.addEventListener("click", async() => {
    const text = heroHeadline.value;
    try {
      // Just a placeholder
      heroHeadline.value = text + " [Claude improved!]";
      alert("Claude rewriting done (placeholder).");
    } catch(err) {
      console.error("Claude error:", err);
      alert("Failed to rewrite hero text. Check console.");
    }
  });

  // Slider images (demo)
  addSliderImageBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="https://via.placeholder.com/600x300?text=NewSlide" class="preview-image" style="margin-right:10px;"/>
      <button class="secondary-btn removeSlideBtn">Remove</button>
    `;
    sliderImagesContainer.appendChild(div);
    // Remove button logic
    const removeBtn = div.querySelector(".removeSlideBtn");
    removeBtn.addEventListener("click", () => {
      sliderImagesContainer.removeChild(div);
    });
  });

  // Step 2: Upload/Generate about images
  const uploadAboutSingleBtn = document.getElementById("uploadAboutSingleBtn");
  const generateAboutSingleBtn= document.getElementById("generateAboutSingleBtn");
  const aboutSingleFileInput = document.getElementById("aboutSingleFileInput");

  uploadAboutSingleBtn.addEventListener("click", () => {
    aboutSingleFileInput.click();
  });
  aboutSingleFileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        aboutSingleImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  generateAboutSingleBtn.addEventListener("click", async() => {
    const prompt = "An interior plumbing repair scene, professional and friendly";
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
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
      const data = await response.json();
      aboutSingleImg.src = data.data[0].url;
      alert("DALL·E generated about single image!");
    } catch(err) {
      console.error("Generate about single error:", err);
      alert("Failed to generate about single image. See console.");
    }
  });

  // About images #1 #2
  const uploadAboutImg1Btn   = document.getElementById("uploadAboutImg1Btn");
  const generateAboutImg1Btn = document.getElementById("generateAboutImg1Btn");
  const aboutImg1FileInput   = document.getElementById("aboutImg1FileInput");

  uploadAboutImg1Btn.addEventListener("click", () => {
    aboutImg1FileInput.click();
  });
  aboutImg1FileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        aboutImg1.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  generateAboutImg1Btn.addEventListener("click", async() => {
    try {
      const prompt = "Plumbing service, first about image, cartoon style";
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({ prompt, n:1, size:"512x512" })
      });
      const data = await response.json();
      aboutImg1.src = data.data[0].url;
    } catch(err) {
      console.error("generateAboutImg1 error:", err);
      alert("Failed to generate about image #1");
    }
  });

  // About image #2
  const uploadAboutImg2Btn   = document.getElementById("uploadAboutImg2Btn");
  const generateAboutImg2Btn = document.getElementById("generateAboutImg2Btn");
  const aboutImg2FileInput   = document.getElementById("aboutImg2FileInput");

  uploadAboutImg2Btn.addEventListener("click", () => {
    aboutImg2FileInput.click();
  });
  aboutImg2FileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        aboutImg2.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  generateAboutImg2Btn.addEventListener("click", async() => {
    try {
      const prompt = "Plumbing service, second about image, realistic style";
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({ prompt, n:1, size:"512x512" })
      });
      const data = await response.json();
      aboutImg2.src = data.data[0].url;
    } catch(err) {
      console.error("generateAboutImg2 error:", err);
      alert("Failed to generate about image #2");
    }
  });

  // Rewrite about
  rewriteAboutBtn.addEventListener("click", async() => {
    try {
      aboutText.value = aboutText.value + " [Claude rewriting placeholder!]";
      alert("Claude rewriting About text done (mock).");
    } catch(err) {
      console.error("Claude about error:", err);
      alert("Rewrite about text failed. Check console.");
    }
  });
})();


