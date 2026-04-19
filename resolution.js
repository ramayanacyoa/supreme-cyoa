//resolution code/settings
var resolutionTier = "hd";

function getResolutionTier() {
  var screenWidth = window.screen && window.screen.width ? window.screen.width : window.innerWidth;
  var screenHeight = window.screen && window.screen.height ? window.screen.height : window.innerHeight;
  var pixelArea = screenWidth * screenHeight;
  if (pixelArea >= 7900000) {
    return "uhd";
  }
  if (pixelArea >= 3600000) {
    return "qhd";
  }
  if (pixelArea >= 2000000) {
    return "fhd";
  }
  return "hd";
}

function applyResolutionTierStyling() {
  var nextTier = getResolutionTier();
  var body = document.body;
  var badge = document.getElementById("updateBadge");
  var navbar = document.getElementById("topNavbar");
  var soundtrackBadge = document.getElementById("soundtrackBadge");
  var backgroundMusic = document.getElementById("backgroundMusic");
  var volumeSlider = document.getElementById("volumeSlider");
  var volumeValue = document.getElementById("volumeValue");
  var tierChanged = resolutionTier !== nextTier;
  var isMobileLayout = window.innerWidth <= 768;

  if (!body) {
    return;
  }

  if (tierChanged) {
    resolutionTier = nextTier;
    body.setAttribute("data-resolution-tier", nextTier);
  }

  body.setAttribute("data-mobile-layout", isMobileLayout ? "true" : "false");

  if (badge) {
    badge.setAttribute("data-resolution-label", nextTier.toUpperCase());
  }

  if (navbar) {
    navbar.style.rowGap = isMobileLayout ? "8px" : "";
  }

  if (soundtrackBadge) {
    soundtrackBadge.style.width = isMobileLayout ? "100%" : "";
    soundtrackBadge.style.justifyContent = isMobileLayout ? "center" : "";
    soundtrackBadge.style.alignItems = isMobileLayout ? "center" : "";
    soundtrackBadge.style.gap = isMobileLayout ? "6px" : "";
  }

  if (backgroundMusic) {
    backgroundMusic.style.width = isMobileLayout ? "min(170px,45vw)" : "";
    backgroundMusic.style.height = isMobileLayout ? "26px" : "";
  }

  if (volumeSlider) {
    volumeSlider.style.width = isMobileLayout ? "min(130px,38vw)" : "130px";
    volumeSlider.style.accentColor = "#f6c26f";
    volumeSlider.style.cursor = "pointer";
  }

  if (volumeValue) {
    volumeValue.style.minWidth = isMobileLayout ? "40px" : "44px";
    volumeValue.style.textAlign = "right";
  }
}
