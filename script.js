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

  // STEP1: LOGO
  const keepLogoBtn      = document.getElementById("keepLogoBtn");
  const uploadLogoBtn    = document.getElementById("uploadLogoBtn");
  const logoFileInput    = document.getElementById("logoFileInput");
  const logoImg          = document.getElementById("logoImg");

  // STEP1: HERO
  const step1NextBtn     = document.getElementById("step1NextBtn");
  const heroModeRadios   = document.getElementsByName("heroMode");
  const heroSingleDiv    = document.getElementById("heroSingleDiv");
  const heroMultipleDiv  = document.getElementById("heroMultipleDiv");

  const singleHeroChoices= document.getElementById("singleHeroChoices");
  const uploadSingleHeroBtn = document.getElementById("uploadSingleHeroBtn");
  const heroSingleFileInput = document.getElementById("heroSingleFileInput");
  const singleHeroHeadline  = document.getElementById("singleHeroHeadline");
  const rewriteSingleHeroBtn= document.getElementById("rewriteSingleHeroBtn");

  const multiHeroContainer= document.getElementById("multiHeroContainer");
  const addMoreMultiHeroBtn= document.getElementById("addMoreMultiHeroBtn");
  const multiHeroFileInput = document.getElementById("multiHeroFileInput");
  const multiHeroHeadline  = document.getElementById("multiHeroHeadline");
  const rewriteMultiHeroBtn= document.getElementById("rewriteMultiHeroBtn");

  // STEP2
  const step2PrevBtn     = document.getElementById("step2PrevBtn");
  const finishBtn        = document.getElementById("finishBtn");

  // FINISHED
  const publishBtn       = document.getElementById("publishBtn");
  const backToPreviewBtn = document.getElementById("backToPreviewBtn");

  // Local arrays for hero images if multiple
  let multipleHeroImages = [];

  // On load, parse ?site=, fetch data
  window.addEventListener("DOMContentLoaded", initBuilder);

  async function initBuilder(){
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("site");
    if(!slug){
      alert("No ?site= param. Can't load data!");
      return;
    }
    try {
      const resp = await fetch("https://raw.githubusercontent.com/greekfreek23/alabamaplumbersnowebsite/main/finalWebsiteData.json");
      if(!resp.ok) throw new Error("Failed to fetch finalWebsiteData.json");
      const json = await resp.json();
      const arr  = json.finalWebsiteData || [];
      plumberData = arr.find(b => (b.siteId||"").toLowerCase() === slug.toLowerCase());
      if(!plumberData) {
        console.warn("No site data matched, fallback to empty.");
        plumberData = {};
      }
      // Put the old site in the iframe
      const templateURL = `https://greekfreek23.github.io/ALPlumbersSite/?site=${slug}`;
      templateFrame.src = templateURL;
    } catch(err){
      console.error("Fetch plumber data error:", err);
      plumberData = {};
    }
  }

  // "Edit This Site" -> show wizard
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

    // Hero images
    const heroArr = plumberData.photos?.heroImages || [];
    // Single
    singleHeroChoices.innerHTML = "";
    heroArr.forEach((imgObj, idx) => {
      // create a radio to pick this old image
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "singleHeroPick";
      radio.value = imgObj.imageUrl;
      if(idx===0) radio.checked = true;

      radio.addEventListener("change", () => {
        // set the single hero preview
        // also update singleHeroHeadline if you want to reflect its callToAction
        document.getElementById("heroSingleImg").src = imgObj.imageUrl;
        singleHeroHeadline.value = imgObj.callToAction || "Enter your hero text...";
      });
      const label = document.createElement("label");
      label.style.marginRight = "10px";
      label.textContent = `Old Hero #${idx+1}`;

      singleHeroChoices.appendChild(radio);
      singleHeroChoices.appendChild(label);
    });
    // If there's at least one hero, use the first as default
    if(heroArr[0]){
      heroSingleImg.src = heroArr[0].imageUrl;
      singleHeroHeadline.value = heroArr[0].callToAction || "";
    } else {
      heroSingleImg.src = "https://via.placeholder.com/600x300";
      singleHeroHeadline.value = "";
    }

    // multiple
    multipleHeroImages = heroArr.map(x => x.imageUrl); // keep an array of strings
    renderMultipleHeroImages();

    // If plumberData has a global heroHeadline
    multiHeroHeadline.value = plumberData.heroHeadline || "Our best plumbing solutions!";
  }

  // Keep existing logo
  keepLogoBtn.addEventListener("click", () => {
    alert("Keeping old logo, no changes!");
  });

  // Upload new logo
  uploadLogoBtn.addEventListener("click", () => {
    logoFileInput.click();
  });
  logoFileInput.addEventListener("change", ev => {
    if(ev.target.files.length>0){
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        logoImg.src = e.target.result; // show the newly uploaded
      };
      reader.readAsDataURL(file);
    }
  });

  // hero single or multiple choice
  document.querySelectorAll('input[name="heroMode"]').forEach(r => {
    r.addEventListener("change", () => {
      if(r.value==="single"){
        heroSingleDiv.classList.add("active");
        heroMultipleDiv.classList.remove("active");
      } else {
        heroSingleDiv.classList.remove("active");
        heroMultipleDiv.classList.add("active");
      }
    });
  });

  // Upload single hero
  uploadSingleHeroBtn.addEventListener("click", () => {
    heroSingleFileInput.click();
  });
  heroSingleFileInput.addEventListener("change", ev => {
    if(ev.target.files.length>0){
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        heroSingleImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // multiple hero
  addMoreMultiHeroBtn.addEventListener("click", () => {
    multiHeroFileInput.click();
  });
  multiHeroFileInput.addEventListener("change", ev => {
    if(ev.target.files.length>0){
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        multipleHeroImages.push(e.target.result);
        renderMultipleHeroImages();
      };
      reader.readAsDataURL(file);
    }
  });

  function renderMultipleHeroImages(){
    multiHeroContainer.innerHTML = "";
    multipleHeroImages.forEach((url, idx) => {
      const row = document.createElement("div");
      row.style.marginBottom = "10px";
      row.innerHTML = `
        <img src="${url}" class="preview-image" style="margin-right:8px;">
        <button class="secondary-btn removeMultiBtn">Remove</button>
      `;
      multiHeroContainer.appendChild(row);

      const removeBtn = row.querySelector(".removeMultiBtn");
      removeBtn.addEventListener("click", () => {
        multipleHeroImages.splice(idx,1);
        renderMultipleHeroImages();
      });
    });
  }

  // rewrite single hero text with Claude
  rewriteSingleHeroBtn.addEventListener("click", async() => {
    const oldText = singleHeroHeadline.value || "Your hero text here...";
    try {
      const newText = await rewriteWithClaude(oldText);
      singleHeroHeadline.value = newText.trim();
      alert("Single hero text updated via Claude!");
    } catch(err){
      console.error("Rewrite single hero error:", err);
      alert("Rewrite single hero failed. Check console.");
    }
  });

  // rewrite multiple hero text with Claude
  rewriteMultiHeroBtn.addEventListener("click", async() => {
    const oldText = multiHeroHeadline.value || "Global multi hero text...";
    try {
      const newText = await rewriteWithClaude(oldText);
      multiHeroHeadline.value = newText.trim();
      alert("Multi hero text updated via Claude!");
    } catch(err){
      console.error("Rewrite multi hero error:", err);
      alert("Rewrite multi hero text failed. Check console.");
    }
  });

  async function rewriteWithClaude(oldText){
    // Real call to Claude
    const claudeUrl = "https://api.anthropic.com/v1/complete";
    const prompt = `Rewrite this hero text for a plumbing site: "${oldText}"\nRewrite:`;
    const resp = await fetch(claudeUrl, {
      method: "POST",
      headers: {
        "x-api-key": "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",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-v1",
        prompt,
        max_tokens_to_sample: 150,
        temperature: 0.7
      })
    });
    if(!resp.ok) throw new Error("Claude rewriting request failed");
    const data = await resp.json();
    // typically data.completion
    return data.completion || oldText;
  }

  // step1Next -> step2
  step1NextBtn.addEventListener("click", () => {
    step1.classList.remove("active");
    step2.classList.add("active");

    barStep1.classList.remove("active");
    barStep2.classList.add("active");
    barFinish.classList.remove("active");
  });

  // step2Prev -> step1
  step2PrevBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    step1.classList.add("active");

    barStep2.classList.remove("active");
    barStep1.classList.add("active");
  });

  // step2 -> finish
  finishBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    finishedStep.classList.add("active");

    barStep2.classList.remove("active");
    barFinish.classList.add("active");
  });

  // final step
  publishBtn.addEventListener("click", () => {
    alert("Publish not implemented. You'd store final data or push to GitHub here.");
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
})();



