// content.js

// on page load, make an index of all of the images and documents on the page, and send that to the popup
$(document).ready(function () {	
	images = collectImages();
	pdfs = collectPDFs();
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	if (request.message === "collect_links") {
		console.log("request received!");
		console.log(images);
		sendResponse({ 
			images: images,
			pdfs: pdfs 
		});
	}

});




/*
 *
 * Helper Functions
 *
 */

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
	var pdfs = [];
	for (var i=0; i < links.length; i++) {
		var el = links[i];
		if (el.href.indexOf(".pdf") != -1) {
			pdfs.push({
				name: getName(el.href),
				link: el.href
			});
		}
	}
	return pdfs;
}

// find all image links
function collectImages() {
	var els = Array.prototype.slice.call(document.getElementsByTagName('img'));
	var imgs = els.map(function(el) {
		return {
			name: getName(el.src),
			link: el.src
		}
	});
	return imgs;
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

