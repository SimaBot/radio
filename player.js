var db = firebase.firestore();
var duration_song = 0;
var timestampradio = utcTimestamp();
window.cPlays = '';

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

var player;

function onPlayerReady(event) {
  try {
    event.target.playVideo();
  } catch (e) {

  }
}
function onPlayerStateChange(e) {
  if (e.data == -1) {
    ytpel.style.display = 'none';
    thumbnail.style.display = 'block';
  }else{
    ytpel.style.display = 'block';
    thumbnail.style.display = 'none';
  }
  try {
    player.playVideo();
  } catch (e) {

  }
  firstPlay();
}
function firstPlay() {
  if(player.getVideoUrl() == 'https://www.youtube.com/watch'){
    player.loadVideoById(window.cPlays);
  }
}
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytp', {
    videoId: window.cPlays,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  window.onclick = function (e) {
    player.playVideo();
    sync();
  }
}

function utcTimestamp() {
  const now = new Date;
  return Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
}

function t() {
  return (utcTimestamp() - timestampradio) / 1000;
}

function sync() {
  if(player){
    player.seekTo(Math.floor(t()));
  }
}
volume.oninput = function () {
  player.setVolume(this.value);
}
function handleInfo() {
  db.collection("radio").doc("radio")
    .onSnapshot((doc) => {
        const data = JSON.parse(doc.data().info);
        if(data.title != 'undefined'){
          title.innerText = data.title;
          author.innerText = data.author;
          if(thumbnail.src != data.thumbnail){
            thumbnail.src = data.thumbnail;
          }
          timestampradio = data.timestamp;
          webpagetitle.innerText = '📻Radio powered ⚡ with SimaBot v' +  data.version;
          duration_song = data.time;
          const videoId = new URL(data.url).searchParams.get('v');
          window.cPlays = videoId;
          if(player){
            if(typeof player.loadVideoById != 'undefined'){
              player.loadVideoById(videoId);
              sync();
            }
          }
        }
    });
}
includeIdE = function(){
  var e = document.body.getElementsByTagName("*");
  var i = 0;
  for (var i = 0; i < e.length; i++) {
    if(e[i].id != ""){
      const t = e[i].id;
      window[t] = document.getElementById(t);
    }
  }
}
function setTimeElement() {
  time.innerText = '⌛' + toHHMMSS(Number(duration_song)) + ' / ' + toHHMMSS(Math.floor(t()));
}
function init() {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  setInterval(setTimeElement, 1000);
  setTimeElement();
  function btnControl() {
    var n = true;
    if(player){
      n = player.isMuted();
    }else{
      n = true;
    }
    if(n){
      control.innerText = '🔇';
      if(player){
        player.unMute();
      }
    }else{
      control.innerText = '🔊';
      if(player){
        player.mute();
      }
    }
  }
  btnControl();
  control.onclick = function () {
    btnControl();
  }
  includeIdE();
  handleInfo()
}
init();
