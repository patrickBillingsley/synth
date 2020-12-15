//----------  GLOBOAL VARIABLES ----------

const delay = 0.01;




//----------  KNOB PROPERTIES  ----------

window.inputKnobsOptions = { knobDiameter: '100' };




//----------  CLASSES  ----------

class Oscillator {
    constructor() {
        this.range;
        this.glideOn;
        this.glideTime;
        this.tune;

        this.osc = context.createOscillator();
        this.osc.start();

        oscArray.push(this.osc);
    }
    play(note, octave) {
        Object.entries(fundamentalOctave).forEach(arr => {
            if(arr.includes(note)) {
                let multiplier = Number(this.range) + Number(octave);
                let freq = arr[1];
                for(i=0; i<multiplier; i++) {
                    freq = freq * 2;
                }
                this.osc.frequency.cancelScheduledValues(context.currentTime);

                if(this.glideOn == 1) {
                    this.osc.frequency.linearRampToValueAtTime(freq, context.currentTime + delay + parseFloat(this.glideTime));
                } else {
                    this.osc.frequency.linearRampToValueAtTime(freq, context.currentTime + delay);
                }
            }
        })
    }
}
class Gain {
    constructor() {
        this.vol;
        this.decay;
        this.decayOn;

        this.lvl = context.createGain();
        this.lvl.gain.value = 0;

        gainArray.push(this.lvl);
    }
    play() {

        if(this.lvl.gain.value) {
            this.lvl.gain.setValueAtTime(this.lvl.gain.value, context.currentTime);
            this.lvl.gain.cancelScheduledValues(context.currentTime + delay);
        } else {
            this.lvl.gain.setValueAtTime(0.001, context.currentTime);
        }
        this.lvl.gain.exponentialRampToValueAtTime(this.vol, context.currentTime + parseFloat(this.attack));
        
        let sustainVol = this.vol * this.sustain;
        
        this.lvl.gain.exponentialRampToValueAtTime(sustainVol, context.currentTime + (this.attack * 2));
    }
    stop() {
        if(this.lvl.gain.value) {
            let time;

            this.lvl.gain.setValueAtTime(this.lvl.gain.value, context.currentTime);
            this.lvl.gain.cancelScheduledValues(context.currentTime + delay);

            if(this.decayOn == 1) {
                console.log('decay is on');
                time = context.currentTime + parseFloat(this.decay) + delay;
            } else {
                console.log('decay is off');
                time = context.currentTime + delay;
            }

            this.lvl.gain.exponentialRampToValueAtTime(0.001, time);
            this.lvl.gain.setValueAtTime(0, time);
        }
    }
}

