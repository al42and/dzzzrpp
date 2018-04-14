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
    // Cut everything before the first line break
    let strClean = str.split('<br>')[0].split('найдено кодов')[0];
    // Manually handle some special cases
    const magicStrings = ['Статистика вашей команды по состоянию на'];
    for (let i = 0, l = magicStrings.length; i < l; i++) {
        if (strClean.startsWith(magicStrings[i])) {
            strClean = magicStrings[i];
        }
    }
    // Actually compute the hash
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
    let checkboxes = document.getElementsByClassName('dzzzrpp-show-hide-checkbox');
    for (let i = 0, l = checkboxes.length; i < l; i++) {
        window.sessionStorage.setItem(checkboxes[i].id, checkboxes[i].checked);
    }
}

function restoreShowHideCheckboxStates() {
        let titles = document.getElementsByClassName('title');
        for (let i = 0, l = titles.length; i < l; i++) {
            const id = titleHash(titles[i].textContent);
            const checkboxId = 'dzzzrpp_hide_checkbox' + id;

            titles[i].classList.add('dzzzrpp-show-hide-title');

            let checkbox = document.createElement('input');
            checkbox.setAttribute('id', checkboxId);
            checkbox.setAttribute('type', 'checkbox');
            let data = window.sessionStorage.getItem(checkboxId);
            if (typeof data === 'undefined' || data === null) {
                checkbox.checked = true;
            } else {
                checkbox.checked = (data === 'true');
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
        restoreShowHideCheckboxStates();
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
