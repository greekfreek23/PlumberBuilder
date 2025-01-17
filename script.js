// script.js
(function() {
  let selectedTemplate = null;

  // Called when user clicks "Template 1" or "Template 2" link
  window.selectTemplate = function(template) {
    selectedTemplate = template;
    // For demonstration, let's just load "template2" live preview:
    // Real usage: could load an actual URL, e.g.
    // "https://greekfreek23.github.io/ALPlumbersSite/template2/?site=fussell-plumbing"
    document.getElementById('templatePreview').src =
      "https://greekfreek23.github.io/ALPlumbersSite/" + template + "/?site=fussell-plumbing";
  }

  // Called when user clicks "Update Preview"
  window.updatePreview = function() {
    const bn = document.getElementById('businessName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const about = document.getElementById('aboutUs').value;

    // Example usage: you'd typically patch the JSON or use ChatGPT to rewrite text
    // For now, we just log them
    console.log("Pretend saving to finalWebsiteData.json...", { bn, phone, email, about });

    // If you had a real backend, you'd do a fetch() to update the data
    // Then reload the iframe. For demonstration only:
    if (selectedTemplate) {
      document.getElementById('templatePreview').contentWindow.location.reload();
    } else {
      alert("Please select a template first!");
    }
  }
})();
