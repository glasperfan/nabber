// content.js

// listen for action
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   	// iterate over the images
//   	var images = document.getElementsByTagName('img');
//   	for (var i in images) {
//   		downloadImage(images[i]);
//   	}
// });

// on page load, make an index of all of the images and documents on the page, and send that to the popup
$(document).ready(function () {
	
	// collect images
	var images = document.getElementsByTagName('img');
	var docs = collectPDFs();

});

// takes an image or link element and returns the filename
function getName(el) {
	var slashpos = el.lastIndexOf("/");
	var fileName = el.substr(slashpos + 1);
	if (slashpos === -1 || fileName.length < 1) {
		return "Untitled";
	}
	return fileName;
}

// find all links to pdfs on a page
function collectPDFs() {
	var links = document.getElementsByTagName('a');
	var documents = [];
	for (var i=0; i < links.length; i++) {
		var el = links[i];
		if (el.href.indexOf(".pdf") != -1) {
			documents.push(getName(el.href));
		}
	}
	console.log(documents);
}

// takes an image element and downloads it
function downloadImage(img) {
	var a = document.createElement('a');
	a.href = img.src;
	a.download = getName(img.src);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}