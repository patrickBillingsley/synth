class Oscillator {
    constructor(outDest, vol, freq, range, position) {
        this.outDest = outDest;
        this.range = Number(range);
        this.freq = Number(freq);
        this.waveform = selectWaveform(position);

        this.osc = context.createOscillator();
        this.osc.type = this.waveform;
        this.lvl = context.createGain();
        this.lvl.gain.setValueAtTime(vol, now);
        this.osc.connect(this.lvl);
        this.lvl.connect(outDest);
        this.osc.start();
    }
    play(freq) {
        this.osc.frequency.cancelScheduledValues(now);
        this.osc.frequency.linearRampToValueAtTime(freq, now);
    }
    updateWaveform(waveform) {
        this.osc.type = waveform;
    }
}
class MasterVolume {
    constructor() {
        this.lvl = context.createGain();
        this.lvl.gain.value = 0;
        this.vol = masterVolElem.value / 5;
    }
    play() {
        if(this.lvl.gain.value) {
            this.lvl.gain.setValueAtTime(this.lvl.gain.value, context.currentTime);
            this.lvl.gain.cancelScheduledValues(context.currentTime + 0.001);
        } else {
            this.lvl.gain.setValueAtTime(0.001, context.currentTime);
        }
        this.lvl.gain.exponentialRampToValueAtTime(this.vol, context.currentTime + loudnessAttack);
    }
    stop() {
        if(this.lvl.gain.value) {
            this.lvl.gain.setValueAtTime(this.lvl.gain.value, context.currentTime);
            this.lvl.gain.cancelScheduledValues(context.currentTime + 0.001);
            this.lvl.gain.exponentialRampToValueAtTime(0.001, context.currentTime + loudnessDecay);
            this.lvl.gain.setValueAtTime(0, context.currentTime + loudnessDecay);
        }
    }
}
class LFO {
    constructor(outputDest) {
        this.osc = context.createOscillator();
        this.osc.frequency.value = 20;
        this.lvl = context.createGain();
        // this.lvl.gain.value = modWheel.value;

        this.osc.connect(this.lvl);
        
        outputDest.forEach(destination => {
            this.lvl.connect(destination);
        })

        this.osc.start();
    }
}




const context = new (window.AudioContext || window.webkitAudioContext)();
const now = context.currentTime;



const ranges = []

fundamentalOctave = { A: 440.00, Bb: 466.16, B: 493.88, C: 523.25, Db: 554.37, D: 587.33, Eb: 622.25, E: 659.25, F: 698.46, Gb: 739.99, G: 783.99, Ab: 830.61 };

ranges.unshift(doubleFrequencies(fundamentalOctave));
ranges.unshift(fundamentalOctave);
ranges.unshift(halfFrequencies(fundamentalOctave));
ranges.unshift(halfFrequencies(ranges[0]));
ranges.unshift(halfFrequencies(ranges[0]));
ranges.unshift(halfFrequencies(ranges[0]));
ranges.unshift(halfFrequencies(ranges[0]));



//------------  CONTROLLERS --------------

const oscOneFreqElem = document.querySelector('[name="osc-one-freq"]');
let oscOneFreq = Number(oscOneFreqElem.value);
oscOneFreqElem.addEventListener('input', event => {
    oscOne.freq = oscOneFreq;
    console.log('oscOne.freq = ' + oscOne.freq);
})

const glide = document.querySelector('[name="glide"]');
glide.addEventListener('input', event => {
    const value = event.target.value;
    console.log('glide = ' + value);
})

const modMix = document.querySelector('[name="mod-mix"]');
modMix.addEventListener('input', event => {
    const value = event.target.value;
    console.log('modMix = ' + value);
})

const oscFilterSwitch = document.querySelector('[name="osc-filter-switch"]');
oscFilterSwitch.addEventListener('input', event => {
    const value = event.target.value;
    console.log('oscFilterSwitch = ' + value);
})

const noiseLfoSwitch = document.querySelector('[name="noise-lfo-switch"]');
noiseLfoSwitch.addEventListener('input', event => {
    const value = event.target.value;
    console.log('noiseLfoSwitch = ' + value);
})




//------------ OSCILLATOR BANK ------------

const oscOneRangeElem = document.querySelector('[name="osc-one-range"]');
let oscOneRange = Number(oscOneRangeElem.value);
oscOneRangeElem.addEventListener('input', event => {
    oscOne.range = Number(event.target.value);
    console.log('oscOne.range = ' + oscOne.range);
})

