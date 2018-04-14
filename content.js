'use strict';

/**
 * Hide blocks
 */

/**
 * Insert \p newNode before \p referenceNode in DOM.
 */
function insertBefore(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

/**
 * Calculate 32bit hash of the block title \p str. Used for identifying blocks to hide based on their title string.
 * We drop everything after first <br> to ignore changes in the number of found codes.
 * The hash function os supposedly Java-compatible, but who cares.
 */
function titleHash(str){
    let strClean = str.split('<br>')[0];
    let hash = 0;
    if (strClean.length === 0) return hash;
    for (let i = 0; i < strClean.length; i++) {
        let char = strClean.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/**
 * Send the states of the checkbox to the background tab
 */
function sendShowHideCheckboxStates() {
    let savedShowHideCheckboxStates = { };
    let checkboxes = document.getElementsByClassName('dzzzrpp-show-hide-checkbox');
    for (let i = 0, l = checkboxes.length; i < l; i++) {
        savedShowHideCheckboxStates[checkboxes[i].id] = checkboxes[i].checked;
    }
    chrome.runtime.sendMessage({type: 'setShowHideCheckboxState', data: savedShowHideCheckboxStates});
}

function restoreShowHideCheckboxStates(savedShowHideCheckboxStates) {
        let titles = document.getElementsByClassName('title');
        for (let i = 0, l = titles.length; i < l; i++) {
            const id = titleHash(titles[i].textContent);
            const checkboxId = 'dzzzrpp_hide_checkbox' + id;

            titles[i].classList.add('dzzzrpp-show-hide-title');

            let checkbox = document.createElement('input');
            checkbox.setAttribute('id', checkboxId);
            checkbox.setAttribute('type', 'checkbox');
            if (typeof savedShowHideCheckboxStates[checkboxId] === 'undefined') {
                checkbox.checked = true;
            } else {
                checkbox.checked = savedShowHideCheckboxStates[checkboxId];
            }
            checkbox.className = 'dzzzrpp-show-hide-checkbox';
            checkbox.onchange = function () {
                sendShowHideCheckboxStates();
            };

            insertBefore(checkbox, titles[i])
        }
}

chrome.storage.sync.get(['enabledShowHideCheckbox'], function(items) {
    if (items['enabledShowHideCheckbox']) {
        // We may have different settings for different tabs, and tab.id is persistent until the browser restart.
        // So we use global variable in the background page instead of chrome.storage.local or something.
        chrome.runtime.sendMessage({type: 'getShowHideCheckboxState'}, function (response) {
            restoreShowHideCheckboxStates(response.data);
        });
    }
});


/**
 * TODO:
 * * Reverse the order of the log
 * * Table for KO instead of comma separated list
 * * Highlight the images with embedded GPS coordinates
 * * Find html comments
 */


/**
 * Table for KO instead of list
 */
/*
let strongs = document.getElementsByTagName('strong');
for (let i = 0, l = titles.length; i < l; i++) {
    if (strongs[i].text === 'Коды сложности') {
        //...
    }
}
*/
