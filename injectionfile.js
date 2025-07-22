let videoElements = [];

// Collect any audio or video elements that already exist on the page
document.querySelectorAll('audio, video').forEach(el => {
    el.preservesPitch = false;
    el.mozPreservesPitch = false;
    el.webkitPreservesPitch = false;
    videoElements.push(el);
});

const originalCreateElement = document.constructor.prototype.createElement;

// Intercept creation of new audio/video elements so we can track them
document.createElement = function (message) {
    const element = originalCreateElement.call(document, message);
    if (message === 'video' || message === 'audio') {
        console.log('🎥 Video or audio element created:', element);
        element.preservesPitch = false;
        element.mozPreservesPitch = false;
        element.webkitPreservesPitch = false;
        videoElements.push(element);
        console.log('🎥 Video elements:', videoElements);
    }
    return element;
};