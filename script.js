// script.js
(function(){
  // Sections
  const landingSection = document.getElementById("landingSection");
  const step1Section   = document.getElementById("step1Section");
  const step2Section   = document.getElementById("step2Section");
  const finalSection   = document.getElementById("finalSection");

  // Buttons
  const startBuilderBtn = document.getElementById("startBuilderBtn");
  const step1NextBtn    = document.getElementById("step1NextBtn");
  const step2NextBtn    = document.getElementById("step2NextBtn");
  const publishBtn      = document.getElementById("publishBtn");

  // DOM elements for Step 1 (logo + hero)
  const currentLogoImg      = document.getElementById("currentLogoImg");
  const keepLogoBtn         = document.getElementById("keepLogoBtn");
  const uploadLogoBtn       = document.getElementById("uploadLogoBtn");
  const generateLogoBtn      = document.getElementById("generateLogoBtn");
  const logoFileInput       = document.getElementById("logoFileInput");

  const heroSingleDiv       = document.getElementById("heroSingleDiv");
  const heroSliderDiv       = document.getElementById("heroSliderDiv");
  const heroSingleImg       = document.getElementById("heroSingleImg");
  const uploadSingleHeroBtn = document.getElementById("uploadSingleHeroBtn");
  const generateSingleHeroBtn = document.getElementById("generateSingleHeroBtn");
  const singleHeroFile      = document.getElementById("singleHeroFile");
  const heroHeadline        = document.getElementById("heroHeadline");
  const rewriteHeroBtn      = document.getElementById("rewriteHeroBtn");

  const sliderImagesContainer = document.getElementById("sliderImagesContainer");
  const addSliderImageBtn     = document.getElementById("addSliderImageBtn");

  // DOM for Step 2 (about)
  const aboutSingleDiv       = document.getElementById("aboutSingleDiv");
  const aboutTwoDiv          = document.getElementById("aboutTwoDiv");
  const aboutSingleImg       = document.getElementById("aboutSingleImg");
  const uploadAboutSingleBtn = document.getElementById("uploadAboutSingleBtn");
  const generateAboutSingleBtn = document.getElementById("generateAboutSingleBtn");
  const aboutSingleFile      = document.getElementById("aboutSingleFile");

  const aboutImg1            = document.getElementById("aboutImg1");
  const aboutImg2            = document.getElementById("aboutImg2");
  const uploadAboutImg1Btn   = document.getElementById("uploadAboutImg1Btn");
  const generateAboutImg1Btn = document.getElementById("generateAboutImg1Btn");
  const uploadAboutImg2Btn   = document.getElementById("uploadAboutImg2Btn");
  const generateAboutImg2Btn = document.getElementById("generateAboutImg2Btn");

  const aboutUsText          = document.getElementById("aboutUsText");
  const rewriteAboutBtn      = document.getElementById("rewriteAboutBtn");

  // Global plumber data object
  let plumberData = null; 

  // 1) On load, parse ?site= and fetch data from finalWebsiteData.json
  window.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("site");
    if (!slug) {
      alert("No ?site= param found. We cannot load plumber data.");
      return;
    }

    try {
      const resp = await fetch("https://raw.githubusercontent.com/greekfreek23/alabamaplumbersnowebsite/main/finalWebsiteData.json");
      if(!resp.ok) throw new Error("Failed to load finalWebsiteData.json");
      const jsonData = await resp.json();
      // Typically, finalWebsiteData is an array?
      const arr = jsonData.finalWebsiteData || [];
      plumberData = arr.find(b => (b.siteId || "").toLowerCase() === slug.toLowerCase());
      if(!plumberData) {
        console.warn("No matching plumber data for slug:", slug);
        // fallback?
        plumberData = {}; 
      }
    } catch(err) {
      console.error("Error fetching plumber data:", err);
      plumberData = {};
    }

    // If we have plumberData, show the existing logo, hero images, about, etc.
    loadInitialData();
  });

  function loadInitialData(){
    // Show existing logo or fallback
    currentLogoImg.src = plumberData.logo || "https://via.placeholder.com/150";

    // Hero single or slider?
    const heroType = plumberData.photos?.heroImages?.length > 1 ? "slider" : "single";
    document.querySelectorAll('input[name="heroOption"]').forEach(r => {
      if(r.value === heroType) r.checked = true;
    });
    // If single
    if(heroType === "single") {
      heroSingleDiv.classList.add("active");
      heroSliderDiv.classList.remove("active");
      const firstHero = plumberData.photos?.heroImages?.[0];
      heroSingleImg.src = firstHero?.imageUrl || "https://via.placeholder.com/600x300";
      heroHeadline.value = firstHero?.callToAction || "";
    } else {
      heroSingleDiv.classList.remove("active");
      heroSliderDiv.classList.add("active");
      // Populate the slider images
      const heroImgs = plumberData.photos?.heroImages || [];
      sliderImagesContainer.innerHTML = "";
      heroImgs.forEach((imgObj, index) => {
        addSliderImageRow(imgObj, index);
      });
    }

    // About: check if we have 2 images
    const aboutCount = plumberData.photos?.aboutUsImages?.length === 2 ? "2" : "1";
    document.querySelectorAll('input[name="aboutImageCount"]').forEach(r => {
      if(r.value === aboutCount) r.checked = true;
    });
    if(aboutCount === "1") {
      aboutSingleDiv.classList.add("active");
      aboutTwoDiv.classList.remove("active");
      const single = plumberData.photos?.aboutUsImages?.[0];
      aboutSingleImg.src = single || "https://via.placeholder.com/300x200";
    } else {
      aboutSingleDiv.classList.remove("active");
      aboutTwoDiv.classList.add("active");
      aboutImg1.src = plumberData.photos?.aboutUsImages?.[0] || "https://via.placeholder.com/300x200";
      aboutImg2.src = plumberData.photos?.aboutUsImages?.[1] || "https://via.placeholder.com/300x200";
    }
    aboutUsText.value = plumberData.aboutUs || "";
  }

  // 2) Landing -> Step 1
  startBuilderBtn.addEventListener("click", () => {
    landingSection.classList.remove("active");
    step1Section.classList.add("active");
  });

  // 3) Step 1 radio toggles (single vs. slider)
  document.querySelectorAll('input[name="heroOption"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if(radio.value === "single") {
        heroSingleDiv.classList.add("active");
        heroSliderDiv.classList.remove("active");
      } else {
        heroSingleDiv.classList.remove("active");
        heroSliderDiv.classList.add("active");
      }
    });
  });

  // 4) Step 2 radio toggles (about 1 or 2)
  document.querySelectorAll('input[name="aboutImageCount"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if(radio.value === "1") {
        aboutSingleDiv.classList.add("active");
        aboutTwoDiv.classList.remove("active");
      } else {
        aboutSingleDiv.classList.remove("active");
        aboutTwoDiv.classList.add("active");
      }
    });
  });

  // 5) Step 1 -> Step 2
  step1NextBtn.addEventListener("click", () => {
    step1Section.classList.remove("active");
    step2Section.classList.add("active");
  });

  // 6) Step 2 -> Final
  step2NextBtn.addEventListener("click", () => {
    step2Section.classList.remove("active");
    finalSection.classList.add("active");
  });

  // 7) Publish
  publishBtn.addEventListener("click", () => {
    alert("Publishing not yet implemented—would push to GitHub or DB!");
  });

  // For slider images, we add dynamic rows
  function addSliderImageRow(imgObj, index) {
    const row = document.createElement("div");
    row.className = "slider-image-row";
    row.innerHTML = `
      <img src="${imgObj.imageUrl}" alt="Slide${index}" class="preview-image" />
      <button class="secondary-btn replace-slider-img" data-idx="${index}">Replace</button>
      <button class="secondary-btn generate-slider-img" data-idx="${index}">Generate w/ DALL·E</button>
      <input type="text" placeholder="CallToAction" class="slider-cta-input" value="${imgObj.callToAction || ""}" />
    `;
    sliderImagesContainer.appendChild(row);
  }

  // Upload or generate logic
  // (Here we do placeholders; you'd implement the actual file reading or DALL·E calls.)

  uploadLogoBtn.addEventListener("click", () => {
    logoFileInput.click();
  });
  logoFileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length > 0) {
      const file = ev.target.files[0];
      // read & preview
      const url = URL.createObjectURL(file);
      currentLogoImg.src = url;
    }
  });

  generateLogoBtn.addEventListener("click", async() => {
    const prompt = prompt("Describe what you want your new logo to look like (colors, style)...");
    if(!prompt) return;
    // Here you call DALL·E with the user input
    // e.g. let newLogoUrl = await generateDalleImage(prompt);
    const newLogoUrl = "https://via.placeholder.com/150/0000ff?text=AI+Logo"; // placeholder
    currentLogoImg.src = newLogoUrl;
  });

  rewriteHeroBtn.addEventListener("click", async() => {
    const text = heroHeadline.value;
    const newText = await rewriteWithClaude(text, "Make it more friendly and marketing-oriented");
    heroHeadline.value = newText;
  });

  rewriteAboutBtn.addEventListener("click", async() => {
    const text = aboutUsText.value;
    const newText = await rewriteWithClaude(text, "Rewrite in a professional yet warm tone");
    aboutUsText.value = newText;
  });


  // Pseudocode for AI calls
  async function rewriteWithClaude(originalText, instructions) {
    // you'd do a fetch to your backend or directly to the Claude API
    // for demo, we'll just append " [AI rewritten]" 
    return originalText + " [AI Rewritten: " + instructions + "]";
  }

  // Similarly for DALL·E
  async function generateDalleImage(prompt) {
    // do fetch to openai's DALL·E endpoint with your token
    // return the resulting image URL
    return "https://via.placeholder.com/300/ff00ff?text=DALL-E+Generated";
  }
})();
