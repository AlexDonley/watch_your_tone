keyboardInput = document.getElementById('keyboardInput');
inputToZH = document.getElementById('inputToZH');
ENLog = document.getElementById('ENLog');
ZHLog = document.getElementById('ZHLog');
ZHchar = document.getElementById('ZHchar');
bpmfDisplay = document.getElementById('bpmfDisplay');
toneDisplay = document.getElementById('toneDisplay');

let typingLength;
nextType = 0

//var data = hz-bpmf.csv.toObjects(csv);

ZHkeyBindings = {
    '1': 'ㄅ',
    'q': 'ㄆ',
    'a': 'ㄇ',
    'z': 'ㄈ',
    '2': 'ㄉ',
    'w': 'ㄊ',
    's': 'ㄋ',
    'x': 'ㄌ',
    '3': 'ˇ',
    'e': 'ㄍ',
    'd': 'ㄎ',
    'c': 'ㄏ',
    '4': 'ˋ',
    'r': 'ㄐ',
    'f': 'ㄑ',
    'v': 'ㄒ',
    '5': 'ㄓ',
    't': 'ㄔ',
    'g': 'ㄕ',
    'b': 'ㄖ',
    '6': 'ˊ',
    'y': 'ㄗ',
    'h': 'ㄘ',
    'n': 'ㄙ',
    '7': '˙',
    'u': '一',
    'j': 'ㄨ',
    'm': 'ㄩ',
    '8': 'ㄚ',
    'i': 'ㄛ',
    'k': 'ㄜ',
    ',': 'ㄝ',
    '9': 'ㄞ',
    'o': 'ㄟ',
    'l': 'ㄠ',
    '.': 'ㄡ',
    '0': 'ㄢ',
    'p': 'ㄣ',
    ';': 'ㄤ',
    '?': 'ㄥ',
    '-': 'ㄦ',
    ' ': ' '
}

console.log(ZHkeyBindings['1'])

let zhuyin
let example
let N;
let currentChar
let currentZhu
let currentTone
let charQueue = []

let success = new Audio("sfx/gong.wav");
let failure = new Audio("sfx/ohno.wav");

function loadJSON(){
    fetch('./JSON/hz-bpmf.json')
    .then(res => {
        if (res.ok) {
            console.log('SUCCESS');
        } else {
            console.log('FAILURE')
        }
        return res.json()
    })
    .then(data => {
        zhuyin = data;
        console.log(data)
        example = zhuyin.findIndex(item => item.char === "不")
    })
    .catch(error => console.log('ERROR'))

}

loadJSON();

window.addEventListener('keydown', (ev) =>{
    input = ev.key.toLowerCase();
    ZHinput = ZHkeyBindings[input]

    keyboardInput.innerHTML = input.toLowerCase();
    inputToZH.innerHTML = ZHinput;

    ENLog.innerHTML += input;
    ZHLog.innerHTML += ZHinput;

})

function go(){
    
    if (ZHchar.innerHTML == '') {
        nextChar();
    }
}

function nextChar(){
    success.currentTime = 0;
    success.play();
    
    N = Math.floor(Math.random() * 100);
    currentChar = zhuyin[N].char;
    currentZhu = zhuyin[N].bpmf;
    currentTone = findTone(currentZhu);

    console.log(currentChar + " " + currentZhu + " " + currentTone)

    ZHchar.innerHTML = currentChar;

    insertZhuyin(currentZhu);
}

function insertZhuyin(zhu) {
    zhuArray = zhu.split('');
    bpmfDisplay.innerHTML = '';
    toneDisplay.innerHTML = '';
    
    offset = 0;
    
    if (currentTone > 1){
        const newSpan = document.createElement('span');
        newSpan.setAttribute('id', ("span" + (zhuArray.length - 1)))
        newSpan.innerHTML = zhuArray[(zhuArray.length - 1)];
        
        toneDisplay.appendChild(newSpan);

        typingLength = zhu.length;
        offset = 1;
    } else {
        typingLength = zhu.length + 1;
    }

    for (let n = 0; n < zhuArray.length - offset; n++) {
        const newSpan = document.createElement('span');
        newSpan.setAttribute('id', ("span" + n))
        newSpan.innerText = zhuArray[n];
        bpmfDisplay.appendChild(newSpan);
    }
}

function findTone(str){
    if (str.includes('ˊ')) {
        return 2;
    } else if (str.includes('ˇ')) {
        return 3;
    } else if (str.includes('ˋ')) {
        return 4;
    } else if (str.includes('˙')) {
        return 5;
    } else {
        return 1;
    }
}

function checkTone(input){
        
    if (input == currentTone){
        nextChar();
    } else {
        failure.currentTime = 0;
        failure.play();
    }
}

window.addEventListener('keydown', (ev) =>{
    //console.log(ev)
    if (ev.key == 'ArrowUp' || ev.key == 'PageUp'){
        checkTone(1);
    } else if (ev.key == 'ArrowDown'|| ev.key == 'PageDown'){
        checkTone(3);
    } else if (ev.key == 'ArrowLeft'){
        checkTone(4);
    } else if (ev.key == 'ArrowRight'){
        checkTone(2);
    } else if (ev.key == 'Enter') {
        checkTone(5);
    } else {
        updateTyping(ev.key)
    }
})

function updateTyping(inp) {
    
    if (currentTone == 1 && nextType == typingLength - 1) {
        specificLetter = ' '        
    } else {
        letterSpan = document.getElementById('span' + nextType);
        specificLetter = letterSpan.innerText;
    }
    
    console.log(specificLetter);
    
    if (ZHkeyBindings[inp] == specificLetter) {
        letterSpan.classList.add('complete')
        if (nextType < typingLength - 1) {
            nextType ++;
        } else {
            
            nextType = 0;

            waitForNext = setTimeout(nextChar(), 500);
        }
    }
}