class Sound {
    constructor(context) {
        this.context = context;
    }
    init() {
        this.oscillator = this.context.createOscillator();
        this.gainNode = this.context.createGain();
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
        this.oscillator.type = 'sine';
    }
    play(value, time) {
        this.init();
        this.oscillator.frequency.value = value;
        this.gainNode.gain.setValueAtTime(0.001, this.context.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(1, this.context.currentTime + 0.5);
        this.oscillator.start(time);
        this.stop(time);
    }
    stop(time) {
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1);
        this.oscillator.stop(time + 1);
    }
}


const keys = document.querySelectorAll('[data-note]');

const notes = {
    c4: 261.63,
    d4: 293.66,
    e4: 329.63,
    f4: 349.23,
    g4: 392.00,
    a5: 440.00,
    b5: 493.88,
    c5: 523.25
}

keys.forEach(key => {
    key.addEventListener('click', event => {
        const frequency = notes[event.target.dataset.note];
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const note = new Sound(context);
        const now = context.currentTime;
        note.play(frequency, now);
    })
})