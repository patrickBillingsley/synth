//----------  KNOB PROPERTIES  ----------

window.inputKnobsOptions = { knobDiameter: '100' };




//----------  CLASSES  ----------

class Oscillator {
    constructor(outDest, vol, freq, range, position) {
        this.outDest = outDest;
        this.range = range;
        this.freq = freq;

        this.osc = context.createOscillator();
        this.lvl = context.createGain();

        this.lvl.gain.setValueAtTime(vol, context.currentTime);

        this.osc.connect(this.lvl);
        this.lvl.connect(outDest);

        this.osc.start();
    }
    play(freq) {
        this.osc.frequency.cancelScheduledValues(context.currentTime);
        this.osc.frequency.linearRampToValueAtTime(freq, context.currentTime + controllers.glide.value);
    }
})
class Master {
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
        this.lvl.gain.exponentialRampToValueAtTime(this.vol, context.currentTime);
    }
    stop() {
        if(this.lvl.gain.value) {
            this.lvl.gain.setValueAtTime(this.lvl.gain.value, context.currentTime);
            this.lvl.gain.cancelScheduledValues(context.currentTime + 0.001);
            this.lvl.gain.exponentialRampToValueAtTime(0.001, context.currentTime);
            this.lvl.gain.setValueAtTime(0, context.currentTime);
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
    constructor(elem, slave, property) {
        this.elem = elem;
        this.value = elem.value;
        this.property = property;
        this.slave = slave;
        this.addListener();
        this.pushToArray();
    }
    addListener() {
        this.elem.addEventListener('input', event => {
            this.value = event.target.value;
            console.log(this.name + ' = ' + this.value);
        })
    }
    pushToArray() {
        knobArray.push(this);
    }
}
class Range extends Knob {
    constructor(elem, slave, property) {
        super(elem, slave, property);
        this.waveformArray = ['sine', 'square', 'sawtooth', 'triangle', 'square', 'sine'];

        this.updateWaveform(elem);
    }
    updateWaveform() {
        this.waveform = this.waveformArray[this.value - 1];
    }
}

class Switch {
    constructor(elem, slave, property) {
        this.elem = elem;
        this.value = elem.value;
        this.slave = slave;
        this.property = property;
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

    //----- knobs -----

const oscOneFreqElem = document.querySelector('[name="osc-one-freq"]');
const glideElem = document.querySelector('[name="glide"]');
const modMixElem = document.querySelector('[name="mod-mix"]');

    //----- switches -----

const oscFilterSwitchElem = document.querySelector('[name="osc-filter-switch"]');
const noiseLfoSwitchElem = document.querySelector('[name="noise-lfo-switch"]');

const controllers = {
    oscOneFreq: new Knob(oscOneFreqElem, 'oscOne', 'freq'),
    glide: new Knob(glideElem, ['oscOne', 'oscTwo', 'oscThree'], 'glide'),
    modMix: new Knob(modMixElem),
    oscFilterSwitch: new Switch(oscFilterSwitchElem),
    noiseLfoSwitch: new Switch(noiseLfoSwitchElem)
};

const oscOneFreq = new Knob(oscOneFreqElem, 'oscOne', 'freq');
const glide = new Knob(glideElem, ['oscOne', 'oscTwo', 'oscThree'], 'glide');
const modMix = new Knob(modMixElem);

const oscFilterSwitch = new Switch(oscFilterSwitchElem);
const noiseLfoSwitch = new Switch(noiseLfoSwitchElem);





//----------  OSCILLATOR BANK  ----------

    //----- range -----

const oscOneRangeElem = document.querySelector('[name="osc-one-range"]');
const oscTwoRangeElem = document.querySelector('[name="osc-two-range"]');
const oscThreeRangeElem = document.querySelector('[name="osc-three-range"]');

//----- freq -----

const oscTwoFreqElem = document.querySelector('[name="osc-two-freq"]');
const oscThreeFreqElem = document.querySelector('[name="osc-three-freq"]');

//----- waveform -----

const oscOneWaveformElem = document.querySelector('[name="osc-one-waveform"]');
const oscTwoWaveformElem = document.querySelector('[name="osc-two-waveform"]');
const oscThreeWaveformElem = document.querySelector('[name="osc-three-waveform"]');

//----- switches -----

const oscModSwitchElem = document.querySelector('[name="osc-mod-switch"]');
const oscThreeControlSwitchElem = document.querySelector('[name="osc-three-control-switch"]');

const oscBank = {
    oscOneRange: new Range(oscOneRangeElem, 'oscOne', 'range'),
    oscTwoRange: new Range(oscTwoRangeElem, 'oscTwo', 'range'),
    oscThreeRange: new Range(oscThreeRangeElem, 'oscThree', 'range'),
    oscTwoFreq: new Knob(oscTwoFreqElem, 'oscTwo', 'freq'),
    oscThreeFreq: new Knob(oscThreeFreqElem, 'oscThree', 'freq'),
    oscOneWaveform: new Range(oscOneWaveformElem, 'oscOne', 'waveform'),
    oscTwoWaveform: new Range(oscTwoWaveformElem, 'oscTwo', 'waveform'),
    oscThreeWaveform: new Range(oscThreeWaveformElem, 'oscThree', 'waveform'),
    oscModSwitch: new Switch(oscModSwitchElem, ['oscOne', 'oscTwo', 'oscThree'], 'mod'),
    oscThreeControlSwitch: new Switch(oscThreeControlSwitchElem, 'oscThree', 'control')
}

const oscOneRange = new Range(oscOneRangeElem, 'oscOne', 'range');
const oscTwoRange = new Range(oscTwoRangeElem, 'oscTwo', 'range');
const oscThreeRange = new Range(oscThreeRangeElem, 'oscThree', 'range');

const oscTwoFreq = new Knob(oscTwoFreqElem, 'oscTwo', 'freq');
const oscThreeFreq = new Knob(oscThreeFreqElem, 'oscThree', 'freq');

const oscOneWaveform = new Range(oscOneWaveformElem, 'oscOne', 'waveform');
const oscTwoWaveform = new Range(oscTwoWaveformElem, 'oscTwo', 'waveform');
const oscThreeWaveform = new Range(oscThreeWaveformElem, 'oscThree', 'waveform');

const oscThreeControlSwitchElem = document.querySelector('[name="osc-three-control-switch"]');
const oscModSwitch = new Switch(oscModSwitchElem, ['oscOne', 'oscTwo', 'oscThree'], 'mod');




//----------  MIXER  ----------

    //----- knobs -----

const oscOneVolElem = document.querySelector('[name="osc-one-vol"]');
const oscTwoVolElem = document.querySelector('[name="osc-two-vol"]');
const oscThreeVolElem = document.querySelector('[name="osc-three-vol"]');
const extInputVolElem = document.querySelector('[name="ext-input-vol"]');
const noiseVolElem = document.querySelector('[name="noise-vol"]');

//----- switches -----

const oscOneSwitchElem = document.querySelector('[name="osc-one-switch"]');
const oscTwoSwitchElem = document.querySelector('[name="osc-two-switch"]');
const oscThreeSwitchElem = document.querySelector('[name="osc-three-switch"]');
const extInputSwitchElem = document.querySelector('[name="ext-input-switch"]');
const noiseSwitchElem = document.querySelector('[name="noise-switch"]');
const whitePinkSwitchElem = document.querySelector('[name="white-pink-switch"]');


const mixer = {
    oscOneVol: new Knob(oscOneVolElem, 'oscOne', 'vol'),
    oscTwoVol: new Knob(oscTwoVolElem, 'oscTwo', 'vol'),
    oscThreeVol: new Knob(oscThreeVolElem, 'oscThree', 'vol'),
    extInputVol: new Knob(extInputVolElem, 'extInput', 'vol'),
    noiseVol: new Knob(noiseVolElem, 'noise', 'vol'),

    oscOneSwitch: new Switch(oscOneSwitchElem, 'oscOne', 'on'),
    oscTwoSwitch: new Switch(oscTwoSwitchElem, 'oscTwo', 'on'),
    oscThreeSwitch: new Switch(oscThreeSwitchElem, 'oscThree', 'on'),
    extInputSwitch: new Switch(extInputSwitchElem, 'extInput', 'on'),
    noiseSwitch: new Switch(noiseSwitchElem, 'noise', 'on'),
    whitePinkSwitch: new Switch(whitePinkSwitchElem, 'whitePink', 'on')
}

const oscOneVol = new Knob(oscOneVolElem, 'oscOne', 'vol');
const oscTwoVol = new Knob(oscTwoVolElem, 'oscTwo', 'vol');
const oscThreeVol = new Knob(oscThreeVolElem, 'oscThree', 'vol');
const extInputVol = new Knob(extInputVolElem, 'extInput', 'vol');
const noiseVol = new Knob(noiseVolElem, 'noise', 'vol');

const oscOneSwitch = new Switch(oscOneSwitchElem, 'oscOne', 'on');
const oscTwoSwitch = new Switch(oscTwoSwitchElem, 'oscTwo', 'on');
const oscThreeSwitch = new Switch(oscThreeSwitchElem, 'oscThree', 'on');
const extInputSwitch = new Switch(extInputSwitchElem, 'extInput', 'on');
const noiseSwitch = new Switch(noiseSwitchElem, 'noise', 'on');
const whitePinkSwitch = new Switch(whitePinkSwitchElem, 'whitePink', 'on');




//----------  FILTER  ----------

const cutoffFreqElem = document.querySelector('[name="cutoff-freq"]');
const emphasisElem = document.querySelector('[name="emphasis"]');
const contourElem = document.querySelector('[name="contour"]');
const filterAttackElem = document.querySelector('[name="filter-attack"]');
const filterDecayElem = document.querySelector('[name="filter-decay"]');
const filterSustainElem = document.querySelector('[name="filter-sustain"]');

const filter = {
    cutoffFreq: new Knob(cutoffFreqElem, 'filter', 'cutoffFreq'),
    emphasis: new Knob(emphasisElem, 'filter', 'emphasis'),
    contour: new Knob(contourElem, 'filter', 'contour'),
    attack: new Knob(filterAttackElem, 'filter', 'attack'),
    decay: new Knob(filterDecayElem, 'filter', 'decay'),
    sustain: new Knob(filterSustainElem, 'filter', 'sustain')
};




//----------  LOUDNESS CONTOUR  ----------

const loudnessAttackElem = document.querySelector('[name="loudness-attack"]');
const loudnessDecayElem = document.querySelector('[name="loudness-decay"]');
const loudnessSustainElem = document.querySelector('[name="loudness-sustain"]');

const loudness = {
    attack: new Knob(loudnessAttackElem, 'loudness', 'attack'),
    decay: new Knob(loudnessDecayElem, 'loudness', 'decay'),
    sustain: new Knob(loudnessSustainElem,'loudness', 'sustain')
};




//----------  OUTPUT  ----------

const outputVolElem = document.querySelector('[name="output-vol"]');

const output = {
    outputVol: new Knob(outputVolElem, 'output', 'vol')
}





//----------  MASTER SECTION  ----------

const master = new Master();
master.lvl.connect(context.destination);




//----------  OSCILLATORS  ----------

const oscOne = new Oscillator(master.lvl, oscOneVol.value, oscOneFreq.value, oscOneRange.value, oscOneWaveform.value);
const oscTwo = new Oscillator(master.lvl, oscTwoVol.value, oscTwoFreq.value, oscTwoRange.value, oscTwoWaveform.value);
const oscThree = new Oscillator(master.lvl, oscThreeVol.value, oscThreeFreq.value, oscThreeRange.value, oscThreeWaveform.value);
// const lfo = new LFO([oscOne.osc.frequency, oscTwo.osc.frequency]);




//----------  KEYBOARD  ----------

const keys = document.querySelectorAll('[data-note]');

keys.forEach(key => {
    key.addEventListener('mouseenter', event => {
        const note = event.target.dataset.note;
        const octave = Number(event.target.dataset.octave);

            //----- osc 1 -----

        Object.entries(ranges[oscOne.range + octave]).forEach(arr => {
            if(arr.includes(note)) {
                const freq = arr[1];
                oscOne.play(freq);
            }
        })
        
            //----- osc 2 -----

        Object.entries(ranges[oscTwo.range + octave]).forEach(arr => {
            if(arr.includes(note)) {
                const freq = arr[1];
                oscTwo.play(freq);
            }
        })

            //----- osc 3 -----

        Object.entries(ranges[oscThree.range + octave]).forEach(arr => {
            if(arr.includes(note)) {
                const freq = arr[1];
                oscThree.play(freq);
            }
        })

        master.play();

    })

    key.addEventListener('mouseout', () => {
        master.stop();
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

    master.vol = Number(outputVolElem.value);
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



// switchArray.forEach(object => {
//     if(object.slave == 'oscThree')
//     console.log(object.slave + ' ' + object.property + ' = ' + object.value);
// })

console.log(controllers);