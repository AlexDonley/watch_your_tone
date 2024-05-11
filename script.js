const ZHchar = document.getElementById('ZHchar');
const bpmfDisplay = document.getElementById('bpmfDisplay');
const toneDisplay = document.getElementById('toneDisplay');
const letterFreq = document.getElementById('letterFreq');

const triangles = Array.from(document.getElementsByClassName('background'))
const onloads = Array.from(document.getElementsByClassName('onload'))
const chartWrap = document.getElementById('chartWrap');
const ZHwrap = document.getElementById('ZHwrap');
const userText = document.getElementById('userText')
const menu = document.getElementById('menu')

var toneErrors = {};
var typeErrors = {};
var logErrors = true;

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
const memeText = "世界八大不可相信英國研究中國製造台灣報導南韓起源北韓宣布美國力挺菲國道歉大馬選舉"

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

let zhuyinKeys;
let chineseChars = [];

let N;
let currentChar;
let currentZhu;
let currentTone;
let charQueue = [];

let success = new Audio("sfx/ding3.wav");
let correct = new Audio("sfx/click2.wav")
let failure = new Audio("sfx/ohno.wav");

let calibrate = false;
let calibrateCount = 1;

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
        zhuyinKeys = data;
        // chineseChars = Object.keys(data).map(key => data[key]);

        for (var key in data) {
            chineseChars.push(data[key].char);
        }

        console.log(chineseChars)
    })
    .catch(error => console.log('ERROR'))

}

loadJSON();

function go(){
    console.log("go")
    
    if(ZHchar.classList.contains('disappear')) {
        ZHchar.classList.remove('disappear')
    }

    if (ZHchar.innerHTML == '') {
        userInput = userText.value;
        createQueue(userInput);
        userText.classList.add('disappear');
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
        var N = zhuyinKeys.findIndex(obj => obj.char == currentChar);

    } else {

        var N = Math.floor(Math.random() * 100) + 100;
        currentChar = zhuyinKeys[N].char;

    }
    
    currentZhu = zhuyinKeys[N].bpmf[0];
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
    
    if(calibrate === false) {
        if (calibrateCount == input) {
            
            onloads[input - 1].classList.add('disappear');
            onloads[input - 1].classList.remove('onload');

            let chord = new Audio("sfx/" + input + ".wav");
            chord.play();

            calibrateCount++;
        } 
        if (calibrateCount > 5) {
            ZHchar.innerHTML = '';
            calibrate = true;
            menu.classList.remove('disappear');
        }

    } else {
        if (input == currentTone){
            nextChar();
            
        } else {
            failure.currentTime = 0;
            failure.play();

            if (input < 5) {
                triangles[input - 1].classList.add('disappear');
            }

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
}

window.addEventListener('keydown', (ev) =>{
    //console.log(ev)
    input = ev.key.toLowerCase();
    ZHinput = ZHkeyBindings[input]

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

function createQueue(str) {
    queueCount = 0;
    limit = str.length;
    
    charQueue = str.split('');

    for (var n = 0; n < charQueue.length; n++){
        if (!chineseChars.includes(charQueue[n])){
            charQueue.splice(n, 1);
            n--
        }
    }

    console.log(charQueue);
}

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