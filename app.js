// class Oscillator {
//     constructor(context) {
//         this.context = context;
//         this.now = this.context.currentTime;
//         this.oscillator = this.context.createOscillator();
//         this.setRange(range);
//     }
//     init() {
//         this.gainNode.gain.value = 0.25;
//         this.oscillator.connect(this.gainNode);
//         this.oscillator.start();
//     }
//     play(frequency) {
//         this.oscillator.frequency.exponentialRampToValueAtTime(frequency, this.now);
//         this.gainNode.connect(this.context.destination);
//     }
//     stop() {
//         this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.now + 1);
//         this.gainNode.disconnect(this.context.destination);
//         this.gainNode.gain.setValueAtTime(this.volume, this.now + 1.1);
//     }
//     setRange(range) {
//         this.range = range;
//     }
// }
// class Lfo extends Oscillator {
//     constructor(context, now) {
//         super(context, now);
//         this.oscillator.frequency.value = 5;
//     }
// }
// class Vibrato extends Lfo {
//     constructor(context, now, osc) {
//         super(context, now);
//         this.gainNode.gain.value = 20;
//         this.gainNode.connect(osc.oscillator.frequency);
//     }
// }
// class Tremolo extends Lfo {
//     constructor(context, now, osc) {
//         super(context, now);
//         this.gainNode.gain.value = 0.15;
//         this.gainNode.connect(osc.gainNode.gain);
//     }
// }

// const context = new (window.AudioContext || window.webkitAudioContext)();

// const keys = document.querySelectorAll('[data-note]');

// const range2 =  { c:  261.63, db: 277.18, d:  293.66, eb: 311.13, e:  329.63, f: 349.23, 
//                   gb: 369.99, g:  392.00, ab: 415.30, a:  440.00, bb: 466.16, b: 493.88 }
// const range4 = halfFrequencies(range2);
// const range8 = halfFrequencies(range4);
// const range16 = halfFrequencies(range8);
// const range32 = halfFrequencies(range16);
// const rangeLo = halfFrequencies(range32);

// function halfFrequencies(freqObj) {
//     const keysArray = Object.keys(freqObj);
//     const newFreqArray = Object.values(freqObj)
//         .map(x => (x/2)
//         .toFixed(2));
//     return toObject(keysArray, newFreqArray);
// }
// function toObject(keys, values) {
//     const newObj = {};
//     for(let i = 0; i < keys.length; i++) {
//         newObj[keys[i]] = values[i];
//     }
//     return newObj;
// }

// const oscillatorOneVolume = document.getElementById('oscillatorOneVolume');
// const context = new (window.AudioContext || window.webkitAudioContext)();
// const vibratoDepth = document.getElementById('vibratoDepth');
// const vibratoFrequency = document.getElementById('vibratoFrequency');

// const oscillatorOne = new Oscillator(context, range2);

// keys.forEach(key => {
//     key.addEventListener('mousedown', event => {
//         const frequency = notes[event.target.dataset.note];
//         oscillatorOne.play(frequency);
//         oscillatorTwo.play(frequency);
//     })
//     key.addEventListener('mouseup', () => {
//         oscillatorOne.stop();
//         oscillatorTwo.stop();
//     })
// })

// oscillatorOneVolume.addEventListener('input', event => {
//     const value = event.target.value;
//     oscillatorOne.gainNode.gain.setValueAtTime(value/100, now);
// })
// oscillatorTwoVolume.addEventListener('input', event => {
//     const value = event.target.value;
//     oscillatorTwo.gainNode.gain.setValueAtTime(value/100, now);
// })
// vibratoDepth.addEventListener('input', event => {
//     const value = event.target.value;
//     vibrato.gainNode.gain.setValueAtTime(value, now);
// })
// vibratoFrequency.addEventListener('input', event => {
//     const value = event.target.value;
//     vibrato.oscillator.frequency.setValueAtTime(value/10, now);
// })
