const oscOneWaveformElem = document.querySelector('[name="osc-one-waveform"]');
let oscOneWaveform = Number(oscOneWaveformElem.value);
oscOneWaveformElem.addEventListener('input', event => {
    const value = event.target.value;
    oscOne.waveform = selectWaveform(value);
    console.log('oscOne.waveform = ' + oscOne.waveform);
})

const oscTwoRangeElem = document.querySelector('[name="osc-two-range"]');
let oscTwoRange = Number(oscTwoRangeElem.value);
oscTwoRangeElem.addEventListener('input', event => {
    oscTwo.range = Number(event.target.value);
    console.log('oscTwo.range = ' + oscTwo.range);
})

const oscTwoFreqElem = document.querySelector('[name="osc-two-freq"]');
let oscTwoFreq = Number(oscTwoFreqElem.value);
oscTwoFreqElem.addEventListener('input', event => {
    oscTwo.freq = event.target.value;
    console.log('oscTwo.freq = ' + oscTwo.freq);
})

const oscTwoWaveformElem = document.querySelector('[name="osc-two-waveform"]');
let oscTwoWaveform = Number(oscOneWaveformElem.value);
oscTwoWaveformElem.addEventListener('input', event => {
    const value = event.target.value;
    oscTwo.waveform = selectWaveform(value);
    console.log('oscTwo.waveform = ' + oscTwo.waveform);
})

const oscThreeRangeElem = document.querySelector('[name="osc-three-range"]');
let oscThreeRange = Number(oscThreeRangeElem.value);
oscThreeRangeElem.addEventListener('input', event => {
    oscThree.range = Number(event.target.value);
    console.log('oscThree.range = ' + oscThree.range);
})

const oscThreeFreqElem = document.querySelector('[name="osc-three-freq"]');
let oscThreeFreq = Number(oscThreeFreqElem.value);
oscThreeFreqElem.addEventListener('input', event => {
    oscThree.freq = event.target.value;
    console.log('oscThree.freq = ' + oscThree.freq);
})

const oscThreeWaveformElem = document.querySelector('[name="osc-three-waveform"]');
let oscThreeWaveform = Number(oscThreeWaveformElem.value);
oscThreeWaveformElem.addEventListener('input', event => {
    const value = Number(event.target.value);
    oscThree.waveform = selectWaveform(value);
    console.log('oscThree.waveform = ' + oscThree.waveform);
})

const oscModSwitch = document.querySelector('[name="osc-mod-switch"]');
oscModSwitch.addEventListener('input', event => {
    const value = event.target.value;
    console.log('oscModSwitch = ' + value);
})

const oscThreeControlSwitch = document.querySelector('[name="osc-three-control-switch"]');
oscThreeControlSwitch.addEventListener('input', event => {
    const value = event.target.value;
    console.log('oscThreeControlSwitch = ' + value);
})




//------------  MIXER  ---------------

const oscOneVol = document.querySelector('[name="osc-one-vol"]');
oscOneVol.addEventListener('input', event => {
    const value = event.target.value;
    oscOne.lvl.gain.exponentialRampToValueAtTime(value, now);
    console.log('oscOneVol = ' + value);
})

const extInputVol = document.querySelector('[name="ext-input-vol"]');
extInputVol.addEventListener('input', event => {
    const value = event.target.value;
    console.log('extInputVol = ' + value);
})

const oscTwoVol = document.querySelector('[name="osc-two-vol"]');
oscTwoVol.addEventListener('input', event => {
    const value = event.target.value;
    oscTwo.lvl.gain.exponentialRampToValueAtTime(value, now);
    console.log('oscTwoVol = ' + value);
})

const noiseVol = document.querySelector('[name="noise-vol"]');
noiseVol.addEventListener('input', event => {
    const value = event.target.value;
    console.log('noiseVol = ' + value);
})

const oscThreeVol = document.querySelector('[name="osc-three-vol"]');
oscThreeVol.addEventListener('input', event => {
    const value = event.target.value;
    oscThree.lvl.gain.exponentialRampToValueAtTime(value, now);
    console.log('oscThreeVol = ' + value);
})


const oscOneSwitch = {
    elem: document.querySelector('[name="osc-one-switch"]'),
    value: setValue(this.elem),
};

// const oscOneSwitch = document.querySelector('[name="osc-one-switch"]');
oscOneSwitch.elem.addEventListener('input', event => {
    const value = event.target.value;
    console.log('oscOneSwitch = ' + value);
})

