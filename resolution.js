//resolution code/settings
var resolutionTier="hd";
function getResolutionTier(){var screenWidth=window.screen&&window.screen.width?window.screen.width:window.innerWidth;
var screenHeight=window.screen&&window.screen.height?window.screen.height:window.innerHeight;
var pixelArea=screenWidth*screenHeight;
if(pixelArea>=7900000){return"uhd";
}if(pixelArea>=3600000){return"qhd";
}if(pixelArea>=2000000){return"fhd";
}return"hd";
}function applyResolutionTierStyling(){var nextTier=getResolutionTier();
var body=document.body;
var badge=document.getElementById("updateBadge");
var tierChanged=resolutionTier!==nextTier;
if(!body){return;
}if(tierChanged){resolutionTier=nextTier;
body.setAttribute("data-resolution-tier",nextTier);
}if(badge){badge.setAttribute("data-resolution-label",nextTier.toUpperCase());
}}
