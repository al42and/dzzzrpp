// Use example from Chromium to control when extension button is clickable
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'classic.dzzzr.ru' },
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'online.dzzzr.ru' },
                })
            ],
            // And shows the extension's page action.
            actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }]);
    });
});


/* We want to store settings per tab, and the lifetime of tabId is the lifetime of tabId is until the browser restart.
So, we can not use local storage, as it would outlive the tab. So, we store data in the global variable
 */
var showHideCheckboxState = { };

// Listener to answer requests from content scripts. Only checkbox data so far.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (sender.tab) {
            const tabId = sender.tab.id;
            if (request.type === 'setShowHideCheckboxState') {
                showHideCheckboxState[tabId] = request.data;
            } else if (request.type === 'getShowHideCheckboxState') {
                const data = showHideCheckboxState[tabId] || { };
                sendResponse({ type: 'setShowHideCheckboxState', data: data });
            }
        }
        if (request.type === 'resetShowHideCheckboxState') {
            showHideCheckboxState = { };
        }
    });
