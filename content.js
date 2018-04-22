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
 * We use magic preprocessing to make it make more sense.
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
 * Save the states of the checkbox to the session storage.
 */
function saveShowHideCheckboxStates() {
    let checkboxes = document.getElementsByClassName('dzzzrpp-show-hide-checkbox');
    for (let i = 0, l = checkboxes.length; i < l; i++) {
        window.sessionStorage.setItem(checkboxes[i].id, checkboxes[i].checked);
    }
}

/**
 * Create checkboxes and try to restore their state from session storage.
 */
function restoreShowHideCheckboxStates() {
        let titles = document.getElementsByClassName('title');
        const logHash = titleHash('Лог игры');
        for (let i = 0, l = titles.length; i < l; i++) {
            const id = titleHash(titles[i].textContent);
            const checkboxId = 'dzzzrpp_hide_checkbox' + id;

            titles[i].classList.add('dzzzrpp-show-hide-title');

            let checkbox = document.createElement('input');
            checkbox.setAttribute('id', checkboxId);
            checkbox.setAttribute('type', 'checkbox');

            const data = window.sessionStorage.getItem(checkboxId);
            if (typeof data === 'undefined' || data === null) {
                if (id === logHash) { // By default, hide full log
                    checkbox.checked = false;
                } else {
                    checkbox.checked = true;
                }
            } else {
                checkbox.checked = (data === 'true');
            }
            checkbox.className = 'dzzzrpp-show-hide-checkbox';
            checkbox.onchange = function () {
                saveShowHideCheckboxStates();
            };

            insertBefore(checkbox, titles[i])
        }
}

/**
 * Changes the order of the global game log entries
 */
function reverseLog() {
    const header_cell = document.querySelector("table tbody tr th img[src='/images/s_desc.png'] + a");
    if (header_cell) {
        let table = header_cell.parentNode.parentNode.parentNode.parentNode;
        let rows = table.rows;
        // Starting from row 1 to keep header in place
        for (let i = 1, l = rows.length; i < l; i++) {
            rows[i].parentNode.insertBefore(rows[l-1], rows[i]);
        }
    }
}


chrome.storage.sync.get(['enabledShowHideCheckbox', 'enabledLogReversing'], function(items) {
    if (items['enabledShowHideCheckbox']) {
        restoreShowHideCheckboxStates();
    }
    if (items['enabledLogReversing']) {
        reverseLog();
    }
});


/**
 * TODO:
 * * Table for KO instead of comma separated list
 * * Highlight the images with embedded GPS coordinates
 * * Highlight images with link pointing to different image
 * * Find html comments
 * * Remove 0 minute bonus/penalty in statistics
 * * Get proper tracker for TODO/issues
 * * Add hints to settings popup
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
