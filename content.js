'use strict';

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

/**
 * Table for KO instead of list
 */
function addKOHints() {
    let strongs = document.getElementsByTagName('strong');
    for (let i = 0, l = titles.length; i < l; i++) {
        if (strongs[i].text === 'Коды сложности') {
            //...
        }
    }
}


chrome.storage.sync.get(['enabledKOHints', 'enabledLogReversing'], function(items) {
    if (items['enabledKOHints']) {
        addKOHints();
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
 */
