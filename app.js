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
    constructor(context, outDest, freq) {
        this.context = context;
        this.outDest = outDest;
        this.freq = freq;
        this.osc = context.createOscillator();
        this.lvl = context.createGain();
        this.osc.connect(this.lvl);
        this.osc.start();
        this.play(freq);
    }
    play(freq) {
        this.lvl.gain.setValueAtTime(0.001, this.context.currentTime);
        this.lvl.connect(masterVol);
        this.lvl.gain.exponentialRampToValueAtTime(0.25, this.context.currentTime + 2);
        this.osc.frequency.setValueAtTime(440, this.context.currentTime);
        this.osc.frequency.linearRampToValueAtTime(freq, this.context.currentTime);
    }
    stop() {
        // this.lvl.gain.cancelScheduledValues(this.context.currentTime);
        this.lvl.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 2);
    }
}




const context = new (window.AudioContext || window.webkitAudioContext)();




const range2  =  { a: 440.00, bb: 466.16, b: 493.88, c: 523.25, db: 554.37, d: 587.33, eb: 622.25, e: 659.25, f: 698.46, gb: 739.99, g: 783.99, ab: 830.61 }
const range4  = halfFrequencies(range2);
const range8  = halfFrequencies(range4);
const range16 = halfFrequencies(range8);
const range32 = halfFrequencies(range16);
const rangeLo = halfFrequencies(range32);




const masterVol = context.createGain();
masterVol.connect(context.destination);




const oscOneVolKnob = document.getElementById('oscOneVol');
oscOneVolKnob.addEventListener('input', event => {
    const level = event.target.value;
    oscOne.lvl.gain.exponentialRampToValueAtTime(level, context.currentTime + 0.1);
})

const masterVolKnob = document.getElementById('masterVol');
masterVolKnob.addEventListener('input', event => {
    const level = event.target.value;
    masterVol.gain.exponentialRampToValueAtTime(level, context.currentTime + 0.1);
})

const oscOneRange = document.getElementById('rangeSelect');
oscOneRange.addEventListener('input', event => {
    oscOne.range = 'range' + event.target.value;
    console.log(oscOne.range);
})




const oscOne = [];




const keys = document.querySelectorAll('[data-note]');
keys.forEach(key => {
    key.addEventListener('mouseenter', event => {
        const note = event.target.dataset.note;
        Object.entries(range2).forEach(arr => {
            if(arr.includes(note)) {
                const freq = arr[1];
                oscOne.unshift(new Oscillator(context, masterVol, freq));
            }
        })
    })
    key.addEventListener('mouseout', () => {
        oscOne[0].stop();
        oscOne.splice(0);
    })
})




function halfFrequencies(freqObj) {
    const keysArray = Object.keys(freqObj);
    const newFreqArray = Object.values(freqObj)
        .map(x => (x/2)
        .toFixed(2));
    return toObject(keysArray, newFreqArray);
}
function toObject(keys, values) {
    const newObj = {};
    for(let i = 0; i < keys.length; i++) {
        newObj[keys[i]] = values[i];
    }
    return newObj;
}