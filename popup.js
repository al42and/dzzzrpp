function setFieldColorCookie(ready) {
    let color = '#ffb2ae';
    if (ready)
        color = '#aeffdb';
    document.getElementById('cookie').style.backgroundColor = color;
    return false;
}

function setCookie() {
    const cookie = document.getElementById('cookie').value;
    console.log("setCookie..." + cookie);
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        let tab = arrayOfTabs[0];
        const tabUrl = tab.url;
        console.log("setting cookie to "+cookie);
        chrome.cookies.set({ url: tabUrl, name: 'dozorSiteSession', value: cookie });
        setFieldColorCookie(true);
        chrome.tabs.reload(tab.id);
    });
}

function getCookie() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        let tab = arrayOfTabs[0];
        const tabUrl = tab.url;
        console.log("url=" + tabUrl);
        chrome.cookies.get({url: tabUrl, name: 'dozorSiteSession'},
            function (cookie) {
                if (cookie) {
                    console.log("cookie=" + cookie.value);
                    document.getElementById('cookie').value = cookie.value;
                    setFieldColorCookie(true);
                }
                else {
                    console.log("no cookie found");
                    document.getElementById('cookie').value = '<none>';
                    setFieldColorCookie(false);
                }
            });
    });
}


function onLoad() {
    document.getElementById('cookie').oninput = function() {
        setFieldColorCookie(false);
    };
    document.getElementById('cookie_form').onsubmit = function() {
        setCookie();
    };
    getCookie();
}

window.onload = onLoad;