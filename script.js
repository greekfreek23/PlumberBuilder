// script.js
(function(){
  let plumberData = null;

  // DOM references
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

  // Step1 elements
  const step1NextBtn     = document.getElementById("step1NextBtn");
  const logoImg          = document.getElementById("logoImg");
  const keepLogoBtn      = document.getElementById("keepLogoBtn");
  const uploadLogoBtn    = document.getElementById("uploadLogoBtn");
  const logoFileInput    = document.getElementById("logoFileInput");

  // Hero single vs multiple
  const heroSingleDiv    = document.getElementById("heroSingleDiv");
  const heroMultipleDiv  = document.getElementById("heroMultipleDiv");
  const singleHeroChoices= document.getElementById("singleHeroChoices");
  const heroSingleImg    = document.getElementById("heroSingleImg");
  const heroHeadline     = document.getElementById("heroHeadline");

  const uploadSingleHeroBtn  = document.getElementById("uploadSingleHeroBtn");
  const heroSingleFileInput  = document.getElementById("heroSingleFileInput");

  const rewriteHeroBtn   = document.getElementById("rewriteHeroBtn");

  const addSliderImageBtn= document.getElementById("addSliderImageBtn");
  const multiHeroFileInput  = document.getElementById("multiHeroFileInput");
  const heroMultipleDiv  = document.getElementById("heroMultipleDiv");
  const sliderImagesContainer= document.getElementById("sliderImagesContainer");

  // Step2
  const step2PrevBtn     = document.getElementById("step2PrevBtn");
  const finishBtn        = document.getElementById("finishBtn");

  // Finished
  const publishBtn       = document.getElementById("publishBtn");
  const backToPreviewBtn = document.getElementById("backToPreviewBtn");

  // On load, parse ?site= param, fetch data
  window.addEventListener("DOMContentLoaded", async() => {
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
        console.warn("No matching site data. Using fallback empty object.");
        plumberData = {};
      }
      // Put the template in the iFrame
      const templateURL = `https://greekfreek23.github.io/ALPlumbersSite/?site=${slug}`;
      templateFrame.src = templateURL;
    } catch(err) {
      console.error("Error fetching plumber data:", err);
      plumberData = {};
    }
  });

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
    // LOGO
    logoImg.src = plumberData.logo || "https://via.placeholder.com/150";

    // Hero single vs. multiple
    // We'll load the "three original images" from plumberData.photos?.heroImages
    // Example: plumberData.photos?.heroImages = [{imageUrl: '...'}, {imageUrl: '...'}, {imageUrl: '...'}]
    const heroArr = plumberData.photos?.heroImages || [];
    // Single hero
    // We'll create radio buttons for each of the three images
    singleHeroChoices.innerHTML = "";
    if(heroArr.length>0){
      heroArr.forEach((imgObj, idx) => {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "singleHeroChoice";
        radio.value = imgObj.imageUrl;
        if(idx===0) radio.checked = true; // pick the first by default

        const label = document.createElement("label");
        label.style.marginRight = "15px";
        label.textContent = `Original Hero #${idx+1}`;

        // when user picks this radio, update the preview
        radio.addEventListener("change", () => {
          heroSingleImg.src = imgObj.imageUrl;
        });

        singleHeroChoices.appendChild(radio);
        singleHeroChoices.appendChild(label);
      });
    } else {
      // no original images
      singleHeroChoices.textContent = "No original hero images found. Please upload or select multiple.";
    }

    heroSingleImg.src = (heroArr[0]?.imageUrl) || "https://via.placeholder.com/600x300";
    heroHeadline.value = heroArr[0]?.callToAction || "Your default hero text...";

    // multiple
    sliderImagesContainer.innerHTML = "";
    if(heroArr.length>0){
      heroArr.forEach((imgObj, idx) => {
        addMultiHeroRow(imgObj.imageUrl, idx);
      });
    }
  }

  // keep existing logo
  keepLogoBtn.addEventListener("click", () => {
    alert("We’ll keep the existing logo. No changes.");
  });

  // upload new logo
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

  // Single hero upload
  uploadSingleHeroBtn.addEventListener("click", () => {
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

  // multiple hero upload
  addSliderImageBtn.addEventListener("click", () => {
    multiHeroFileInput.click();
  });
  multiHeroFileInput.addEventListener("change", (ev) => {
    if(ev.target.files.length>0){
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        addMultiHeroRow(e.target.result, Date.now()); // use dataURL as src
      };
      reader.readAsDataURL(file);
    }
  });

  // rewriting hero text with Claude
  rewriteHeroBtn.addEventListener("click", async() => {
    const oldText = heroHeadline.value;
    try {
      // Actually call Claude
      const claudeEndpoint = "https://api.anthropic.com/v1/complete";
      const payload = {
        prompt: `Rewrite this hero text for a plumbing website:\\n\"${oldText}\"\\n\\nRewrite:`,
        model: "claude-v1",
        max_tokens_to_sample: 150,
        temperature: 0.7
      };
      const resp = await fetch(claudeEndpoint, {
        method: "POST",
        headers: {
          "x-api-key": "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",
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if(!resp.ok) throw new Error("Claude rewrite request failed");
      const data = await resp.json();
      // The response structure from Anthropic typically has data.completion or data.completions
      const newText = data.completion || "[Claude returned no text, check model!]";
      heroHeadline.value = newText.trim();
      alert("Hero text rewritten by Claude!");
    } catch(err){
      console.error("Claude rewrite error:", err);
      alert("Rewrite with Claude failed. Check console/logs.");
    }
  });

  // step1 next -> step2
  step1NextBtn.addEventListener("click", () => {
    step1.classList.remove("active");
    step2.classList.add("active");

    barStep1.classList.remove("active");
    barStep2.classList.add("active");
    barFinish.classList.remove("active");
  });

  // Step2 prev -> Step1
  step2PrevBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    step1.classList.add("active");

    barStep2.classList.remove("active");
    barStep1.classList.add("active");
  });

  // Step2 -> finish
  finishBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    finishedStep.classList.add("active");

    barStep2.classList.remove("active");
    barFinish.classList.add("active");
  });

  // Finish step
  publishBtn.addEventListener("click", () => {
    alert("Publish not implemented. You'd push data to a backend or GitHub here.");
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

  // Radio toggles for hero single vs multiple
  document.querySelectorAll('input[name="heroChoice"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if(radio.value === "single"){
        heroSingleDiv.classList.add("active");
        heroMultipleDiv.classList.remove("active");
      } else {
        heroSingleDiv.classList.remove("active");
        heroMultipleDiv.classList.add("active");
      }
    });
  });

  // helper to add multiple hero row
  function addMultiHeroRow(src, idx){
    const wrap = document.createElement("div");
    wrap.style.marginBottom = "8px";
    wrap.innerHTML = `
      <img src="${src}" class="preview-image" style="margin-right:10px;">
      <button class="secondary-btn removeMultiBtn">Remove</button>
    `;
    sliderImagesContainer.appendChild(wrap);

    const removeBtn = wrap.querySelector(".removeMultiBtn");
    removeBtn.addEventListener("click", () => {
      sliderImagesContainer.removeChild(wrap);
    });
  }
})();

