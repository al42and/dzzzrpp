'use strict';

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

/**
 * Save setting value to chrome storage and reload current tab.
 */
function saveSettingAndReload(settingId, value) {
    chrome.storage.sync.set({ [settingId]: value });
    // Reload page
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        let tab = arrayOfTabs[0];
        chrome.tabs.reload(tab.id);});
}


/**
 * Attach callbacks to the checkbox that controls this extension's settings.
 */
function addSettingCheckboxHandler(settingId, handler, defaultValue = false) {
    chrome.storage.sync.get([settingId], function(items) {
        let enabled = items[settingId];
        if (typeof enabled === 'undefined') {
            enabled = defaultValue;
        }
        document.getElementById(settingId).checked = enabled;
    });
    document.getElementById(settingId).onchange = handler;
}


function onLoad() {
    // Set up cookie editor
    document.getElementById('cookie').oninput = function() {
        setFieldColorCookie(false);
    };
    document.getElementById('cookie').onclick = function() {
        this.select();
    };
    document.getElementById('cookieForm').onsubmit = setCookie;
    getCookie();

    // Set up setting for show/hide checkboxes
    addSettingCheckboxHandler('enabledShowHideCheckbox', function () {
        saveSettingAndReload('enabledShowHideCheckbox', this.checked);
    });
    // Set up setting for log reversing
    addSettingCheckboxHandler('enabledLogReversing', function () {
        saveSettingAndReload('enabledLogReversing', this.checked);
    });

    // Set version
    const manifestData = chrome.runtime.getManifest();
    document.getElementById('version').innerText = manifestData.version;
}

window.onload = onLoad;
