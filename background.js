var host = "https://zoom.us/wc/join/";

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
         const match = /https:\/\/zoom\.us\/j\/(.*)/.exec(details.url)
         return {redirectUrl: host + match[1]};
    },
    {
        urls: [
            "*://zoom.us/j/*",
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);