/**
 * Event handler to change cookie field color when it is being edited.
 */
function setFieldColorCookie(ready) {
    let color = '#ffb2ae';
    if (ready)
        color = '#aeffdb';
    document.getElementById('cookie').style.backgroundColor = color;
    return false;
}

/**
 * Set session cookie for current page based on the text field.
 */
function setCookie() {
    const cookie = document.getElementById('cookie').value;
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        let tab = arrayOfTabs[0];
        const tabUrl = tab.url;
        console.log("setting cookie to "+cookie);
        chrome.cookies.set({ url: tabUrl, name: 'dozorSiteSession', domain: '.dzzzr.ru', path: '/', value: cookie });
        setFieldColorCookie(true);
        chrome.tabs.reload(tab.id);
    });
}

/**
 * Fill the text field with current session cookie.
 */
function getCookie() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        let tab = arrayOfTabs[0];
        const tabUrl = tab.url;
        chrome.cookies.get({url: tabUrl, name: 'dozorSiteSession'},
            function (cookie) {
                if (cookie) {
                    document.getElementById('cookie').value = cookie.value;
                    setFieldColorCookie(true);
                }
                else {
                    document.getElementById('cookie').value = '<none>';
                    setFieldColorCookie(false);
                }
            });
    });
}


function onLoad() {
    // Set up cookie editor
    document.getElementById('cookie').oninput = function() {
        setFieldColorCookie(false);
    };
    document.getElementById('cookie').onclick = function() {
        this.select();
    };
    document.getElementById('cookieForm').onsubmit = function() {
        setCookie();
    };
    getCookie();

    // Set up setting for show/hide checkboxes
    chrome.storage.sync.get(['enabledShowHideCheckbox'], function(items) {
        let enabled = items.enabledShowHideCheckbox;
        if (typeof enabled === 'undefined') {
            enabled = true;
        }
        document.getElementById('enabledShowHideCheckbox').checked = enabled;
    });
    document.getElementById('enabledShowHideCheckbox').onchange = function() {
        chrome.storage.sync.set({ 'enabledShowHideCheckbox': this.checked });
        if (! this.checked) {
            chrome.runtime.sendMessage({type: 'resetShowHideCheckboxState'});
        }
    };
}


window.onload = onLoad;