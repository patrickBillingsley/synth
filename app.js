class Oscillator {
    constructor(context, now) {
        this.context = context;
        this.now = now;
        this.oscillator = this.context.createOscillator();
        this.gainNode = this.context.createGain();
        this.oscillator.connect(this.gainNode);
        this.gainNode.gain.value = 0.5;
        this.oscillator.start();
    }
    play(frequency) {
        this.oscillator.frequency.exponentialRampToValueAtTime(frequency, this.now);
        this.gainNode.connect(this.context.destination);
    }
    stop() {
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.now + 1);
        this.gainNode.disconnect(this.context.destination);
        this.gainNode.gain.setValueAtTime(oscillatorOneVolume.value/100, this.now + 1.1);
    }
}
class Lfo extends Oscillator {
    constructor(context, now) {
        super(context, now);
        this.oscillator.frequency.value = 5;
    }
}
class Vibrato extends Lfo {
    constructor(context, now, osc) {
        super(context, now);
        this.gainNode.gain.value = 20;
        this.gainNode.connect(osc.oscillator.frequency);
    }
}
class Tremolo extends Lfo {
    constructor(context, now, osc) {
        super(context, now);
        this.gainNode.gain.value = 0.15;
        this.gainNode.connect(osc.gainNode.gain);
    }
}

const keys = document.querySelectorAll('[data-note]');

const notes = { c4: 261.63, d4: 293.66, e4: 329.63, f4: 349.23,
                g4: 392.00, a5: 440.00, b5: 493.88, c5: 523.25 }

const context = new (window.AudioContext || window.webkitAudioContext)();
const now = context.currentTime;

const oscillatorOne = new Oscillator(context, now);
const oscillatorOneVibrato = new Vibrato(context, now, oscillatorOne);
const oscillatorOneTremolo = new Tremolo(context, now, oscillatorOne);

const oscillatorOneVolume = document.getElementById('oscillatorOneVolume');
const oscillatorOneLfoRandomness = document.getElementById('oscillatorOneLfoRandomness');


keys.forEach(key => {
    key.addEventListener('mousedown', event => {
        const frequency = notes[event.target.dataset.note];
        oscillatorOne.play(frequency);
    })
    key.addEventListener('mouseup', () => {
        oscillatorOne.stop();
    })
})

oscillatorOneVolume.addEventListener('input', event => {
    const value = event.target.value;
    oscillatorOne.gainNode.gain.setValueAtTime(value/100, oscillatorOne.context.currentTime);
})