class Knob {
    constructor(elem, slave, property) {
        this.elem = elem;
        this.value = elem.value;
        this.slave = slave;
        this.property = property;
        this.pushToArray();
    }
    pushToArray() {
        knobArray.push(this);
    }
}
class Range extends Knob {
    constructor(elem, slave, property) {
        super(elem, slave, property);
        this.waveformArray = ['sine', 'square', 'sawtooth', 'triangle', 'square', 'sine'];

        this.selectWaveform();
    }
    selectWaveform() {
        return this.waveformArray[this.value - 1];
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

fundamentalOctave = { A: 13.75, Bb: 14.57, B: 15.43, C: 16.35, Db: 17.32, D: 18.36, Eb: 19.45, E: 20.6, F: 21.83, Gb: 23.13, G: 24.5, Ab: 23.13 };




//----------  CONTROLS  ----------

const knobArray = [];
const switchArray = [];




//----------  OSCILLATORS  ----------

const oscArray = [];

const oscOne = new Oscillator();
const oscTwo = new Oscillator();
const oscThree = new Oscillator();
const lfo = new Oscillator();




//----------  GAIN SECTION  ----------

const gainArray = [];

const gainOne = new Gain();
const gainTwo = new Gain();
const gainThree = new Gain();
const gainLfo = new Gain();

const master = new Gain()
master.lvl.connect(context.destination);




//----------  TUNING SECTION  ----------

const tune = {
    master: null,
    oscTwo: null,
    oscThree: null,

    tuneMaster() {
        oscOne.osc.detune.setValueAtTime(this.master, context.currentTime);
    },
    tuneOscTwo() {
        let cents = Number(this.master) + Number(this.oscTwo);
        oscTwo.osc.detune.setValueAtTime(cents, context.currentTime);
    },
    tuneOscThree() {
        let cents = Number(this.master) + Number(this.oscThree);
        oscThree.osc.detune.setValueAtTime(cents, context.currentTime);
    }
};




//----------  CONNECTIONS ----------

for(i=0; i<oscArray.length; i++) {
    oscArray[i].connect(gainArray[i]);
}

    //----- temp -----
for(i=0; i<gainArray.length-1; i++) {
    gainArray[i].connect(gainArray[gainArray.length-1]);
}




//----------  CONTROLLERS  ----------

    //----- knobs -----

const tuneElem = document.querySelector('[name="tune"]');
const glideElem = document.querySelector('[name="glide"]');
const modMixElem = document.querySelector('[name="mod-mix"]');

    //----- switches -----

const oscFilterSwitchElem = document.querySelector('[name="osc-filter-switch"]');
const noiseLfoSwitchElem = document.querySelector('[name="noise-lfo-switch"]');

const controllers = {
    tune: new Knob(tuneElem, 'oscOne', 'tune'),
    glide: new Knob(glideElem, 'glide', 'time'),
    modMix: new Knob(modMixElem),
    oscFilterSwitch: new Switch(oscFilterSwitchElem),
    noiseLfoSwitch: new Switch(noiseLfoSwitchElem)
};




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

    oscTwoFreq: new Knob(oscTwoFreqElem, 'oscTwo', 'tune'),
    oscThreeFreq: new Knob(oscThreeFreqElem, 'oscThree', 'tune'),

    oscOneWaveform: new Range(oscOneWaveformElem, 'oscOne', 'waveform'),
    oscTwoWaveform: new Range(oscTwoWaveformElem, 'oscTwo', 'waveform'),
    oscThreeWaveform: new Range(oscThreeWaveformElem, 'oscThree', 'waveform'),
    
    oscModSwitch: new Switch(oscModSwitchElem, ['oscOne', 'oscTwo', 'oscThree'], 'mod'),
    oscThreeControlSwitch: new Switch(oscThreeControlSwitchElem, 'oscThree', 'control')
}




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
    extInputVol: new Knob(extInputVolElem),
    noiseVol: new Knob(noiseVolElem),

    oscOneSwitch: new Switch(oscOneSwitchElem, 'oscOne', 'on'),
    oscTwoSwitch: new Switch(oscTwoSwitchElem, 'oscTwo', 'on'),
    oscThreeSwitch: new Switch(oscThreeSwitchElem, 'oscThree', 'on'),
    extInputSwitch: new Switch(extInputSwitchElem),
    noiseSwitch: new Switch(noiseSwitchElem),
    whitePinkSwitch: new Switch(whitePinkSwitchElem)
}




//----------  FILTER  ----------

const cutoffFreqElem = document.querySelector('[name="cutoff-freq"]');
const emphasisElem = document.querySelector('[name="emphasis"]');
const contourElem = document.querySelector('[name="contour"]');
const filterAttackElem = document.querySelector('[name="filter-attack"]');
const filterDecayElem = document.querySelector('[name="filter-decay"]');
const filterSustainElem = document.querySelector('[name="filter-sustain"]');

const filter = {
    cutoffFreq: new Knob(cutoffFreqElem),
    emphasis: new Knob(emphasisElem),
    contour: new Knob(contourElem),
    attack: new Knob(filterAttackElem),
    decay: new Knob(filterDecayElem),
    sustain: new Knob(filterSustainElem)
};




//----------  LOUDNESS CONTOUR  ----------

