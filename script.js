// script.js
(function(){
  // Refs
  const templatesPreview = document.getElementById("templatesPreview");
  const wizardContainer  = document.getElementById("wizardContainer");
  const step1Section     = document.getElementById("step1Section");
  const step2Section     = document.getElementById("step2Section");
  const finishSection    = document.getElementById("finishSection");

  const template1Frame   = document.getElementById("template1Frame");
  const template2Frame   = document.getElementById("template2Frame");

  // Step 1 elements
  const currentLogoImg       = document.getElementById("currentLogoImg");
  const keepLogoBtn          = document.getElementById("keepLogoBtn");
  const uploadLogoBtn        = document.getElementById("uploadLogoBtn");
  const generateLogoBtn      = document.getElementById("generateLogoBtn");
  const logoFileInput        = document.getElementById("logoFileInput");

  const heroSingleDiv        = document.getElementById("heroSingleDiv");
  const heroSliderDiv        = document.getElementById("heroSliderDiv");
  const heroSingleImg        = document.getElementById("heroSingleImg");
  const uploadSingleHeroBtn  = document.getElementById("uploadSingleHeroBtn");
  const generateSingleHeroBtn= document.getElementById("generateSingleHeroBtn");
  const singleHeroFile       = document.getElementById("singleHeroFile");
  const heroHeadline         = document.getElementById("heroHeadline");
  const rewriteHeroBtn       = document.getElementById("rewriteHeroBtn");
  const sliderImagesContainer= document.getElementById("sliderImagesContainer");
  const addSliderImageBtn    = document.getElementById("addSliderImageBtn");

  const step1NextBtn         = document.getElementById("step1NextBtn");

  // Step 2 elements
  const aboutSingleDiv       = document.getElementById("aboutSingleDiv");
  const aboutTwoDiv          = document.getElementById("aboutTwoDiv");
  const aboutSingleImg       = document.getElementById("aboutSingleImg");
  const aboutSingleFile      = document.getElementById("aboutSingleFile");

  const aboutImg1            = document.getElementById("aboutImg1");
  const aboutImg2            = document.getElementById("aboutImg2");
  const uploadAboutImg1Btn   = document.getElementById("uploadAboutImg1Btn");
  const generateAboutImg1Btn = document.getElementById("generateAboutImg1Btn");
  const uploadAboutImg2Btn   = document.getElementById("uploadAboutImg2Btn");
  const generateAboutImg2Btn = document.getElementById("generateAboutImg2Btn");

  const aboutUsText          = document.getElementById("aboutUsText");
  const rewriteAboutBtn      = document.getElementById("rewriteAboutBtn");

  const step2FinishBtn       = document.getElementById("step2FinishBtn");

  // Final
  const publishBtn           = document.getElementById("publishBtn");
  const backToTemplatesBtn   = document.getElementById("backToTemplatesBtn");

  // Internal data
  let plumberData = null;  // the object from finalWebsiteData
  let chosenTemplate = null; // "template1" or "template2"

  // 1) On load, parse ?site=, fetch data
  window.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("site");
    if(!slug) {
      alert("No ?site= param. Can't load plumber data.");
      return;
    }
    try {
      const resp = await fetch("https://raw.githubusercontent.com/greekfreek23/alabamaplumbersnowebsite/main/finalWebsiteData.json");
      if(!resp.ok) throw new Error("Failed to fetch finalWebsiteData.json");
      const json = await resp.json();
      const arr  = json.finalWebsiteData || [];
      plumberData = arr.find(b => (b.siteId||"").toLowerCase() === slug.toLowerCase());
      if(!plumberData) {
        console.warn("No matching plumber data for slug:", slug);
        plumberData = {}; // fallback
      }
      // Fill the iFrames to show the actual templates
      template1Frame.src = `https://greekfreek23.github.io/ALPlumbersSite/?site=${slug}`;
      template2Frame.src = `https://greekfreek23.github.io/ALPlumbersSite/template2/?site=${slug}`;
    } catch(err) {
      console.error("Error loading plumber data:", err);
      plumberData = {};
    }
  });

  // 2) If user clicks "Edit This Site" for T1 or T2
  document.querySelectorAll('.template-block button.primary-btn').forEach(btn => {
    btn.addEventListener("click", () => {
      chosenTemplate = btn.dataset.template; // "template1" or "template2"
      // Hide the templates preview, show the wizard container
      templatesPreview.style.display = "none";
      wizardContainer.style.display  = "block";
      step1Section.classList.add("active");
      loadWizardData();
    });
  });

  // 3) Wizard Step toggles
  document.querySelectorAll('input[name="heroOption"]').forEach(r => {
    r.addEventListener("change", () => {
      if(r.value === "single") {
        heroSingleDiv.classList.add("active");
        heroSliderDiv.classList.remove("active");
      } else {
        heroSingleDiv.classList.remove("active");
        heroSliderDiv.classList.add("active");
      }
    });
  });
  document.querySelectorAll('input[name="aboutImgCount"]').forEach(r => {
    r.addEventListener("change", () => {
      if(r.value === "1") {
        aboutSingleDiv.classList.add("active");
        aboutTwoDiv.classList.remove("active");
      } else {
        aboutSingleDiv.classList.remove("active");
        aboutTwoDiv.classList.add("active");
      }
    });
  });

  // 4) Step 1 next -> Step 2
  step1NextBtn.addEventListener("click", () => {
    step1Section.classList.remove("active");
    step2Section.classList.add("active");
  });
  // 5) Step 2 next -> Finish
  step2FinishBtn.addEventListener("click", () => {
    step2Section.classList.remove("active");
    finishSection.classList.add("active");
  });

  publishBtn.addEventListener("click", () => {
    alert("Publishing changes (not implemented). Could push to GitHub or DB.");
  });
  backToTemplatesBtn.addEventListener("click", () => {
    // Hide wizard, show templates preview
    wizardContainer.style.display = "none";
    templatesPreview.style.display = "block";
    // Reset wizard steps
    step1Section.classList.remove("active");
    step2Section.classList.remove("active");
    finishSection.classList.remove("active");
  });

  // Loading data into the wizard from plumberData
  function loadWizardData(){
    // For now, just show the existing logo if any
    currentLogoImg.src = plumberData.logo || "https://via.placeholder.com/150";

    // If we have hero data
    const heroImgs = plumberData.photos?.heroImages || [];
    if(heroImgs.length > 1) {
      // slider
      document.querySelector('input[value="slider"][name="heroOption"]').checked = true;
      heroSingleDiv.classList.remove("active");
      heroSliderDiv.classList.add("active");
      sliderImagesContainer.innerHTML = "";
      heroImgs.forEach((imgObj, i) => {
        addSliderRow(imgObj, i);
      });
    } else {
      // single
      document.querySelector('input[value="single"][name="heroOption"]').checked = true;
      heroSingleDiv.classList.add("active");
      heroSliderDiv.classList.remove("active");
      const first = heroImgs[0] || {};
      heroSingleImg.src = first.imageUrl || "https://via.placeholder.com/600x300";
      heroHeadline.value = first.callToAction || "";
    }

    // About
    const aboutArr = plumberData.photos?.aboutUsImages || [];
    if(aboutArr.length === 2) {
      document.querySelector('input[value="2"][name="aboutImgCount"]').checked = true;
      aboutSingleDiv.classList.remove("active");
      aboutTwoDiv.classList.add("active");
      aboutImg1.src = aboutArr[0];
      aboutImg2.src = aboutArr[1];
    } else {
      document.querySelector('input[value="1"][name="aboutImgCount"]').checked = true;
      aboutSingleDiv.classList.add("active");
      aboutTwoDiv.classList.remove("active");
      aboutSingleImg.src = aboutArr[0] || "https://via.placeholder.com/300x200";
    }
    aboutUsText.value = plumberData.aboutUs || "";
  }

  function addSliderRow(imgObj, index) {
    const row = document.createElement("div");
    row.className = "slider-row";
    row.innerHTML = `
      <img src="${imgObj.imageUrl}" class="preview-image" alt="Slider${index}"/>
      <button class="secondary-btn replace-slide" data-idx="${index}">Replace</button>
      <button class="secondary-btn generate-slide" data-idx="${index}">Generate w/ DALL·E</button>
      <input type="text" placeholder="Headline" value="${imgObj.callToAction||""}"/>
    `;
    sliderImagesContainer.appendChild(row);
  }

  addSliderImageBtn.addEventListener("click", () => {
    // Add a new blank row
    const newObj = { imageUrl: "https://via.placeholder.com/600x300/ccc", callToAction: "" };
    addSliderRow(newObj, Date.now());
  });

  // Dummy AI function calls
  generateLogoBtn.addEventListener("click", async() => {
    const idea = prompt("Describe your new logo design idea:");
    if(!idea) return;
    // pretend call to DALL·E
    currentLogoImg.src = `https://via.placeholder.com/150/0000ff?text=AI+Logo`;
  });
  rewriteHeroBtn.addEventListener("click", async() => {
    const original = heroHeadline.value;
    heroHeadline.value = original + " [Rewritten by Claude!]";
  });
  rewriteAboutBtn.addEventListener("click", async() => {
    const original = aboutUsText.value;
    aboutUsText.value = original + " [Rewritten by Claude!]";
  });

  // ...Other upload or generate logic similarly
})();

