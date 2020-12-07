class Oscillator {
    constructor(outDest, vol, freq, range, waveform) {
        this.outDest = outDest;
        this.range = Number(range);
        this.freq = Number(freq);
        this.waveform = (function() {
            if(waveform == 1) {
                return 'sine';
            }
            if(waveform == 2) {
                return 'sawtooth';
            }
            if(waveform == 3) {
                return 'square';
            }
            if(waveform == 4) {
                return 'triangle';
            }
            if(waveform == 5) {
                return 'sawtooth';
            }
            if(waveform == 6) {
                return 'custom';
            }
        })();
        console.log(this.waveform);

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

const oscOneFreq = document.querySelector('[name="osc-one-freq"]');
oscOneFreq.addEventListener('input', event => {
    const value = event.target.value;
    console.log('oscOneFreq = ' + value);
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
let oscOneRange = Math.round(oscOneRangeElem.value);
oscOneRangeElem.addEventListener('input', event => {
    oscOne.range = Math.round(event.target.value);
    console.log('oscOne.range = ' + oscOne.range);
})

const oscOneWaveformElem = document.querySelector('[name="osc-one-waveform"]');
let oscOneWaveform = Math.round(oscOneWaveformElem.value);
oscOneWaveformElem.addEventListener('input', event => {
    const value = Math.round(event.target.value);
    if(value == 1) {
        oscOne.waveform = 'triangle';
    }
    if(value == 2) {
        oscOne.waveform = 'custom';
    }
    if(value == 3) {
        oscOne.waveform = 'sawtooth';
    }
    if(value == 4) {
        oscOne.waveform = 'square';
    }
    if(value == 5) {
        oscOne.waveform = 'custom';
    }
    if(value == 6) {
        oscOne.waveform = 'custom';
    }
    console.log('oscOneWaveform = ' + oscOne.waveform);
})

const oscTwoRangeElem = document.querySelector('[name="osc-two-range"]');
let oscTwoRange = Number(oscTwoRangeElem.value);
oscTwoRangeElem.addEventListener('input', event => {
    oscTwo.range = Math.round(event.target.value);
    console.log('oscTwoRange = ' + oscTwo.range);
})

const oscTwoFreqElem = document.querySelector('[name="osc-two-freq"]');
let oscTwoFreq = Number(oscTwoFreqElem.value);
oscTwoFreqElem.addEventListener('input', event => {
    const value = event.target.value;
    console.log('oscTwoFreq = ' + value);
})

const oscTwoWaveform = document.querySelector('[name="osc-two-waveform"]');
oscTwoWaveform.addEventListener('input', event => {
    const value = Math.round(event.target.value);
    console.log('oscTwoWaveform = ' + value);
})

const oscThreeRange = document.querySelector('[name="osc-three-range"]');
oscThreeRange.addEventListener('input', event => {
    const value = Math.round(event.target.value);
    console.log('oscThreeRange = ' + value);
})

const oscThreeFreq = document.querySelector('[name="osc-three-freq"]');
oscThreeFreq.addEventListener('input', event => {
    const value = event.target.value;
    console.log('oscThreeFreq = ' + value);
})

const oscThreeWaveform = document.querySelector('[name="osc-three-waveform"]');
oscThreeWaveform.addEventListener('input', event => {
    const value = Math.round(event.target.value);
    console.log('oscThreeWaveform = ' + value);
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
    // oscOne.lvl.gain.exponentialRampToValueAtTime(value, now);
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
    // oscTwo.lvl.gain.exponentialRampToValueAtTime(value, now);
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
    // oscThree.lvl.gain.exponentialRampToValueAtTime(value, now);
    console.log('oscThreeVol = ' + value);
})




const oscOneSwitch = document.querySelector('[name="osc-one-switch"]');
oscOneSwitch.addEventListener('input', event => {
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
    console.log('masterVol = ' + value);
    // masterVol.vol = value;
})




//-------------  MASTER SECTION  ----------------

const masterVol = new MasterVolume();
masterVol.lvl.connect(context.destination);




//-------------  OSCILLATORS  -------------------

const oscOne = new Oscillator(masterVol.lvl, oscOneVol.value, oscOneWaveform.value, oscOneRange.value);
const oscTwo = new Oscillator(masterVol.lvl, oscTwoVol.value, oscTwoWaveform.value, oscTwoRange.value);
const oscThree = new Oscillator(masterVol.lvl, oscThreeVol.value, oscThreeWaveform.value, oscThreeRange.value);
// const lfo = new LFO([oscOne.osc.frequency, oscTwo.osc.frequency]);




//--------------  KEYBOARD  --------------------

const keys = document.querySelectorAll('[data-note]');
keys.forEach(key => {
    key.addEventListener('mouseenter', event => {
        const note = event.target.dataset.note;
        const octave = Number(event.target.dataset.octave);
        console.log(oscOne.range + octave);
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