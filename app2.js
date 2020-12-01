const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscList = [];
let masterGainNode = null;

const keyboard = document.querySelector('.keyboard');
const wavePicker = document.querySelector('select[name="waveform"]');
const volumeControl = document.querySelector('input[name="volume"]');

let noteFreq = null;
let customWaveform = null;
let sineTerms = null;
let cosineTerms = null;

function createNoteTable() {
    const noteFreq = [];
    let fundamental = 27.5;
    let interval = fundamental * 2 / 12;
    for (let i=0; i<9; i++) {
        noteFreq[i] = [];
    }
    noteFreq[0]["A"] = fundamental;
    noteFreq[0]["Bb"] = interval + fundamental;
    noteFreq[0]["B"] = interval * 2 + fundamental;
    
    noteFreq[1]["C"] = interval * 3 + fundamental;
    noteFreq[1]["Db"] = interval * 4 + fundamental;
    noteFreq[1]["D"] = interval * 5 + fundamental;
    noteFreq[1]["Eb"] = interval * 6 + fundamental;
    noteFreq[1]["E"] = interval * 7 + fundamental;
    noteFreq[1]["F"] = interval * 8 + fundamental;
    noteFreq[1]["Gb"] = interval * 9 + fundamental;
    noteFreq[1]["G"] = interval * 10 + fundamental;
    noteFreq[1]["Ab"] = interval * 11 + fundamental;
    
    fundamental *= 2;
    interval = fundamental * 2 / 12;

    noteFreq[1]["A"] = fundamental;
    noteFreq[1]["Bb"] = interval + fundamental;
    noteFreq[1]["B"] = interval * 2 + fundamental;
    
    noteFreq[2]["C"] = interval * 3 + fundamental;
    noteFreq[2]["Db"] = interval * 4 + fundamental;
    noteFreq[2]["D"] = interval * 5 + fundamental;
    noteFreq[2]["Eb"] = interval * 6 + fundamental;
    noteFreq[2]["E"] = interval * 7 + fundamental;
    noteFreq[2]["F"] = interval * 8 + fundamental;
    noteFreq[2]["Gb"] = interval * 9 + fundamental;
    noteFreq[2]["G"] = interval * 10 + fundamental;
    noteFreq[2]["Ab"] = interval * 11 + fundamental;
    
    fundamental *= 2;
    interval = fundamental * 2 / 12;

    noteFreq[2]["A"] = fundamental;
    noteFreq[2]["Bb"] = interval + fundamental;
    noteFreq[2]["B"] = interval * 2 + fundamental;
    
    noteFreq[3]["C"] = interval * 3 + fundamental;
    noteFreq[3]["Db"] = interval * 4 + fundamental;
    noteFreq[3]["D"] = interval * 5 + fundamental;
    noteFreq[3]["Eb"] = interval * 6 + fundamental;
    noteFreq[3]["E"] = interval * 7 + fundamental;
    noteFreq[3]["F"] = interval * 8 + fundamental;
    noteFreq[3]["Gb"] = interval * 9 + fundamental;
    noteFreq[3]["G"] = interval * 10 + fundamental;
    noteFreq[3]["Ab"] = interval * 11 + fundamental;
    
    fundamental *= 2;
    interval = fundamental * 2 / 12;

    noteFreq[3]["A"] = fundamental;
    noteFreq[3]["Bb"] = interval + fundamental;
    noteFreq[3]["B"] = interval * 2 + fundamental;
    
    noteFreq[4]["C"] = interval * 3 + fundamental;
    noteFreq[4]["Db"] = interval * 4 + fundamental;
    noteFreq[4]["D"] = interval * 5 + fundamental;
    noteFreq[4]["Eb"] = interval * 6 + fundamental;
    noteFreq[4]["E"] = interval * 7 + fundamental;
    noteFreq[4]["F"] = interval * 8 + fundamental;
    noteFreq[4]["Gb"] = interval * 9 + fundamental;
    noteFreq[4]["G"] = interval * 10 + fundamental;
    noteFreq[4]["Ab"] = interval * 11 + fundamental;

    fundamental *= 2;
    interval = fundamental * 2 / 12;

    noteFreq[4]["A"] = fundamental;
    noteFreq[4]["Bb"] = interval + fundamental;
    noteFreq[4]["B"] = interval * 2 + fundamental;
    
    noteFreq[5]["C"] = interval * 3 + fundamental;
    noteFreq[5]["Db"] = interval * 4 + fundamental;
    noteFreq[5]["D"] = interval * 5 + fundamental;
    noteFreq[5]["Eb"] = interval * 6 + fundamental;
    noteFreq[5]["E"] = interval * 7 + fundamental;
    noteFreq[5]["F"] = interval * 8 + fundamental;
    noteFreq[5]["Gb"] = interval * 9 + fundamental;
    noteFreq[5]["G"] = interval * 10 + fundamental;
    noteFreq[5]["Ab"] = interval * 11 + fundamental;

    fundamental *= 2;
    interval = fundamental * 2 / 12;

    noteFreq[5]["A"] = fundamental;
    noteFreq[5]["Bb"] = interval + fundamental;
    noteFreq[5]["B"] = interval * 2 + fundamental;
    
    noteFreq[6]["C"] = interval * 3 + fundamental;
    noteFreq[6]["Db"] = interval * 4 + fundamental;
    noteFreq[6]["D"] = interval * 5 + fundamental;
    noteFreq[6]["Eb"] = interval * 6 + fundamental;
    noteFreq[6]["E"] = interval * 7 + fundamental;
    noteFreq[6]["F"] = interval * 8 + fundamental;
    noteFreq[6]["Gb"] = interval * 9 + fundamental;
    noteFreq[6]["G"] = interval * 10 + fundamental;
    noteFreq[6]["Ab"] = interval * 11 + fundamental;

    fundamental *= 2;
    interval = fundamental * 2 / 12;

    noteFreq[6]["A"] = fundamental;
    noteFreq[6]["Bb"] = interval + fundamental;
    noteFreq[6]["B"] = interval * 2 + fundamental;
    
    noteFreq[7]["C"] = interval * 3 + fundamental;
    noteFreq[7]["Db"] = interval * 4 + fundamental;
    noteFreq[7]["D"] = interval * 5 + fundamental;
    noteFreq[7]["Eb"] = interval * 6 + fundamental;
    noteFreq[7]["E"] = interval * 7 + fundamental;
    noteFreq[7]["F"] = interval * 8 + fundamental;
    noteFreq[7]["Gb"] = interval * 9 + fundamental;
    noteFreq[7]["G"] = interval * 10 + fundamental;
    noteFreq[7]["Ab"] = interval * 11 + fundamental;

    noteFreq[8]["C"] = fundamental * 2;

    return noteFreq;
}

