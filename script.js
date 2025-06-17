// YouTube API 설정
const API_KEY = 'AIzaSyAlHlTzINPubn3CXk8hVZx2TI9YuT7ejoE';
// const videoIds = ["aW7D5S2ze3c", "S237-0sPKoQ", "n_f5mVyG7y4"]; // 영상 ID

// URL 파라미터로 카테고리 구분
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category');
}

let contentID, contentName;

const category = getCategoryFromUrl();
if (category === 'work') {
  contentID = [11, 12]; // 여기에 카테고리에 맞는 contentID 입력, 임시 설정
  contentName = ['미생', '스토브리그']; // 임시 설정
} else if (category === 'campus') {
  contentID = [10, 9];
  contentName = ['치즈인더트랩', '그해 우리는'];
}
let currentIndex = 0;

// 얼른 가자 출발해야해

// YouTube API 초기화
function initYouTubeAPI() {
  // YouTube IFrame API 로드
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// YouTube 플레이어 객체
let player;

// 콘텐츠 정보를 저장할 전역 변수
let currentContentInfo = {
  script: '',
  videoId: '',
  startTime: 0,
  endTime: 0,
  globalOrder: 0,
};

// 콘텐츠 정보를 가져오는 함수
async function fetchContentInfo(contentId) {
  try {
    const response = await axios.get(
      `http://${process.env.IP_ADDRESS}:${process.env.PORT}/api/contents/${contentId}`
    );
    const data = response.data.resource;

    // 전역 변수에 정보 저장
    currentContentInfo = {
      script: data.script,
      videoId: data.videoId,
      startTime: data.startTime,
      endTime: data.endTime,
      globalOrder: data.globalOrder,
    };

    updateScriptBox();

    // 콘텐츠 정보 표시 (예: alert 또는 DOM 요소에 표시)
    console.log('콘텐츠 정보:', currentContentInfo);
    return currentContentInfo;
  } catch (error) {
    console.error('콘텐츠 정보 가져오기 실패:', error);
    alert('콘텐츠 정보를 불러오지 못했습니다.');
    return null;
  }
}

// YouTube IFrame API 준비되면 호출되는 함수
async function onYouTubeIframeAPIReady() {
  try {
    // 먼저 콘텐츠 정보를 가져옵니다
    const contentInfo = await fetchContentInfo(contentID[0]);

    // 콘텐츠 정보를 기반으로 플레이어 초기화
    player = new YT.Player('youtubePlayer', {
      height: '360',
      width: '640',
      playerVars: {
        rel: 1,
        controls: 1,
        autoplay: 0,
        start: contentInfo.startTime,
        end: contentInfo.endTime,
        mute: 0,
        loop: 0,
        playsinline: 1,
        playlist: contentInfo.videoId,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  } catch (error) {
    console.error('플레이어 초기화 실패:', error);
    alert('영상 정보를 불러오는데 실패했습니다.');
  }
}

// 플레이어 준비 완료시 호출
function onPlayerReady(event) {
  console.log('Player is ready');
  // 이미 콘텐츠 정보를 가져왔으므로 여기서는 추가 작업이 필요 없습니다
}

// 플레이어 상태 변경시 호출
function onPlayerStateChange(event) {
  console.log('Player state changed:', event.data);
}

function updateContentName() {
  const contentNameElem = document.getElementById('contentName');
  if (contentNameElem) contentNameElem.innerText = contentName[currentIndex];
}

// 이전 비디오 재생
async function previousVideo() {
  if (currentIndex > 0) {
    currentIndex--;
    updateContentName();
    // 콘텐츠 정보 업데이트
    await fetchContentInfo(contentID[currentIndex]);
    player.cueVideoById({
      videoId: currentContentInfo.videoId,
      startSeconds: currentContentInfo.startTime,
      endSeconds: currentContentInfo.endTime,
      suggestedQuality: 'default',
    });
  }
}

// 다음 비디오 재생
async function nextVideo() {
  if (currentIndex < contentName.length - 1) {
    currentIndex++;
    updateContentName();
    // 콘텐츠 정보 업데이트
    await fetchContentInfo(contentID[currentIndex]);
    player.cueVideoById({
      videoId: currentContentInfo.videoId,
      startSeconds: currentContentInfo.startTime,
      endSeconds: currentContentInfo.endTime,
      suggestedQuality: 'default',
    });
  }
}

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let timerInterval;
let seconds = 0;
let recordedAudioUrl = null;
let isPlaying = false;
let recordedAudioBlob = null;

function toggleRecording() {
  const recordBtn = document.getElementById('recordBtn');
  const recordIcon = document.getElementById('recordIcon');
  const timer = document.getElementById('timer');
  if (!isRecording) {
    startRecording();
    isRecording = true;
    // UI 변경
    recordBtn.classList.add('recording');
    recordIcon.src = 'Images/stop.png'; // 네모 아이콘
    timer.textContent = '00:00';
    timer.style.display = 'inline';
    document.getElementById('playBtn').style.display = 'none';
    seconds = 0;
    timerInterval = setInterval(updateTimer, 1000);
  } else {
    stopRecording();
    isRecording = false;
    // UI 변경
    recordBtn.classList.remove('recording');
    recordIcon.src = 'Images/record.png'; // 마이크 아이콘
    timer.style.display = 'none';
    clearInterval(timerInterval);
  }
}

function updateTimer() {
  seconds++;
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${min}:${sec}`;
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
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        recordedAudioBlob = audioBlob; // 업로드하지 않고 변수에 저장만 함
        // 녹음된 파일을 재생할 수 있도록 URL 생성
        if (recordedAudioUrl) {
          URL.revokeObjectURL(recordedAudioUrl);
        }
        recordedAudioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayer').src = recordedAudioUrl;
        document.getElementById('playBtn').style.display = 'inline';
        // uploadAudio(audioBlob); // 호출하지 않음
      };
    })
    .catch((err) => {
      alert('마이크 권한이 필요합니다.');
    });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

function uploadAudio(audioBlob) {
  alert('전송완료');
  const formData = new FormData();
  formData.append('user_audio', audioBlob, 'recorded.wav');
  formData.append('globalOrder', currentContentInfo.globalOrder);

  axios
    .post(
      `http://${process.env.IP_ADDRESS}:${process.env.PORT}/api/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      }
    )
    .then((response) => {
      const data = response.data;
      if (!data) return;
      if (!data.success) {
        alert(
          '업로드 실패: ' + (data.message || '알 수 없는 오류가 발생했습니다.')
        );
        return;
      }

      // Report 토글 버튼 표시
      const reportToggle = document.querySelector('.report-toggle');
      if (reportToggle) reportToggle.classList.add('show');

      // updateReport 함수 호출
      if (data.data) {
        // user_text 추가
        data.data.user_text = currentContentInfo.script;
        updateReport(data.data);
      }
    })
    .catch((error) => {
      console.error('상세 에러:', error);
      if (error.response) {
        alert(
          '업로드 실패: ' +
            error.response.status +
            ' - ' +
            JSON.stringify(error.response.data)
        );
      } else if (error.request) {
        alert(
          '서버로부터 응답을 받지 못했습니다. 서버가 실행 중인지 확인해주세요.'
        );
      } else {
        alert('요청 설정 중 에러가 발생했습니다: ' + error.message);
      }
    });
}

// 녹음된 파일 재생
function playRecordedAudio() {
  const audio = document.getElementById('audioPlayer');
  if (audio.src) {
    audio.play();
  }
}

function replayVideo() {
  // const iframe = document.getElementById("youtubePlayer");
  // iframe.contentWindow.postMessage(
  //   '{"event":"command","func":"seekTo","args":[0, true]}',
  //   "*"
  // );
  player.loadVideoById({
    videoId: currentContentInfo.videoId,
    startSeconds: currentContentInfo.startTime,
    endSeconds: currentContentInfo.endTime,
    suggestedQuality: 'default',
  });
}

function getContentById(contentId) {
  axios
    .get(
      `http://${process.env.IP_ADDRESS}:${process.env.PORT}/api/contents/${contentId}`
    )
    .then((response) => {
      const data = response.data;
      console.log('콘텐츠 정보:', data);
      // 예시: alert로 확인
      alert(
        `스크립트: ${data.script}\n비디오ID: ${data.videoId}\n구간: ${data.startTime}~${data.endTime}`
      );
      // 또는 원하는 곳에 표시
      // document.getElementById("scriptBox").innerText = data.script;
    })
    .catch((error) => {
      console.error('콘텐츠 요청 실패:', error);
      alert('콘텐츠 정보를 불러오지 못했습니다.');
    });
}

function toggleReport(show) {
  const panel = document.getElementById('reportPanel');
  const container = document.querySelector('.container');
  const openBtn = document.querySelector('.report-toggle');
  const closeBtn = document.querySelector('.report-close');

  if (show) {
    panel.classList.add('wide');
    if (container) container.classList.add('shifted');
    panel.style.display = 'flex';
    openBtn.style.display = 'none';
    closeBtn.style.display = 'block';
  } else {
    panel.classList.remove('wide');
    if (container) container.classList.remove('shifted');
    panel.style.display = 'none';
    openBtn.style.display = 'block';
    closeBtn.style.display = 'none';
  }
}

function togglePlayPause() {
  const audio = document.getElementById('audioPlayer');
  const icon = document.getElementById('playPauseIcon');
  if (!audio.src) return;

  if (!isPlaying) {
    audio.play();
    icon.src = 'Images/pause.png'; // 일시정지 아이콘으로 변경
    isPlaying = true;
  } else {
    audio.pause();
    icon.src = 'Images/play.png'; // 다시 play 아이콘으로 변경
    isPlaying = false;
  }
}

// 오디오가 끝나면 play 아이콘으로 복귀
window.addEventListener('DOMContentLoaded', function () {
  const audio = document.getElementById('audioPlayer');
  if (audio) {
    audio.addEventListener('ended', function () {
      document.getElementById('playPauseIcon').src = 'Images/play.png';
      isPlaying = false;
    });
  }
  updateContentName();
  // report 패널을 기본적으로 숨김
  const reportPanel = document.getElementById('reportPanel');
  if (reportPanel) {
    reportPanel.style.display = 'none';
    reportPanel.classList.remove('wide');
  }
});

// 페이지 로드시 YouTube API 초기화
window.onload = function () {
  initYouTubeAPI();
};

function testGetContentById() {
  const input = document.getElementById('contentIdInput');
  const contentId = input.value.trim();
  if (!contentId) {
    alert('Contents ID를 입력하세요.');
    return;
  }
  axios
    .get(
      `http://${process.env.IP_ADDRESS}:${process.env.PORT}/api/contents/${contentId}`
    )
    .then((response) => {
      const data = response.data;
      if (data.success && data.resource) {
        const res = data.resource;
        // script, currentContentName 값 반영
        if (typeof script !== 'undefined') script = res.script;
        if (typeof currentContentName !== 'undefined')
          currentContentName = res.videoId;
        // h1, scriptBox 텍스트 즉시 갱신
        const contentNameElem = document.getElementById('contentName');
        if (contentNameElem) contentNameElem.innerText = res.videoId;
        const scriptBoxElem = document.getElementById('scriptBox');
        if (scriptBoxElem) scriptBoxElem.innerText = res.script;
        alert(
          `스크립트: ${res.script}\n비디오ID: ${res.videoId}\n구간: ${res.startTime}~${res.endTime}`
        );
      } else {
        alert('콘텐츠 정보를 불러오지 못했습니다.\n' + (data.message || ''));
      }
    })
    .catch((error) => {
      console.error('콘텐츠 요청 실패:', error);
      alert('콘텐츠 정보를 불러오지 못했습니다.');
    });
}

window.addEventListener('DOMContentLoaded', function () {
  // h1 텍스트 설정
  const contentNameElem = document.getElementById('contentName');
  if (contentNameElem && typeof currentContentName !== 'undefined')
    contentNameElem.innerText = currentContentName;
  // script-box 텍스트 설정
  const scriptBoxElem = document.getElementById('scriptBox');
  if (scriptBoxElem && typeof script !== 'undefined')
    scriptBoxElem.innerText = script;
});

function updateScriptBox() {
  const scriptBoxElem = document.getElementById('scriptBox');
  if (scriptBoxElem) scriptBoxElem.innerText = currentContentInfo.script;
}

window.addEventListener('DOMContentLoaded', function () {
  updateContentName();
  initYouTubeAPI();
});

function reportVideo() {
  if (recordedAudioBlob) {
    uploadAudio(recordedAudioBlob);
  } else {
    alert('녹음된 파일이 없습니다. 먼저 녹음을 완료해주세요.');
  }
}

// 도넛 그래프 점수 적용 함수
function setDonutScore(selector, score) {
  const el = document.querySelector(selector);
  if (el) {
    el.style.setProperty('--score', score);
    el.querySelector('span').textContent = score;
  }
}

// 예시: 점수 적용 (실제 데이터로 대체 가능)
window.addEventListener('DOMContentLoaded', function () {
  setDonutScore('#pitchScore', 0);
  setDonutScore('#durationScore', 0);
  setDonutScore('#intensityScore', 0);
  setDonutScore('#overallScore', 0);
});

function updateReport(data) {
  // Update scores
  document
    .getElementById('pitchScore')
    .style.setProperty('--score', data.pitch.score);
  document.getElementById('pitchScore').querySelector('span').textContent =
    data.pitch.score;

  document
    .getElementById('durationScore')
    .style.setProperty('--score', data.duration.score);
  document.getElementById('durationScore').querySelector('span').textContent =
    data.duration.score;

  document
    .getElementById('intensityScore')
    .style.setProperty('--score', data.intensity.score);
  document.getElementById('intensityScore').querySelector('span').textContent =
    data.intensity.score;

  // Update feedback
  const durationFeedback = document.getElementById('durationFeedback');
  durationFeedback.innerHTML = data.duration.feedback
    .map((fb) => `<div class="feedback-item">${fb}</div>`)
    .join('');

  const intensityFeedback = document.getElementById('intensityFeedback');
  intensityFeedback.innerHTML = data.intensity.feedback
    .map((fb) => `<div class="feedback-item">${fb}</div>`)
    .join('');

  // Update user text
  document.getElementById('userText').textContent = data.user_text || '';

  // Update pitch image
  if (data.image) {
    let base64Image = data.image;
    if (!base64Image.startsWith('data:image')) {
      base64Image = 'data:image/png;base64,' + base64Image;
    }
    const pitchImg = document.querySelector('.metric-img[alt="Pitch Result"]');
    if (pitchImg) pitchImg.src = base64Image;
  }

  // Show report panel
  document.getElementById('reportPanel').style.display = 'flex';
  document.getElementById('reportBtn').disabled = false;
}

function showEnlargedImage(src) {
  const overlay = document.getElementById('imageOverlay');
  const enlargedImg = document.getElementById('enlargedImage');

  enlargedImg.src = src;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // 스크롤 방지
}

function hideEnlargedImage() {
  const overlay = document.getElementById('imageOverlay');
  overlay.style.display = 'none';
  document.body.style.overflow = ''; // 스크롤 복원
}

// ESC 키로도 이미지 닫기 가능
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    hideEnlargedImage();
  }
});
