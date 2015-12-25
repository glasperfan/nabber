// content.js

// listen for action
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  	// iterate over the images
  	var images = document.getElementsByTagName('img');
  	for (var i in images) {
  		downloadImage(images[i]);
  	}
});

// takes an image element and returns the filename
function getName(img) {
	return img.src.replace(/^.*[\\\/]/, '');	
}

// takes an image element and downloads it
function downloadImage(img) {
	var a = document.createElement('a');
	a.href = img.src;
	a.download = getName(img);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}