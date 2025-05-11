// YouTube API 설정
const API_KEY = process.env.VITE_YOUTUBE_API_KEY;
const videoIds = ['aW7D5S2ze3c']; // 비디오 ID를 저장할 배열

// YouTube API 초기화
function initYouTubeAPI() {
  if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
    onYouTubeIframeAPIReady();
  }
}

// YouTube 플레이어 객체
let player;

// YouTube IFrame API 준비되면 호출되는 함수
function onYouTubeIframeAPIReady() {
  if (player) return; // 이미 플레이어가 초기화되었다면 리턴

  player = new YT.Player('youtubePlayer', {
    height: '360',
    width: '640',
    videoId: videoIds[0],
    playerVars: {
      'playsinline': 1,
      'controls': 1,
      'rel': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

// 플레이어 준비 완료시 호출
function onPlayerReady(event) {
  console.log('Player is ready');
  event.target.playVideo();
}

// 플레이어 상태 변경시 호출
function onPlayerStateChange(event) {
  console.log('Player state changed:', event.data);
}

// 플레이어 에러 발생시 호출
function onPlayerError(event) {
  console.error('Player error:', event.data);
}

// 이전 비디오 재생
function previousVideo() {
  const currentIndex = videoIds.indexOf(player.getVideoData().video_id);
  if (currentIndex > 0) {
    player.loadVideoById(videoIds[currentIndex - 1]);
  }
}

// 다음 비디오 재생
function nextVideo() {
  const currentIndex = videoIds.indexOf(player.getVideoData().video_id);
  if (currentIndex < videoIds.length - 1) {
    player.loadVideoById(videoIds[currentIndex + 1]);
  }
}

function startRecording() {
  alert("Voice recording started (Whisper integration to be implemented)");
}

function replayVideo() {
  const iframe = document.getElementById("youtubePlayer");
  iframe.contentWindow.postMessage(
    '{"event":"command","func":"seekTo","args":[0, true]}',
    "*"
  );
}

function toggleReport(show) {
  const panel = document.getElementById("reportPanel");
  const openBtn = document.querySelector(".report-toggle");
  const closeBtn = document.querySelector(".report-close");

  if (show) {
    panel.style.display = "flex";
    openBtn.style.display = "none";
    closeBtn.style.display = "block";
  } else {
    panel.style.display = "none";
    openBtn.style.display = "block";
    closeBtn.style.display = "none";
  }
}

// 페이지 로드시 YouTube API 초기화
window.onload = function() {
  initYouTubeAPI();
};
