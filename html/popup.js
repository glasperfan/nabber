// popup.js

img_col_id = "images";
doc_col_id = "docs";
img_sel_id = "img_select_all";
doc_sel_id = "doc_select_all";
img_column = document.getElementById(img_col_id);
doc_column = document.getElementById(doc_col_id);
img_select_all = document.getElementById(img_sel_id);
doc_select_all = document.getElementById(doc_sel_id);
submit_button = document.getElementById("submit");
form_el = document.getElementById("nabber_form");
inputs = document.getElementsByTagName("input");

// When the popup is opened, send a message to collect the links 
document.addEventListener('DOMContentLoaded', function() {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "collect_links"}, function(response) {
            
            images = response.images;
            pdfs = response.pdfs;
            
            for (var i = 0; i < images.length; i++) {
            	addCheckbox(img_column, img_col_id, images[i].link, images[i].name);
            }

            for (var i = 0; i < pdfs.length; i++) {
            	addCheckbox(doc_column, doc_col_id, pdfs[i].link, pdfs[i].name);
            }

            // fix left/right height to adjust the border
		    var max_height = Math.max($('.left').height(), $('.right').height())
		    $('.left').height(max_height);
		    $('.right').height(max_height);
        });
    });

    // add listener to select-all options
    img_select_all.addEventListener('change', function() {
        toggleAll(img_select_all);
    });
    doc_select_all.addEventListener('change', function() {
        toggleAll(doc_select_all);
    });

    // prevent form submission
    nabber_form.addEventListener("submit", function(evt){
        evt.preventDefault();
        window.history.back();
    }, true);

    // add listener to the submit button
    submit_button.addEventListener('click', function() {
    	submit_button.value = "Got it!";
    	submit_button.style.backgroundColor = "#35D63A";
    	setTimeout(function() {
    		// determine which images to download
    		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    			toDownload = []; 
    			for (var i = 0; i < inputs.length; i++) {
    				ipi = inputs[i];
    				if ((ipi.name === img_col_id || ipi.name === doc_col_id) && ipi.checked) {
    					toDownload.push({
    						link: ipi.id,
    						name: $('label[for="' + ipi.id + '"]').text()
    					});
    				}
    			}
    			// send message to content script to download selected images
    			chrome.tabs.sendMessage(tabs[0].id, {message:"download", toDownload: toDownload},
					function(response) {
						// and close the window upon a response
    					if (response.message === "close_popup") {
    						window.close();
    					}
					}
				);
    		});
    	}, 500);
    });

});


// addCheckbox dynamically creates a checkbox
// parent: element to insert checkbox as a child of
// type: "image" or "doc"
// link: full url to the resource
// name: name of the resource (i.e. 'example.pdf')
function addCheckbox(parent, type, link, name) {
	// checkbox
	var cb = document.createElement("input");
	cb.type = "checkbox";
	cb.name = type;
	cb.value = link;
	cb.id = link;
	cb.addEventListener('change', function() {
		updateSelectAll(cb.name);
	});

	// label
	var label = document.createElement("label");
	label.htmlFor = link;
	label.appendChild(document.createTextNode(name));

	parent.appendChild(cb);
	parent.appendChild(label);
	parent.appendChild(document.createElement("br"));
}

// Toggle "Select/De-select All"
function toggleAll(element) {
	for(var i = 0; i < inputs.length; i++) {
    	if (element.id === img_sel_id && inputs[i].name === img_col_id) {
    		inputs[i].checked = element.checked;
    	}
    	if (element.id === doc_sel_id && inputs[i].name === doc_col_id) {
    		inputs[i].checked = element.checked;
    	}
    }
}

// Update "Select/De-select All" options if something has changed
function updateSelectAll(type) {
	var checked = true;
	var selectElement = (type === img_col_id) ? img_select_all : doc_select_all;
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].name === type) {
			checked = checked && inputs[i].checked;
		}
	}
	selectElement.checked = checked;
}