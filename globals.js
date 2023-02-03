////////////////
//globals
////////////////

//primary elements
const canvas = document.createElement('canvas');
const mainDiv = document.getElementsByTagName('main')[0]
mainDiv.appendChild(canvas)
const ctx = canvas.getContext("2d");
const theMenuDiv = document.getElementById('themenu')
const difficultyDiv = document.getElementById('difficulty')
const gametypeDiv = document.getElementById('gametype')

difficultyDiv.onchange = ()=>{  
    difficulty = difficultyDiv.selectedIndex
    //todo load grid for each difficulty or gen new, keep score for each combo
    genGrid()
}

gametypeDiv.onchange = ()=>{
    var ind = gametypeDiv.selectedIndex
    typeOfGoal = typesOfGoals[ind]
    typOfGoalNum = ind
    console.log("game type changed", typeOfGoal)
    //todo load grid for each difficulty or gen new, keep score for each combo
    genGrid();
}
//universal constants

const startTime = new Date();

var isTouchDevice = false;
var isMobileDevice = false;

if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) 
    {isMobileDevice = true ;}
    
if(isMobileDevice) {
    console.log('MOBILE DETECTED')
    canvas.style.width = "100%"
    canvas.style.height = "100%"
}

//universal variables
var dvp, ar, brect, wWidth, wHeight, cWidth, cHeight, mX, mY, mdX, mdY, muX, muY;
var mouseDownCan = false; var verticalOrien = false;
var firstFrame = true; 
var clastLapse = 0; var dlastLapse = 0;
var time = 0;
const marg = 10;
const gameRec = [marg, marg,100,100]
var rat = 16/9;

var un_mute = document.getElementById('un-mute');
var muteimages = document.getElementsByClassName('muteimage')


un_mute.onclick = function() {
    console.log('toggling sound')
    if(AudioContext){
        console.log('audiocontext detected')
        if (audioContext.state === "suspended") {
            console.log('enabling audio')
            audioContext.resume();
        }
        if(!audioAllowed){
            audioAllowed = true;
            pop_high.play()
        }else{
            audioAllowed = false;
        }
    }
};


let root = document.documentElement;
