/**
 * buffer skip
 */
const interval = 1500

setInterval(() => {
  document.querySelectorAll("video").forEach( video => {
    if (video.paused && video.buffered.length) {
      video.currentTime = video.buffered.end(video.buffered.length - 1);
    }
  });
}, interval);