// content.js
MaxUrlLength = 32;

// on page load, make an index of all of the images and documents on the page, and send that to the popup
$(document).ready(function () {	
	images = collectImages();
	pdfs = collectPDFs();
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//console.log("RECEIVING REQUEST: " + request.message);
	
	// collect links
	if (request.message === "collect_links") {
		sendResponse({ 
			images: images,
			pdfs: pdfs 
		});
	}

	// download resources
	if (request.message === "download") {
		downloads = request.toDownload;
		for (var i = 0; i < downloads.length; i++) {
			downloadImage(downloads[i].link, downloads[i].name);
		}
		sendResponse({message: "close_popup"});
	}
});




/*
 *
 * Helper Functions
 *
 */

// takes an image or link element and returns the filename
function getName(el) {
	// Use the alt if you can.
	if (el.alt !== undefined) {
		if (el.alt.length > 0) {
			return el.alt;
		}
	}
	var text = (el.href === undefined) ? el.src : el.href;
	var fileName = text.split("/").pop();
	if (fileName.length < 1) {
		return "Untitled";
	}
	// trim long names
	if (fileName.length > MaxUrlLength) {
		var dotpos = fileName.lastIndexOf(".");
		if (dotpos > - 1) {
			var ext = fileName.substr(dotpos);
			var excerpt = fileName.substr(0, MaxUrlLength - ext.length) + "..." + ext;
			return excerpt;
		}
		return fileName.substr(0, MaxUrlLength - 3) + "...";
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
				name: getName(el),
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
			name: getName(el),
			link: el.src
		}
	});
	return imgs;
}

// takes an image element and downloads it
function downloadImage(link, name) {
	var a = document.createElement('a');
	a.href = link;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