const extInputSwitch = document.querySelector('[name="ext-input-switch"]');
extInputSwitch.addEventListener('input', event => {
    const value = event.target.value;
    console.log('extInputSwitch = ' + value);
})

const oscTwoSwitch = document.querySelector('[name="osc-two-switch"]');
oscTwoSwitch.addEventListener('input', event => {
    const value = event.target.value;
    console.log('oscTwoSwitch = ' + value);
})

const noiseSwitch = document.querySelector('[name="noise-switch"]');
noiseSwitch.addEventListener('input', event => {
    const value = event.target.value;
    console.log('noiseSwitch = ' + value);
})

const oscThreeSwitch = document.querySelector('[name="osc-three-switch"]');
oscThreeSwitch.addEventListener('input', event => {
    const value = event.target.value;
    console.log('oscThreeSwitch = ' + value);
})

const whitePinkSwitch = document.querySelector('[name="white-pink-switch"]');
whitePinkSwitch.addEventListener('input', event => {
    const value = event.target.value;
    console.log('whitePinkSwitch = ' + value);
})



//---------------  FILTER ----------------

const cutoffFreq = document.querySelector('[name="cutoff-freq"]');
cutoffFreq.addEventListener('input', event => {
    const value = event.target.value;
    console.log('cutoffFreq = ' + value);
})

const emphasis = document.querySelector('[name="emphasis"]');
emphasis.addEventListener('input', event => {
    const value = event.target.value;
    console.log('emphasis = ' + value);
})

const contour = document.querySelector('[name="contour"]');
contour.addEventListener('input', event => {
    const value = event.target.value;
    console.log('contour = ' + value);
})

const filterAttack = document.querySelector('[name="filter-attack"]');
filterAttack.addEventListener('input', event => {
    const value = event.target.value;
    console.log('filterAttack = ' + value);
})

const filterDecay = document.querySelector('[name="filter-decay"]');
filterDecay.addEventListener('input', event => {
    const value = event.target.value;
    console.log('filterDecay = ' + value);
})

const filterSustain = document.querySelector('[name="filter-sustain"]');
filterSustain.addEventListener('input', event => {
    const value = event.target.value;
    console.log('filterSustain = ' + value);
})



//---------------  LOUDNESS CONTOUR -------------

const loudnessAttackElem = document.querySelector('[name="loudness-attack"]');
let loudnessAttack = Number(loudnessAttackElem.value);
loudnessAttackElem.addEventListener('input', event => {
    const value = Number(event.target.value);
    loudnessAttack = value;
    console.log('loudnessAttack = ' + loudnessAttack);
})

const loudnessDecayElem = document.querySelector('[name="loudness-decay"]');
let loudnessDecay = Number(loudnessDecayElem.value);
loudnessDecayElem.addEventListener('input', event => {
    const value = Number(event.target.value);
    loudnessDecay = value;
    console.log('loudnessDecay = ' + loudnessDecay);
})

const loudnessSustainElem = document.querySelector('[name="loudness-sustain"]');
let loudnessSustain = Number(loudnessSustainElem.value);
loudnessSustainElem.addEventListener('input', event => {
    const value = event.target.value;
    console.log('loudnessSustain = ' + loudnessSustain);
})



//----------------  OUTPUT  ----------------

const masterVolElem = document.querySelector('[name="output-vol"]');
masterVolElem.addEventListener('input', event => {
    const value = event.target.value / 5;
    masterVol.vol = value;
    console.log('masterVol.vol = ' + masterVol.vol);
})




//-------------  MASTER SECTION  ----------------

const masterVol = new MasterVolume();
masterVol.lvl.connect(context.destination);




//-------------  OSCILLATORS  -------------------

const oscOne = new Oscillator(masterVol.lvl, oscOneVol.value, oscOneFreq.value, oscOneRange.value, oscOneWaveform.value);
const oscTwo = new Oscillator(masterVol.lvl, oscTwoVol.value, oscTwoFreq.value, oscTwoRange.value, oscTwoWaveform.value);
const oscThree = new Oscillator(masterVol.lvl, oscThreeVol.value, oscThreeFreq.value, oscThreeRange.value, oscThreeWaveform.value);
// const lfo = new LFO([oscOne.osc.frequency, oscTwo.osc.frequency]);




//--------------  KEYBOARD  --------------------

