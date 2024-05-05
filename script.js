const keyboardInput = document.getElementById('keyboardInput');
const inputToZH = document.getElementById('inputToZH');
const ENLog = document.getElementById('ENLog');
const ZHLog = document.getElementById('ZHLog');
const ZHchar = document.getElementById('ZHchar');
const bpmfDisplay = document.getElementById('bpmfDisplay');
const toneDisplay = document.getElementById('toneDisplay');
const letterFreq = document.getElementById('letterFreq')

const bpmfChar = [
    'ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 
    'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 
    'ㄍ', 'ㄎ', 'ㄏ', 
    'ㄐ', 'ㄑ', 'ㄒ', 
    'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 
    'ㄗ', 'ㄘ', 'ㄙ', 
    '一', 'ㄨ', 'ㄩ', 
    'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 
    'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 
    'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 
    'ㄦ'
  ]

const bpmfData = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]

let chartSet = new Chart(letterFreq, {
        type: 'bar',
        data: {
          labels: bpmfChar,
          datasets: [{
            label: '# of',
            data: bpmfData,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          maintainAspectRatio: false,
        }
});

function UpdateChart(dat) {
    let newData = dat;
    //Changing Chart object data
    chartSet.data.datasets[0].data = newData;
    //Updating the chart
    chartSet.update();
 }

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
    '/': 'ㄥ',
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

let success = new Audio("sfx/ding3.wav");
let correct = new Audio("sfx/click2.wav")
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
        correct.currentTime = 0;
        correct.play();

        if(bpmfChar.includes(ZHkeyBindings[inp])){
            charIndex = bpmfChar.indexOf(ZHkeyBindings[inp]);
            currentCount = bpmfData[charIndex]

            currentCount++

            bpmfData.splice(charIndex, 1, currentCount)

            UpdateChart(bpmfData);
        }

        if (nextType < typingLength - 1) {
            nextType ++;
        } else {
            
            nextType = 0;

            waitForNext = setTimeout(nextChar(), 500);
        }
    }
}