class Oscillator {
    constructor(outDest, volume, waveform, range) {
        this.outDest = outDest;
        this.range = range;
        this.osc = context.createOscillator();
        this.osc.type = waveform;
        this.lvl = context.createGain();
        this.lvl.gain.setValueAtTime(volume, now);
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
        this.volume = masterVolumeElement.value / 5;
    }
    play() {
        if(this.lvl.gain.value) {
            this.lvl.gain.setValueAtTime(this.lvl.gain.value, context.currentTime);
            this.lvl.gain.cancelScheduledValues(context.currentTime + 0.001);
        } else {
            this.lvl.gain.setValueAtTime(0.001, context.currentTime);
        }
        this.lvl.gain.exponentialRampToValueAtTime(this.volume, context.currentTime + attackValue);
    }
    stop() {
        if(this.lvl.gain.value) {
            this.lvl.gain.setValueAtTime(this.lvl.gain.value, context.currentTime);
            this.lvl.gain.cancelScheduledValues(context.currentTime + 0.001);
            this.lvl.gain.exponentialRampToValueAtTime(0.001, context.currentTime + releaseValue);
            this.lvl.gain.setValueAtTime(0, context.currentTime + releaseValue);
        }
    }
}
class LFO {
    constructor(outputDest) {
        this.osc = context.createOscillator();
        this.osc.frequency.value = modulationRateValue;
        this.lvl = context.createGain();
        this.lvl.gain.value = modulationDepthValue;

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








const oscOneVolume = document.querySelector('[name="oscOneVolume"]');
oscOneVolume.addEventListener('input', event => {
    const level = event.target.value;
    oscOne.lvl.gain.exponentialRampToValueAtTime(level, now);
})
const oscTwoVolume = document.querySelector('[name="oscTwoVolume"]');
oscTwoVolume.addEventListener('input', event => {
    const level = event.target.value;
    oscTwo.lvl.gain.exponentialRampToValueAtTime(level, now);
})
const masterVolumeElement = document.querySelector('[name="masterVolume"]');
masterVolumeElement.addEventListener('input', event => {
    const level = event.target.value / 5;
    masterVolume.volume = level;
})

const attack = document.querySelector('[name="attack"]');
let attackValue = Number(attack.value);
attack.addEventListener('input', event => {
    attackValue = Number(event.target.value);
})
const release = document.querySelector('[name="release"]');
let releaseValue = Number(release.value);
release.addEventListener('input', event => {
    releaseValue = Number(event.target.value);
})
const modulationDepth = document.querySelector('[name="modulation-depth"]');
let modulationDepthValue = Number(modulationDepth.value);
modulationDepth.addEventListener('input', event => {
    lfo.lvl.gain.setValueAtTime(event.target.value, context.currentTime);
})
const modulationRate = document.querySelector('[name="modulation-rate"]');
let modulationRateValue = Number(modulationRate.value);
modulationRate.addEventListener('input', event => {
    lfo.osc.frequency.setValueAtTime(event.target.value, context.currentTime);
})

const oscOneWaveform = document.querySelector('[name="oscOneWaveform"]')
oscOneWaveform.addEventListener('input', event => {
    oscOne.updateWaveform(event.target.value);
})
const oscTwoWaveform = document.querySelector('[name="oscTwoWaveform"]')
oscTwoWaveform.addEventListener('input', event => {
    oscTwo.osc.type = event.target.value;
})

const oscOneRange = document.querySelector('[name="oscOneRange"]');
oscOneRange.addEventListener('input', event => {
    oscOne.range = Number(event.target.value);
})
const oscTwoRange = document.querySelector('[name="oscTwoRange"]');
oscTwoRange.addEventListener('input', event => {
    oscTwo.range = Number(event.target.value);
})


const masterVolume = new MasterVolume();
masterVolume.lvl.connect(context.destination);

const oscOne = new Oscillator(masterVolume.lvl, oscOneVolume.value, oscOneWaveform.value, Number(oscOneRange.value));
const oscTwo = new Oscillator(masterVolume.lvl, oscTwoVolume.value, oscTwoWaveform.value, Number(oscTwoRange.value));
const lfo = new LFO([oscOne.osc.frequency, oscTwo.osc.frequency]);



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
        masterVolume.play();
    })
    key.addEventListener('mouseout', () => {
        masterVolume.stop();
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
const canvasElement = document.querySelector('canvas');
const canvas = canvasElement.getContext('2d');

function sizeCanvas(width, height) {
    canvasElement.width = width / 3;
    canvasElement.height = height / 10;
}

window.addEventListener('resize', sizeCanvas(window.innerWidth, window.innerHeight));

const oscilloscope = context.createAnalyser();
masterVolume.lvl.connect(oscilloscope);
oscilloscope.fftSize = 2048;
const bufferLength = oscilloscope.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);

function draw() {
    const drawVisual = requestAnimationFrame(draw);
    oscilloscope.getByteTimeDomainData(dataArray);
    canvas.fillStyle = 'rgb(200, 200, 200)';
    canvas.fillRect(0, 0, canvasElement.width, canvasElement.height);
    canvas.lineWidth = 2;
    canvas.strokeStyle = 'rgb(0, 0, 0)';
    canvas.beginPath();
    
    const sliceWidth = canvasElement.width * 1.0 / bufferLength;
    let x = 0;
    
    for(i=0; i<bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvasElement.height / 2;
        
        if(i === 0) {
            canvas.moveTo(x, y);
        } else {
            canvas.lineTo(x, y);
        }
        x += sliceWidth
    }
    
    canvas.lineTo(canvasElement.width, canvasElement.height);
    canvas.stroke();
};

draw();






//-------------Knobs

window.inputKnobsOptions = { knobDiameter: '100' };