const modelsPath = "../models";

const video = document.getElementById("video");

async function startVideo() {
  await faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
    await faceapi.nets.faceExpressionNet.loadFromUri(modelsPath),
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => (video.srcObject = stream))
      .catch((err) => console.error(err));
}

video.addEventListener("play", async () => {
  const videoCanvas = faceapi.createCanvasFromMedia(video);
  videoCanvas.id = "response";
  document.getElementById("container").appendChild(videoCanvas);

  setInterval(async () => {
    const displayValues = {
      width: video.videoWidth,
      height: video.videoHeight,
    };

    faceapi.matchDimensions(videoCanvas, displayValues);

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const resizedDetections = await faceapi.resizeResults(
      detections,
      displayValues
    );
    faceapi.draw.drawDetections(videoCanvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(videoCanvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(videoCanvas, resizedDetections);
  }, 100);
});

window.addEventListener("DOMContentLoaded", () => {
  startVideo();
});