const loudnessAttackElem = document.querySelector('[name="loudness-attack"]');
const loudnessDecayElem = document.querySelector('[name="loudness-decay"]');
const loudnessSustainElem = document.querySelector('[name="loudness-sustain"]');

const loudness = {
    attack: new Knob(loudnessAttackElem, 'master', 'attack'),
    decay: new Knob(loudnessDecayElem, 'master', 'decay'),
    sustain: new Knob(loudnessSustainElem, 'master', 'sustain')
};




//----------  OUTPUT  ----------

const outputVolElem = document.querySelector('[name="output-vol"]');

const output = {
    outputVol: new Knob(outputVolElem, 'master', 'vol')
}



//----------  PITCH MOD  ----------

const lfoRateElem = document.querySelector('[name="lfo-rate"]');
const glideSwitchElem = document.querySelector('[name="glide-switch"]');
const decaySwitchElem = document.querySelector('[name="decay-switch"]');

const pitchMod = {
    lfoRate: new Knob(lfoRateElem, 'lfo', 'rate'),
    glideSwitch: new Switch(glideSwitchElem, 'glide', 'on'),
    decaySwitch: new Switch(decaySwitchElem, 'decay', 'on')
}




//----------  CONTROL CONNECTIONS  ----------

knobArray.forEach(knob => {

    if(knob.slave == 'oscOne') {

        if(knob.property == 'range') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                oscOne.range = knob.value;
                console.log(oscOne.range);
            })
        }

        if(knob.property == 'waveform') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                oscOne.osc.type = knob.selectWaveform();
            })
        }

        if(knob.property == 'vol') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                gainOne.lvl.gain.setValueAtTime(knob.value, context.currentTime);
            })
        }

        if(knob.property == 'tune') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                tune.master = knob.value;
                tune.tuneMaster();
                tune.tuneOscTwo();
                tune.tuneOscThree();
            })
        }
    }

    if(knob.slave == 'oscTwo') {
    
        if(knob.property == 'range') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                oscTwo.range = knob.value;
            })
        }

        if(knob.property == 'waveform') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                oscTwo.osc.type = knob.selectWaveform();
            })
        }

        if(knob.property == 'vol') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                gainTwo.lvl.gain.setValueAtTime(knob.value, context.currentTime);
            })
        }

        if(knob.property == 'tune') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                tune.oscTwo = knob.value;
                tune.tuneOscTwo();
            })
        }
    }

    if(knob.slave == 'oscThree') {
    
        if(knob.property == 'range') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                oscThree.range = knob.value;
            })
        }

        if(knob.property == 'waveform') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                oscThree.osc.type = knob.selectWaveform();
            })
        }

        if(knob.property == 'vol') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                gainThree.lvl.gain.setValueAtTime(knob.value, context.currentTime);
            })
        }

        if(knob.property == 'tune') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                tune.oscThree = knob.value;
                tune.tuneOscThree();
            })
        }
    }

    if(knob.slave == 'master') {

        if(knob.property == 'vol') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                master.vol = knob.value;
            })
        }

        if(knob.property == 'attack') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                master.attack = knob.value;
            })
        }

        if(knob.property == 'decay') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                master.decay = knob.value;
            })
        }

        if(knob.property == 'sustain') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                master.sustain = knob.value;
            })
        }
    }

    if(knob.slave == 'glide') {

        if(knob.property == 'time') {
            knob.elem.addEventListener('input', event => {
                knob.value = event.target.value;
                oscOne.glideTime = knob.value;
                oscTwo.glideTime = knob.value;
                oscThree.glideTime = knob.value;
            })
        }
    }
})

