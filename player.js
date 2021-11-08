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

var duration_song = 0;
var timestampradio = utcTimestamp();
var player;

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
    player.setVolume(this.value);
  }
}
function btnControl() {
  if(!player){
    return;
  }
  var n = player.isMuted() || true;
  if(n){
    control.innerText = '🔇';
    player.unMute();
  }else{
    control.innerText = '🔊';
    player.mute();
  }
}

function utcTimestamp() {
  const now = new Date;
  return Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
}

function handleInfo(doc) {
  const data = JSON.parse(doc.data().info);
  if(data.title == 'undefined'){
    return;
  }
  title.innerText = data.title;
  author.innerText = data.author;
  if(thumbnail.src != data.thumbnail){
    thumbnail.src = data.thumbnail;
  }
  timestampradio = data.timestamp;
  webpagetitle.innerText = '📻Radio v3 powered ⚡ with SimaBot v' +  data.version;
  duration_song = data.time;
  const videoId = new URL(data.url).searchParams.get('v');
  player.loadVideoById(videoId);
  player.seekTo(Math.floor(t()));
}

// Optimized code ended

function onPlay(e) {
  if (e.data != 1) {
    yt.className = 'novideo';
  }else{
    yt.className = 'video';
  }
  if(player){
    player.playVideo();
  }
}

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('ytp', {
    events: {
      'onReady': onPlay,
      'onStateChange': onPlay
    }
  });
}

function t() {
  return (utcTimestamp() - timestampradio) / 1000;
}

function setTimeElement() {
  time.innerText = '⌛' + toHHMMSS(Number(duration_song)) + ' / ' + toHHMMSS(Math.floor(t()));
}

function init() {
  var tag = document.createElement('script');
  start.onclick = function () {
    start.onclick = null;
    start.className = 'hide';
    getDoc(radioRef).then(handleInfo);
    onSnapshot(radioRef, handleInfo);
  }
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  setInterval(setTimeElement, 1000);
  setTimeElement();
  control.onclick = btnControl;
}

init();
