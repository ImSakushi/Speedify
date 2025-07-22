let videoElements = [];


function trackMediaElement(el) {
    if (videoElements.includes(el)) return;
    el.preservesPitch = false;
    el.mozPreservesPitch = false;
    el.webkitPreservesPitch = false;
    el.__speedifySetting = false;
    el.addEventListener('ratechange', () => {
        if (!el.__speedifySetting && window.__SpeedifyCurrentRate) {
            el.__speedifySetting = true;
            el.playbackRate = window.__SpeedifyCurrentRate;
            Promise.resolve().then(() => {
                el.__speedifySetting = false;
            });
        }
    });
    videoElements.push(el);
    if (typeof window.__SpeedifyApplyRate === 'function') {
        window.__SpeedifyApplyRate(window.__SpeedifyCurrentRate || 1);
    }
}

// Collect any audio or video elements that already exist on the page
document.querySelectorAll('audio, video').forEach(trackMediaElement);

window.videoElements = videoElements;

const originalCreateElement = document.constructor.prototype.createElement;

// Intercept creation of new audio/video elements so we can track them
document.createElement = function (message) {
    const element = originalCreateElement.call(document, message);
    if (message === 'video' || message === 'audio') {
        console.log('🎥 Video or audio element created:', element);
        trackMediaElement(element);
        console.log('🎥 Video elements:', videoElements);
    }
    return element;
};

// Observe DOM for new audio/video elements so playback stays consistent
const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1) continue;
            if (node.tagName === 'AUDIO' || node.tagName === 'VIDEO') {
                trackMediaElement(node);
            } else if (node.querySelectorAll) {
                node.querySelectorAll('audio, video').forEach(trackMediaElement);
            }
        }
    }
});

observer.observe(document, { childList: true, subtree: true });