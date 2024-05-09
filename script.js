// const keyboardInput = document.getElementById('keyboardInput');
// const inputToZH = document.getElementById('inputToZH');
// const ENLog = document.getElementById('ENLog');
// const ZHLog = document.getElementById('ZHLog');
const ZHchar = document.getElementById('ZHchar');
const bpmfDisplay = document.getElementById('bpmfDisplay');
const toneDisplay = document.getElementById('toneDisplay');
const letterFreq = document.getElementById('letterFreq');

const triangles = Array.from(document.getElementsByClassName('background'))
const chartWrap = document.getElementById('chartWrap');
const ZHwrap = document.getElementById('ZHwrap');

var toneErrors = {};
var typeErrors = {};
var logErrors = false;

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

const lordsPrayer = "我們在天上的父,願人都尊祢的名為聖,願祢的國降臨,願祢的旨意行在地上,如同行在天上.我們日用的飲食,今日賜給我們,免我們的債,如同我們免了人的債,不叫我們遇見試探,救我們脫離兇惡,因為國度,權柄,榮耀,全是祢的,直到永遠.阿們"
const LP1 = "我們在天上的父願人都尊祢的名為聖"

const bpmfData = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]

Chart.defaults.font.size = 24;
Chart.defaults.font.weight = "bold";
Chart.defaults.color = "black";
Chart.defaults.backgroundColor = "#ffffff";
Chart.defaults.scaleShowLables = false;
let queueCount
let limit


let chartSet = new Chart(letterFreq, {
        type: 'bar',
        data: {
          labels: bpmfChar,
          datasets: [{
            label: '# of',
            data: bpmfData,
            backgroundColor: "#0000ff",
            // borderWidth: 2,
            borderRadius: 4,
          }]
        },
        options: {
            plugins:{
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        display: false
                    },
                    grid: {
                        beginAtZero: true,
                        // display: false
                    },
                },
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

    // keyboardInput.innerHTML = input.toLowerCase();
    // inputToZH.innerHTML = ZHinput;

    // ENLog.innerHTML += input;
    // ZHLog.innerHTML += ZHinput;

})

function go(){
    
    if (ZHchar.innerHTML == '') {
        nextChar();
    }
}

function nextChar(){
    
    if(chartWrap.classList.contains('disappear')){
        triangles.forEach(tri =>{
            tri.classList.remove('disappear')
        })
    }

    
    success.currentTime = 0;
    success.play();
    
    console.log(queueCount, currentChar)

    if (queueCount < limit){

        currentChar = charQueue[queueCount];
        var N = zhuyin.findIndex(obj => obj.char == currentChar);

    } else {

        var N = Math.floor(Math.random() * 100) + 100;
        currentChar = zhuyin[N].char;

    }
    
    currentZhu = zhuyin[N].bpmf;
    currentTone = findTone(currentZhu);

    console.log(currentChar + " " + currentZhu + " " + currentTone)

    ZHchar.innerHTML = currentChar;

    insertZhuyin(currentZhu);

    queueCount ++;
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

        triangles[input - 1].classList.add('disappear');

        if (logErrors === true){
            
            if (Object.keys(toneErrors).includes(currentChar)){
                inputArray = toneErrors[currentChar];
                if (!inputArray.includes(input)){
                    inputArray.push(input);
                }
                
                console.log(inputArray);
            } else {
                inputArray = [input]
            }

            toneErrors[currentChar] = inputArray;
            console.log(toneErrors)

            
        }
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

function createQueue(arr) {
    queueCount = 0;
    limit = arr.length;
    
    charQueue = arr.split('');
    console.log(charQueue);
}

createQueue(LP1);

function toggleTriangles() {
    if (triangles[0].classList.contains('disappear')) {
        triangles.forEach(tri =>{
            tri.classList.remove('disappear')
        })

        chartWrap.classList.add('disappear')
        ZHwrap.classList.add('disappear')

    } else {
        triangles.forEach(tri =>{
            tri.classList.add('disappear')
        })
        
        chartWrap.classList.remove('disappear')
        ZHwrap.classList.remove('disappear')
    }
}

function toggleErrors(){
    logErrors = !logErrors;
    console.log(logErrors)
}