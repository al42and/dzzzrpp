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
 * Add tooltips for KOs with their numbers
 */
function hasNonWhitespace(str) {
    return !!str.replace(/\s/g, '').length
}
function formatKOHint(item, index) {
    const metka = index + 1;
    const ret = `<span title="Метка ${metka}" class="underdot">${item.trim().replace(',','')}</span>`;
    console.log(`${item} (${metka}) : ${ret}`);
    return ret;
}
function elemToHTML(e) {
    let wrap = document.createElement('div');
    wrap.append(e.cloneNode(true));
    console.log('e2h: ' + wrap.innerHTML);
    return wrap.innerHTML;
}
function replaceTextNodeWithHTML(node, html) {
    let newNode = document.createElement('span');
    newNode.innerHTML = html;
    node.parentNode.insertBefore(newNode, node);
    node.parentNode.removeChild(node);
    return newNode;
}
function addKOHints() {
    const strongs = document.getElementsByTagName('strong');
    for (let i = 0, l = strongs.length; i < l; i++) {
        if (strongs[i].innerText === 'Коды сложности') {
            let headNode = strongs[i].nextSibling;
            while (headNode) {
                if (headNode.nodeType === Node.TEXT_NODE && hasNonWhitespace(headNode.textContent)) {
                    let tokens = headNode.textContent.split(':');
                    if (tokens.length >= 2) {
                        if (tokens[0].trim() !== 'Найдено кодов') {
                            let kos = tokens.pop().split(','); /* Array of (possibly HTML) strings representing KOs */
                            const levelName = tokens.join(':'); /* We might have several ":" in level name */
                            let nextNode = headNode.nextSibling;
                            while (nextNode && nextNode.tagName !== 'BR') { /* Read until end of displayed line */
                                let currentNode = nextNode;
                                if (currentNode.tagName === 'SPAN') {
                                    kos.push(elemToHTML(currentNode));
                                } else {
                                    kos = kos.concat(currentNode.textContent.split(','));
                                }
                                nextNode = currentNode.nextSibling;
                                currentNode.parentNode.removeChild(currentNode);
                            }
                            let kosNew = kos.filter(hasNonWhitespace).map(formatKOHint);
                            headNode = replaceTextNodeWithHTML(headNode, `${levelName}: ${kosNew.join(', ')}`);
                        }

                    }
                }
                headNode = headNode.nextSibling;
            }
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
 * * Highlight the images with embedded GPS coordinates
 * * Highlight images with link pointing to different image
 * * Find html comments
 * * Remove 0 minute bonus/penalty in statistics
 * * Change timer color
 * * Get proper tracker for TODO/issues
 */
