function previousVideo() {
  alert("Previous video clicked (to be implemented)");
}

function nextVideo() {
  alert("Next video clicked (to be implemented)");
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
