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
    constructor(context, outDest, volume, waveform, range) {
        this.context = context;
        this.outDest = outDest;
        this.range = range;
        this.volume = volume;
        this.osc = context.createOscillator();
        this.osc.type = waveform;
        this.lvl = context.createGain();
        this.osc.connect(this.lvl);
        this.lvl.connect(masterVolume);
        this.stop();
        this.osc.start();
    }
    play(freq) {
        this.lvl.gain.setValueAtTime(this.lvl.gain.value, this.context.currentTime);
        this.lvl.gain.cancelScheduledValues(this.context.currentTime + 0.001);

        this.osc.frequency.setValueAtTime(freq, this.context.currentTime);
        this.osc.frequency.cancelScheduledValues(this.context.currentTime + 0.001);

        this.osc.frequency.linearRampToValueAtTime(freq, this.context.currentTime + 1);

        if(this.volume > 0) {
            this.lvl.gain.exponentialRampToValueAtTime(this.volume, this.context.currentTime + 0.15);
        }
    }
    stop() {
        this.lvl.gain.setValueAtTime(this.lvl.gain.value, this.context.currentTime);
        this.lvl.gain.cancelScheduledValues(this.context.currentTime + 0.001);
        this.lvl.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.5);
    }
    updateWaveform(waveform) {
        this.osc.type = waveform;
    }
}




const context = new (window.AudioContext || window.webkitAudioContext)();



const ranges = []
fundamentalOctave = { A: 440.00, Bb: 466.16, B: 493.88, C: 523.25, Db: 554.37, D: 587.33, Eb: 622.25, E: 659.25, F: 698.46, Gb: 739.99, G: 783.99, Ab: 830.61 };
ranges.unshift(doubleFrequencies(fundamentalOctave));
ranges.unshift(fundamentalOctave);
ranges.unshift(halfFrequencies(fundamentalOctave));
ranges.unshift(halfFrequencies(ranges[0]));
ranges.unshift(halfFrequencies(ranges[0]));
ranges.unshift(halfFrequencies(ranges[0]));
ranges.unshift(halfFrequencies(ranges[0]));




const masterVolume = context.createGain();
masterVolume.connect(context.destination);




const oscOneVolume = document.querySelector('[name="oscOneVolume"]');
oscOneVolume.addEventListener('input', event => {
    const level = event.target.value;
    oscOne.volume = level;
})
const oscTwoVolume = document.querySelector('[name="oscTwoVolume"]');
oscTwoVolume.addEventListener('input', event => {
    const level = event.target.value;
    oscTwo.volume = level;
})
const masterVolumeElement = document.querySelector('[name="masterVolume"]');
masterVolumeElement.addEventListener('input', event => {
    const level = event.target.value / 5;
    masterVolume.gain.exponentialRampToValueAtTime(level, context.currentTime + 0.001);
})
const oscOneRange = document.querySelector('[name="oscOneRange"]');
oscOneRange.addEventListener('input', event => {
    oscOne.range = Number(event.target.value);
})
const oscTwoRange = document.querySelector('[name="oscTwoRange"]');
oscTwoRange.addEventListener('input', event => {
    oscTwo.range = Number(event.target.value);
})
const oscOneWaveform = document.querySelector('[name="oscOneWaveform"]')
oscOneWaveform.addEventListener('input', event => {
    oscOne.updateWaveform(event.target.value);
})
const oscTwoWaveform = document.querySelector('[name="oscTwoWaveform"]')
oscTwoWaveform.addEventListener('input', event => {
    oscTwo.osc.type = event.target.value;
})

const oscOne = new Oscillator(context, masterVolume, oscOneVolume.value, oscOneWaveform.value, Number(oscOneRange.value));

const oscTwo = new Oscillator(context, masterVolume, oscTwoVolume.value, oscTwoWaveform.value, Number(oscTwoRange.value));

masterVolume.gain.setValueAtTime(masterVolumeElement.value / 5, context.currentTime);




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
    })
    key.addEventListener('mouseout', () => {
        oscOne.stop();
        oscTwo.stop();
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