import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js';
import { doc, getDoc, getFirestore, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js';

var firebaseConfig = {
  apiKey: "AIzaSyBGZEtZ1-U1Sa3n0UsqxhaqNkdu16t-hMU",
  authDomain: "simabot-75622.firebaseapp.com",
  databaseURL: "https://simabot-75622-default-rtdb.firebaseio.com",
  projectId: "simabot-75622",
  storageBucket: "simabot-75622.appspot.com",
  messagingSenderId: "724453591705",
  appId: "1:724453591705:web:7cc29ed7054914101bc608"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const radioRef = doc(db, 'radio', 'radio');
var itag = 0;
const itagArray = [22, 18, 140, 249, 338, 250, 251, 327];
var duration_song = 0;
var timestampradio = utcTimestamp();

var e = document.body.getElementsByTagName("*");
var i = 0;
for (var i = 0; i < e.length; i++) {
  if(e[i].id != ""){
    const t = e[i].id;
    window[t] = document.getElementById(t);
  }
}
// DOM

function toHHMMSS(e) {
    var sec_num = parseInt(e, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    let out = '';
    if(hours != '00'){
      out += hours + ':';
    }
    out += minutes + ':' + seconds;
    return out;
}

volume.oninput = function () {
  if(player){
    player.volume = this.value / 100;
  }
}
function btnControl() {
  if(!player){
    return;
  }
  var n = player.muted || true;
  if(n){
    control.innerText = '🔇';
    player.muted = false;
  }else{
    control.innerText = '🔊';
    player.muted = true;
  }
}

function utcTimestamp() {
  const now = new Date;
  return Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
}

async function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleInfo(doc) {
  const data = doc.data().info;
  if(data.title == 'undefined'){
    return;
  }
  title.innerText = data.title;
  author.innerText = data.author;
  if(thumbnail.src != data.thumbnail){
    thumbnail.src = data.thumbnail;
  }
  timestampradio = data.timestamp;
  webpagetitle.innerText = '📻 Radio v5 (beta) powered ⚡ with SimaBot';
  duration_song = data.time;
  const videoId = new URL(data.url).searchParams.get('v');
  const domain = 'vid.puffyan.us';
  const url = 'https://' + domain + '/api/v1/videos/' + videoId;
  const urlVideo = 'https://' + domain + '/latest_version?id=' + videoId;
  // XHR request
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.addEventListener("load", function () {
    const response = JSON.parse(xhr.responseText);
    if(response.error){
      author.innerText = 'Error: ' + response.error;
      return;
    }
    const formatStreams = response.formatStreams;
    const itag = formatStreams[formatStreams.length - 1].itag;
    player.src = urlVideo + '&itag=' + itag;
    player.play();
    player.currentTime = t();
  });
  xhr.onerror = function () {
    console.log("Error");
  };
  xhr.send();
  // const url = 'https://' + domain + '/latest_version?id=' + videoId;
  player.poster = data.thumbnail;

  // for (let i = 0; i < itagArray.length; i++) {
  //   const itag = itagArray[i];
  //   try {
  //     
  //   } catch (error) {
  
  //   }
  //   while (player.readyState == 0) {
  //     await wait(500);
  //   }
  //   if(player.readyState > 3){
  //     player.currentTime = t();
  //     break;
  //   }
  // }
}

player.addEventListener('pause', (event) => {
  player.play();
});

// Optimized code ended

function t() {
  return (utcTimestamp() - timestampradio) / 1000;
}

function setTimeElement() {
  time.innerText = '⌛' + toHHMMSS(Number(duration_song)) + ' / ' + toHHMMSS(Math.floor(t()));
}

var timerControl = null;
var mousemove = true;

function init() {
  start.onclick = function () {
    start.onclick = null;
    start.className = 'hide';
    getDoc(radioRef).then(handleInfo);
    onSnapshot(radioRef, handleInfo);
  }
  setInterval(setTimeElement, 1000);
  window.onpointerdown = window.onpointermove = function () {
    mousemove = true;
    controlPanel.className = '';
  }
  timerControl = setInterval(function () {
    if (mousemove) {
      controlPanel.className = '';
    }else{
      controlPanel.className = 'hide';
    }
    mousemove = false;
  }, 1000);
  setTimeElement();
  control.onclick = btnControl;
}

init();
