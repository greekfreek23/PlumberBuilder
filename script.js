// script.js
(function(){
  const loadBtn = document.getElementById("loadPreviewBtn");
  const previewFrame = document.getElementById("templatePreview");
  const siteSlugInput = document.getElementById("siteSlug");

  loadBtn.addEventListener("click", () => {
    // 1) Which template is selected?
    const templateValue = document.querySelector('input[name="templateChoice"]:checked').value;

    // 2) Site slug
    const slug = siteSlugInput.value.trim() || "fussell-plumbing";  // default

    // 3) Construct the full URL
    let templateUrl = "";
    if(templateValue === "template1") {
      templateUrl = `https://greekfreek23.github.io/ALPlumbersSite/?site=${slug}`;
    } else if(templateValue === "template2") {
      templateUrl = `https://greekfreek23.github.io/ALPlumbersSite/template2/?site=${slug}`;
    }

    // 4) Load into iframe
    previewFrame.src = templateUrl;
  });
})();
