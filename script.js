// Global constants
const cluePauseTime = 300;
const nextClueWaitTime = 1000;
const pattern = [0,0];

// Global variables
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var clueHoldTime = 1000; // How long to hold each clue's light/sound
var mistakes = 3;

function startGame() {
  // Initialize game variables
  for(let i = 0; i < pattern.length; i++) {
    pattern[i] = Math.floor(Math.random() * (6 - 1 + 1) + 1);
  }
  progress = 0;
  mistakes = 3;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

const freqMap = {
  1: 200,
  2: 300,
  3: 400,
  4: 500,
  5: 600,
  6: 700
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn) {
  if(gamePlaying) {
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  clueHoldTime = 1000; // How long to hold each clue's light/sound
  let delay = nextClueWaitTime;
  for(let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + "in" + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i])
    delay += clueHoldTime
    delay += cluePauseTime;
    clueHoldTime -= 100;
  }
}

function loseGame() {
  stopGame();
  alert("Game over. You lost");
}

function winGame() {
  stopGame();
  alert("Game over! You won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
  }else{
    if(mistakes <= 0) {
      loseGame();
    } else {
      mistakes--;
      alert("Bad guess! Chances remaining for error: " + mistakes + "\nChoose the next in pattern");
    }
  }
}  