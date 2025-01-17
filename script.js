// script.js
(function(){
  const siteSlugInput = document.getElementById("siteSlug");
  const loadBtn = document.getElementById("loadPreviewBtn");
  const previewFrame = document.getElementById("templatePreview");

  // 1) Read ?site= from this builder's URL
  const builderParams = new URLSearchParams(window.location.search);
  const passedSlug = builderParams.get("site") || "";  // e.g. fussell-plumbing

  // If found, populate the input field
  if (passedSlug) {
    siteSlugInput.value = passedSlug;
  }

  // 2) We'll keep track of "which template" is selected
  let templateRadio = document.querySelector('input[name="templateChoice"]:checked');

  // 3) On page load, if we have a slug from the URL, let's auto-load template1 by default 
  if (passedSlug) {
    // load template1 by default
    document.querySelector('input[value="template1"]').checked = true;
    loadPreview();
  }

  // 4) "Load Preview" button
  loadBtn.addEventListener("click", loadPreview);

  function loadPreview() {
    templateRadio = document.querySelector('input[name="templateChoice"]:checked');
    const templateVal = templateRadio.value; // "template1" or "template2"

    const slug = siteSlugInput.value.trim() || "fussell-plumbing";

    let templateUrl = "";
    if (templateVal === "template1") {
      // root
      templateUrl = `https://greekfreek23.github.io/ALPlumbersSite/?site=${slug}`;
    } else {
      // template2
      templateUrl = `https://greekfreek23.github.io/ALPlumbersSite/template2/?site=${slug}`;
    }

    console.log("Loading iframe with URL:", templateUrl);
    previewFrame.src = templateUrl;
  }
})();
