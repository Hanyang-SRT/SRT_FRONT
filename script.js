// YouTube API 설정
const API_KEY = "AIzaSyAlHlTzINPubn3CXk8hVZx2TI9YuT7ejoE";
const videoIds = ["aW7D5S2ze3c", "S237-0sPKoQ", "n_f5mVyG7y4"]; // 영상 ID
const globalOrder = 9; // video 순서
const videoID = null; //
const startTime = 0;
const endTime = 0;

// 얼른 가자 출발해야해

// YouTube API 초기화
function initYouTubeAPI() {
  // YouTube IFrame API 로드
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// YouTube 플레이어 객체
let player;

// YouTube IFrame API 준비되면 호출되는 함수
function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtubePlayer", {
    height: "360",
    width: "640",
    playerVars: {
      rel: 1,
      controls: 1,
      autoplay: 0,
      start: 30,
      end: 31,
      mute: 0,
      loop: 0,
      playsinline: 1,
      playlist: videoIds[0],
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// 플레이어 준비 완료시 호출
function onPlayerReady(event) {
  console.log("Player is ready");
}

// 플레이어 상태 변경시 호출
function onPlayerStateChange(event) {
  console.log("Player state changed:", event.data);
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

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let timerInterval;
let seconds = 0;
let recordedAudioUrl = null;
let isPlaying = false;

function toggleRecording() {
  const recordBtn = document.getElementById("recordBtn");
  const recordIcon = document.getElementById("recordIcon");
  const timer = document.getElementById("timer");
  if (!isRecording) {
    startRecording();
    isRecording = true;
    // UI 변경
    recordBtn.classList.add("recording");
    recordIcon.src = "Images/stop.png"; // 네모 아이콘
    timer.textContent = "00:00";
    timer.style.display = "inline";
    document.getElementById("playBtn").style.display = "none";
    seconds = 0;
    timerInterval = setInterval(updateTimer, 1000);
  } else {
    stopRecording();
    isRecording = false;
    // UI 변경
    recordBtn.classList.remove("recording");
    recordIcon.src = "Images/record.png"; // 마이크 아이콘
    timer.style.display = "none";
    clearInterval(timerInterval);
  }
}

function updateTimer() {
  seconds++;
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${min}:${sec}`;
}

function startRecording() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        // 녹음된 파일을 재생할 수 있도록 URL 생성
        if (recordedAudioUrl) {
          URL.revokeObjectURL(recordedAudioUrl);
        }
        recordedAudioUrl = URL.createObjectURL(audioBlob);
        document.getElementById("audioPlayer").src = recordedAudioUrl;
        document.getElementById("playBtn").style.display = "inline";
        uploadAudio(audioBlob);
      };
    })
    .catch((err) => {
      alert("마이크 권한이 필요합니다.");
    });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

function uploadAudio(audioBlob) {
  const formData = new FormData();
  formData.append("user_audio", audioBlob, "recorded.wav");
  formData.append("globalOrder", globalOrder);
  axios
    .post("http://15.165.186.129:3000/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((response) => {
      alert("업로드 성공: " + JSON.stringify(response.data));
    })
    .catch((error) => {
      console.error("상세 에러:", error);
      if (error.response) {
        // 서버가 응답을 반환한 경우
        console.error("응답 데이터:", error.response.data);
        console.error("응답 상태:", error.response.status);
        console.error("응답 헤더:", error.response.headers);
        alert(
          "업로드 실패: " +
            error.response.status +
            " - " +
            JSON.stringify(error.response.data)
        );
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error("요청 정보:", error.request);
        alert(
          "서버로부터 응답을 받지 못했습니다. 서버가 실행 중인지 확인해주세요."
        );
      } else {
        // 요청 설정 중 에러가 발생한 경우
        console.error("에러 메시지:", error.message);
        alert("요청 설정 중 에러가 발생했습니다: " + error.message);
      }
    });
}

// 녹음된 파일 재생
function playRecordedAudio() {
  const audio = document.getElementById("audioPlayer");
  if (audio.src) {
    audio.play();
  }
}

function replayVideo() {
  const iframe = document.getElementById("youtubePlayer");
  iframe.contentWindow.postMessage(
    '{"event":"command","func":"seekTo","args":[0, true]}',
    "*"
  );
}

function getContentById(contentId) {
  axios
    .get(`http://15.165.186.129:3000/api/contents/${contentId}`)
    .then((response) => {
      const data = response.data;
      console.log("콘텐츠 정보:", data);
      // 예시: alert로 확인
      alert(
        `스크립트: ${data.script}\n비디오ID: ${data.videoId}\n구간: ${data.startTime}~${data.endTime}`
      );
      // 또는 원하는 곳에 표시
      // document.getElementById("scriptBox").innerText = data.script;
    })
    .catch((error) => {
      console.error("콘텐츠 요청 실패:", error);
      alert("콘텐츠 정보를 불러오지 못했습니다.");
    });
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

function togglePlayPause() {
  const audio = document.getElementById("audioPlayer");
  const icon = document.getElementById("playPauseIcon");
  if (!audio.src) return;

  if (!isPlaying) {
    audio.play();
    icon.src = "Images/pause.png"; // 일시정지 아이콘으로 변경
    isPlaying = true;
  } else {
    audio.pause();
    icon.src = "Images/play.png"; // 다시 play 아이콘으로 변경
    isPlaying = false;
  }
}

// 오디오가 끝나면 play 아이콘으로 복귀
window.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audioPlayer");
  if (audio) {
    audio.addEventListener("ended", function () {
      document.getElementById("playPauseIcon").src = "Images/play.png";
      isPlaying = false;
    });
  }
});

// 페이지 로드시 YouTube API 초기화
window.onload = function () {
  initYouTubeAPI();
};

function testGetContentById() {
  const input = document.getElementById("contentIdInput");
  const contentId = input.value.trim();
  if (!contentId) {
    alert("Contents ID를 입력하세요.");
    return;
  }
  axios
    .get(`http://15.165.186.129:3000/api/contents/${contentId}`)
    .then((response) => {
      const data = response.data.resource;
      alert(
        `스크립트: ${data.script}\n비디오ID: ${data.videoId}\n구간: ${data.startTime}~${data.endTime}`
      );
    })
    .catch((error) => {
      console.error("콘텐츠 요청 실패:", error);
      alert("콘텐츠 정보를 불러오지 못했습니다.");
    });
}