function setup() {
    let noteFreq = createNoteTable();

    volumeControl.addEventListener('change', changeVolume, false);

    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);
    masterGainNode.gain.value = volumeControl.value;

    noteFreq.forEach(function(keys, idx) {
        let keyList = Object.entries(keys);
        let octaveElem = document.createElement('div');
        octaveElem.className = 'octave';

        keyList.forEach(function(key) {
            if(key[0].length == 1) {
                octaveElem.appendChild(createKey(key[0], idx, key[1]));
            }
        });
        
        keyboard.appendChild(octaveElem);
    });

    document.querySelector('div[data-note="B"][data-octave="5"]').scrollIntoView(false);

    sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    cosineTerms = new Float32Array([sineTerms.length]);
    customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

    for (i=0; i<9; i++) {
        oscList[i] = [];
    }
}

setup();

function createKey(note, octave, freq) {
    let keyElement = document.createElement('div');
    let labelElement = document.createElement('div');

    keyElement.className = 'key';
    keyElement.dataset['octave'] = octave;
    keyElement.dataset['note'] = note;
    keyElement.dataset['frequency'] = freq;

    labelElement.innerHTML = note + '<sub>' + octave + '</sub>';
    keyElement.appendChild(labelElement);

    keyElement.addEventListener('mousedown', notePressed, false);
    keyElement.addEventListener('mouseup', noteReleased, false);
    keyElement.addEventListener('mouseover', notePressed, false);
    keyElement.addEventListener('mouseleave', noteReleased, false);

    return keyElement;
}

function playTone(freq) {
    let osc = audioContext.createOscillator();
    osc.connect(masterGainNode);

    let type = wavePicker.options[wavePicker.selectedIndex].value;

    if(type == 'custom') {
        osc.setPeriodicWave(customWaveform);
    } else {
        osc.type = type;
    }

    osc.frequency.value = freq;
    osc.start();

    return osc;
}

function notePressed(event) {
    if(event.buttons & 1) {
        let dataset = event.target.dataset;

        if(!dataset['pressed']) {
            oscList[dataset['octave'][dataset['note']]] = playTone(dataset['frequency']);
            dataset['pressed'] = 'yes';
        }
    }
}

function noteReleased(event) {
    let dataset = event.target.dataset;

    if(dataset && dataset['pressed']) {
        oscList[dataset['octave'][dataset['note']]].stop();
        oscList[dataset['octave'][dataset['note']]] = null;
        delete dataset['pressed'];
    }
}

function changeVolume(event) {
    masterGainNode.gain.value = volumeControl.value;
}