switchArray.forEach(control => {

    if(control.slave == 'oscOne') {

        control.elem.addEventListener('input', event => {
            let value = event.target.value;
            if(value == 1) {
                gainOne.lvl.connect(master.lvl);
            } else {
                gainOne.lvl.disconnect(master.lvl);
            }
        })
    }

    if(control.slave == 'oscTwo') {

        control.elem.addEventListener('input', event => {
            let value = event.target.value;
            if(value == 1) {
                gainTwo.lvl.connect(master.lvl);
            } else {
                gainTwo.lvl.disconnect(master.lvl);
            }
        })
    }

    if(control.slave == 'oscThree') {

        control.elem.addEventListener('input', event => {
            let value = event.target.value;
            if(value == 1) {
                gainThree.lvl.connect(master.lvl);
            } else {
                gainThree.lvl.disconnect(master.lvl);
            }
        })
    }

    if(control.slave == 'glide') {

        control.elem.addEventListener('input', event => {
            let value = event.target.value;
            if(value == 1) {
                oscOne.glideOn = true;
                oscTwo.glideOn = true;
                oscThree.glideOn = true;
            } else {
                oscOne.glideOn = false;
                oscTwo.glideOn = false;
                oscThree.glideOn = false;
            }
        })
    }

    if(control.slave == 'decay') {

        control.elem.addEventListener('input', event => {
            let value = event.target.value;
            master.decayOn = value;
        })
    }
})

console.log(master);




//----------  KEYBOARD  ----------

const keys = document.querySelectorAll('[data-note]');

keys.forEach(key => {
    key.addEventListener('mouseenter', event => {
        const note = event.target.dataset.note;
        const octave = event.target.dataset.octave;

        oscOne.play(note, octave);
        oscTwo.play(note, octave);
        oscThree.play(note, octave);

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

function toObject(keys, values) {
    const newObj = {};
    for(let i = 0; i < keys.length; i++) {
        newObj[keys[i]] = values[i];
    }
    return newObj;
}




//----------  INITIALIZATION  ----------

(function setup() {

    //----- osc 1 -----

    oscOne.range = oscBank.oscOneRange.value;
    oscOne.osc.type = oscBank.oscOneWaveform.waveform;
    gainOne.lvl.gain.value = mixer.oscOneVol.value;

    oscOne.glideTime = controllers.glide.value;
    oscOne.glideOn = pitchMod.glideSwitch.value;

    if(mixer.oscOneSwitch.value == 1) {
        gainOne.lvl.connect(master.lvl);
    } else {
        gainOne.lvl.disconnect(master.lvl);
    }
    
    //----- osc 2 -----

    oscTwo.range = oscBank.oscTwoRange.value;
    oscTwo.osc.type = oscBank.oscTwoWaveform.waveform;
    gainTwo.lvl.gain.value = mixer.oscTwoVol.value;

    oscTwo.glideTime = controllers.glide.value;
    oscTwo.glideOn = pitchMod.glideSwitch.value;

    if(mixer.oscTwoSwitch.value == 1) {
        gainTwo.lvl.connect(master.lvl);
    } else {
        gainTwo.lvl.disconnect(master.lvl);
    }
    
    //----- osc 3 -----

    oscThree.range = oscBank.oscThreeRange.value;
    oscThree.osc.type = oscBank.oscThreeWaveform.waveform;
    gainThree.lvl.gain.value = mixer.oscThreeVol.value;

    oscThree.glideTime = controllers.glide.elem.value;
    oscThree.glideOn = pitchMod.glideSwitch.elem.value;

    if(mixer.oscThreeSwitch.value == 1) {
        gainThree.lvl.connect(master.lvl);
    } else {
        gainThree.lvl.disconnect(master.lvl);
    }

    //----- master -----

    master.vol = output.outputVol.elem.value;
    master.attack = loudness.attack.value;
    master.decay = loudness.decay.value;
    master.sustain = loudness.sustain.value;
    master.decayOn = pitchMod.decaySwitch.value;
    console.log(master.decayOn);

    //----- tune -----

    tune.master = controllers.tune.value;
    tune.oscTwo = oscBank.oscTwoFreq.value;
    tune.oscThree = oscBank.oscThreeFreq.value;

    tune.tuneMaster();
    tune.tuneOscTwo();
    tune.tuneOscThree();
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