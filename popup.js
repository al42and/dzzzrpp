function setFieldColorCookie(ready) {
    let color = '#ffb2ae';
    if (ready)
        color = '#aeffdb';
    document.getElementById('cookie').style.backgroundColor = color;
    return false;
}

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
    document.getElementById('cookie').oninput = function() {
        setFieldColorCookie(false);
    };
    document.getElementById('cookie').onclick = function() {
        this.select();
    };
    document.getElementById('cookie_form').onsubmit = function() {
        setCookie();
    };
    //chrome.cookies.onChanged.addListener(getCookie);
    getCookie();
}

window.onload = onLoad;