const keys = document.querySelectorAll('[data-note]');
keys.forEach(key => {
    key.addEventListener('mouseenter', event => {
        const note = event.target.dataset.note;
        const octave = Number(event.target.dataset.octave);
        Object.entries(ranges[oscOne.range + octave]).forEach(arr => {
            if(arr.includes(note)) {
                const freq = arr[1];
                oscOne.play(freq);
            }
        })
        Object.entries(ranges[oscTwo.range + octave]).forEach(arr => {
            if(arr.includes(note)) {
                const freq = arr[1];
                oscTwo.play(freq);
            }
        })
        Object.entries(ranges[oscThree.range + octave]).forEach(arr => {
            if(arr.includes(note)) {
                const freq = arr[1];
                oscThree.play(freq);
            }
        })
        masterVol.play();
    })
    key.addEventListener('mouseout', () => {
        masterVol.stop();
    })
})




function doubleFrequencies(freqObj) {
    const keysArray = Object.keys(freqObj);
    const newFreqArray = Object.values(freqObj)
        .map(x => Number((x*2)
        .toFixed(2)));
    return toObject(keysArray, newFreqArray);
}
function halfFrequencies(freqObj) {
    const keysArray = Object.keys(freqObj);
    const newFreqArray = Object.values(freqObj)
        .map(x => Number((x/2)
        .toFixed(2)));
    return toObject(keysArray, newFreqArray);
}
function toObject(keys, values) {
    const newObj = {};
    for(let i = 0; i < keys.length; i++) {
        newObj[keys[i]] = values[i];
    }
    return newObj;
}
function selectWaveform(position) {
    if(position == 1) {
        return 'triangle';
    }
    if(position == 2) {
        return 'sawtooth';
    }
    if(position == 3) {
        return 'square';
    }
    if(position == 4) {
        return 'sine';
    }
    if(position == 5) {
        return 'sawtooth';
    }
    if(position == 6) {
        return 'custom';
    }
}
function setValue(elem) {
    console.log(elem);
}




(function setup() {
    let waveformValue;

    oscOne.range = Number(oscOneRangeElem.value);
    oscOne.freq = Number(oscOneFreqElem.value);
    waveformValue = Number(document.querySelector('[name="osc-one-range"]').value);
    oscOne.waveform = selectWaveform(waveformValue);
    oscOne.vol = Number(oscOneVol.value);
    
    oscTwo.range = Number(oscTwoRangeElem.value);
    oscTwo.freq = Number(oscTwoFreqElem.value)
    waveformValue = Number(document.querySelector('[name="osc-two-range"]').value);
    oscTwo.waveform = selectWaveform(waveformValue);
    oscTwo.vol = Number(oscTwoVol.value);
    
    oscThree.range = Number(oscThreeRangeElem.value);
    oscThree.freq = Number(oscThreeFreqElem.value)
    waveformValue = Number(document.querySelector('[name="osc-three-range"]').value);
    oscThree.waveform = selectWaveform(waveformValue);
    oscThree.vol = Number(oscThreeVol.value);

    masterVol.vol = Number(masterVolElem.value);
})();












//------------Oscilloscope
// const canvasElement = document.querySelector('canvas');
// const canvas = canvasElement.getContext('2d');

// function sizeCanvas(width, height) {
//     canvasElement.width = width / 3;
//     canvasElement.height = height / 10;
// }

// window.addEventListener('resize', sizeCanvas(window.innerWidth, window.innerHeight));

// const oscilloscope = context.createAnalyser();
// masterVol.lvl.connect(oscilloscope);
// oscilloscope.fftSize = 2048;
// const bufferLength = oscilloscope.frequencyBinCount;
// const dataArray = new Uint8Array(bufferLength);

// canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);

// function draw() {
//     const drawVisual = requestAnimationFrame(draw);
//     oscilloscope.getByteTimeDomainData(dataArray);
//     canvas.fillStyle = 'rgb(200, 200, 200)';
//     canvas.fillRect(0, 0, canvasElement.width, canvasElement.height);
//     canvas.lineWidth = 2;
//     canvas.strokeStyle = 'rgb(0, 0, 0)';
//     canvas.beginPath();
    
//     const sliceWidth = canvasElement.width * 1.0 / bufferLength;
//     let x = 0;
    
//     for(i=0; i<bufferLength; i++) {
//         const v = dataArray[i] / 128.0;
//         const y = v * canvasElement.height / 2;
        
//         if(i === 0) {
//             canvas.moveTo(x, y);
//         } else {
//             canvas.lineTo(x, y);
//         }
//         x += sliceWidth
//     }
    
//     canvas.lineTo(canvasElement.width, canvasElement.height);
//     canvas.stroke();
// };

// draw();






//-------------Knobs

window.inputKnobsOptions = { knobDiameter: '100' };