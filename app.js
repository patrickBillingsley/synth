//----------  KNOB PROPERTIES  ----------

window.inputKnobsOptions = { knobDiameter: '100' };




//----------  CLASSES  ----------

class Oscillator {
    constructor(outDest, vol, freq, range, position) {
        this.outDest = outDest;
        this.range = Number(range);
        this.freq = Number(freq);

        this.osc = context.createOscillator();
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
}
class MasterVolume {
    constructor() {
        this.lvl = context.createGain();
        this.lvl.gain.value = 0;
        this.vol = outputVolElem.value / 5;
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
class Knob {
    constructor(elem) {
        this.elem = elem;
        this.value = elem.value;
        this.addListener();
        this.pushToArray();
    }
    addListener() {
        this.elem.addEventListener('input', event => {
            this.value = event.target.value;
            console.log(this.elem.name + ' ' + this.value);
        })
    }
    pushToArray() {
        knobArray.push(this);
    }
}
class Range extends Knob {
    constructor(elem) {
        super(elem);
        this.waveformArray = ['sine', 'square', 'sawtooth', 'triangle', 'square', 'sine'];

        this.updateWaveform(elem);
    }
    updateWaveform() {
        this.waveform = this.waveformArray[this.value - 1];
    }
}

class Switch {
    constructor(elem) {
        this.elem = elem;
        this.value = elem.value;
        this.addListener();
        this.pushToArray();
    }
    addListener() {
        this.elem.addEventListener('input', event => {
            this.value = event.target.value;
            console.log(this.elem.name + ' ' + this.value);
        })
    }
    pushToArray() {
        switchArray.push(this);
    }
}



//----------  CONTEXT  ----------

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




//----------  CONTROLS  ----------

const knobArray = [];
const switchArray = [];





//----------  CONTROLLERS  ----------

const oscOneFreqElem = document.querySelector('[name="osc-one-freq"]');
const oscOneFreq = new Knob(oscOneFreqElem);

const glideElem = document.querySelector('[name="glide"]');
const glide = new Knob(glideElem);

const modMixElem = document.querySelector('[name="mod-mix"]');
const modMix = new Knob(modMixElem);

const oscFilterSwitchElem = document.querySelector('[name="osc-filter-switch"]');
const oscFilterSwitch = new Switch(oscFilterSwitchElem);

const noiseLfoSwitchElem = document.querySelector('[name="noise-lfo-switch"]');
const noiseLfoSwitch = new Switch(noiseLfoSwitchElem);




//----------  OSCILLATOR BANK  ----------

const oscOneRangeElem = document.querySelector('[name="osc-one-range"]');
const oscOneRange = new Range(oscOneRangeElem);

const oscOneWaveformElem = document.querySelector('[name="osc-one-waveform"]');
const oscOneWaveform = new Range(oscOneWaveformElem);

const oscTwoRangeElem = document.querySelector('[name="osc-two-range"]');
const oscTwoRange = new Range(oscTwoRangeElem);

const oscTwoFreqElem = document.querySelector('[name="osc-two-freq"]');
const oscTwoFreq = new Knob(oscTwoFreqElem);

const oscTwoWaveformElem = document.querySelector('[name="osc-two-waveform"]');
const oscTwoWaveform = new Range(oscTwoWaveformElem);

const oscThreeRangeElem = document.querySelector('[name="osc-three-range"]');
const oscThreeRange = new Range(oscThreeRangeElem);

const oscThreeFreqElem = document.querySelector('[name="osc-three-freq"]');
const oscThreeFreq = new Knob(oscThreeFreqElem);

const oscThreeWaveformElem = document.querySelector('[name="osc-three-waveform"]');
const oscThreeWaveform = new Range(oscThreeWaveformElem);

const oscModSwitchElem = document.querySelector('[name="osc-mod-switch"]');
const oscModSwitch = new Switch(oscModSwitchElem);

const oscThreeControlSwitchElem = document.querySelector('[name="osc-three-control-switch"]');
const oscThreeControlSwitch = new Switch(oscThreeControlSwitchElem);




//----------  MIXER  ----------

const oscOneVolElem = document.querySelector('[name="osc-one-vol"]');
const oscOneVol = new Knob(oscOneVolElem);


const extInputVolElem = document.querySelector('[name="ext-input-vol"]');
const extInputVol = new Knob(extInputVolElem);

const oscTwoVolElem = document.querySelector('[name="osc-two-vol"]');
const oscTwoVol = new Knob(oscTwoVolElem);

const noiseVolElem = document.querySelector('[name="noise-vol"]');
const noiseVol = new Knob(noiseVolElem);

const oscThreeVolElem = document.querySelector('[name="osc-three-vol"]');
const oscThreeVol = new Knob(oscThreeVolElem);



const oscOneSwitchElem = document.querySelector('[name="osc-one-switch"]');
const oscOneSwitch = new Switch(oscOneSwitchElem);

const extInputSwitchElem = document.querySelector('[name="ext-input-switch"]');
const extInputSwitch = new Switch(extInputSwitchElem);

const oscTwoSwitchElem = document.querySelector('[name="osc-two-switch"]');
const oscTwoSwitch = new Switch(oscTwoSwitchElem);

const noiseSwitchElem = document.querySelector('[name="noise-switch"]');
const noiseSwitch = new Switch(noiseSwitchElem);

const oscThreeSwitchElem = document.querySelector('[name="osc-three-switch"]');
const oscThreeSwitch = new Switch(oscThreeSwitchElem);

const whitePinkSwitchElem = document.querySelector('[name="white-pink-switch"]');
const whitePinkSwitch = new Switch(whitePinkSwitchElem);




//----------  FILTER  ----------

const cutoffFreqElem = document.querySelector('[name="cutoff-freq"]');
const cutoffFreq = new Knob(cutoffFreqElem);

const emphasisElem = document.querySelector('[name="emphasis"]');
const emphasis = new Knob(emphasisElem);

const contourElem = document.querySelector('[name="contour"]');
const contour = new Knob(contourElem);

const filterAttackElem = document.querySelector('[name="filter-attack"]');
const filterAttack = new Knob(filterAttackElem);

const filterDecayElem = document.querySelector('[name="filter-decay"]');
const filterDecay = new Knob(filterDecayElem);

const filterSustainElem = document.querySelector('[name="filter-sustain"]');
const filterSustain = new Knob(filterSustainElem);




//----------  LOUDNESS CONTOUR  ----------

const loudnessAttackElem = document.querySelector('[name="loudness-attack"]');
const loudnessAttack = new Knob(loudnessAttackElem);

const loudnessDecayElem = document.querySelector('[name="loudness-decay"]');
const loudnessDecay = new Knob(loudnessDecayElem);

const loudnessSustainElem = document.querySelector('[name="loudness-sustain"]');
const loudnessSustain = new Knob(loudnessSustainElem);



//----------  OUTPUT  ----------

const outputVolElem = document.querySelector('[name="output-vol"]');
const outputVol = new Knob(outputVolElem);




//----------  MASTER SECTION  ----------

const masterVol = new MasterVolume();
masterVol.lvl.connect(context.destination);




//----------  OSCILLATORS  ----------

const oscOne = new Oscillator(masterVol.lvl, oscOneVol.value, oscOneFreq.value, oscOneRange.value, oscOneWaveform.value);
const oscTwo = new Oscillator(masterVol.lvl, oscTwoVol.value, oscTwoFreq.value, oscTwoRange.value, oscTwoWaveform.value);
const oscThree = new Oscillator(masterVol.lvl, oscThreeVol.value, oscThreeFreq.value, oscThreeRange.value, oscThreeWaveform.value);
// const lfo = new LFO([oscOne.osc.frequency, oscTwo.osc.frequency]);




//----------  KEYBOARD  ----------

const keys = document.querySelectorAll('[data-note]');

keys.forEach(key => {
    key.addEventListener('mouseenter', event => {
        const note = event.target.dataset.note;
        const octave = Number(event.target.dataset.octave);

            //----- OSC 1 -----

        Object.entries(ranges[oscOne.range + octave]).forEach(arr => {
            if(arr.includes(note)) {
                const freq = arr[1];
                oscOne.play(freq);
            }
        })
        
            //----- OSC 2 -----

        Object.entries(ranges[oscTwo.range + octave]).forEach(arr => {
            if(arr.includes(note)) {
                const freq = arr[1];
                oscTwo.play(freq);
            }
        })

            //----- OSC 3 -----

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



//----------  FUNCTIONS  ----------

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



//----------  INITIALIZATION  ----------

(function setup() {
    // let waveformValue;

    oscOne.range = Number(oscOneRangeElem.value);
    oscOne.freq = Number(oscOneFreqElem.value);
    waveformValue = Number(document.querySelector('[name="osc-one-range"]').value);
    // oscOne.waveform = selectWaveform(waveformValue);
    oscOne.vol = Number(oscOneVol.value);
    
    oscTwo.range = Number(oscTwoRangeElem.value);
    oscTwo.freq = Number(oscTwoFreqElem.value)
    waveformValue = Number(document.querySelector('[name="osc-two-range"]').value);
    // oscTwo.waveform = selectWaveform(waveformValue);
    oscTwo.vol = Number(oscTwoVol.value);
    
    oscThree.range = Number(oscThreeRangeElem.value);
    oscThree.freq = Number(oscThreeFreqElem.value)
    waveformValue = Number(document.querySelector('[name="osc-three-range"]').value);
    // oscThree.waveform = selectWaveform(waveformValue);
    oscThree.vol = Number(oscThreeVol.value);

    masterVol.vol = Number(outputVolElem.value);
})();




//----------  Oscilloscope  ----------

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