let currentRate = 1;

const box = () => {
    const playbackDurationElement = document.querySelector('[data-testid="playback-duration"]');

    const newDiv = document.createElement('div');
    newDiv.style.display = 'inline-block';

    const style = document.createElement('style');
    style.innerHTML = `
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type=number] {
            -moz-appearance: textfield;
        }
    `;
    document.head.appendChild(style);   
    
    const newInput = document.createElement('input');

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0.1;
    slider.max = 3;
    slider.step = 0.1;
    slider.value = 1;

    slider.style.width = '100px';
    slider.style.marginLeft = '10px';

    newInput.type = 'number';
    newInput.placeholder = 'speed';
    newInput.value = 1;
    newInput.min = 0.1;
    newInput.max = 16;
    newInput.step = 0.1;

    newInput.style.padding = '5px';
    newInput.style.border = '2px solid rgba(31, 31, 31, 0.39)';
    newInput.style.borderRadius = '5px';
    newInput.style.fontSize = '10px';
    newInput.style.width = '55px';
    newInput.style.backgroundColor = 'rgba(31, 31, 31, 0.39)';
    newInput.style.color = 'white';
    newInput.style.textAlign = 'center';
    newInput.style.outline = 'none';
    newInput.style.transition = 'border-color 0.3s ease';

    newInput.addEventListener('focus', () => {
        newInput.style.borderColor = '#e74c3c';  
    });

    newInput.addEventListener('blur', () => {
        newInput.style.borderColor = 'rgba(31, 31, 31, 0.39)';
    });

    const applyRate = (rate) => {
        currentRate = rate;
        window.__SpeedifyCurrentRate = rate;
        window.__SpeedifyApplyRate = applyRate;
        videoElements.forEach(video => {
            video.preservesPitch = false;
            video.mozPreservesPitch = false;
            video.webkitPreservesPitch = false;
            if (video.playbackRate !== rate) {
                video.playbackRate = rate;
            }
        });
        console.log(`Playback rate set to: ${rate}`);
    };


    newInput.addEventListener('input', () => {
        const newRate = parseFloat(newInput.value);
        slider.value = newInput.value;
        if (!isNaN(newRate) && newRate >= newInput.min && newRate <= newInput.max) {
            applyRate(newRate);
        } else if (newRate < newInput.min) {
            newInput.value = newInput.min;
            slider.value = newInput.min;
            applyRate(newInput.min);
            alert('The value is too small.');
        } else if (newRate > newInput.max) {
            newInput.value = newInput.max;
            slider.value = newInput.max;
            applyRate(newInput.max);
            alert('The value is too large.');
        }
    });

    slider.addEventListener('input', () => {
        newInput.value = slider.value;
        applyRate(parseFloat(slider.value));
    });

    newDiv.appendChild(newInput);
    newDiv.appendChild(slider);

    if (playbackDurationElement) {
        playbackDurationElement.insertAdjacentElement('afterend', newDiv);
    } else {
        console.error('playback-duration div not found');
    }
}

setTimeout(() => {
    box();
}, 3000);