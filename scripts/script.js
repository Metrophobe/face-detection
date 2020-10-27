//Please ensure that the reletive path is correct 
const modelsPath = "./models";

//This is accessing video element via DOM 
const video = document.getElementById("video");

//This async function is used as a startup for the video and we usually put all our config here
async function startVideo() {
  //It is async because we need to AWAIT loading the files 
  //The loadFromUrl method is locating the model data (shard file and json manifest) from the 'models folder')
  await faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
    await faceapi.nets.faceExpressionNet.loadFromUri(modelsPath),
    //This requests the user to provide access to the camera 
    navigator.mediaDevices
      .getUserMedia({
        video: true, 
      })//Then a callback is invoked and the stream coming from our camera is directed towards the video element  
    .then((stream) => (video.srcObject = stream))
      //Since you never will know if this might fail (it's a stream!) it is good practice to catch it 
      .catch((err) => console.error(err));
}

//Then upon playing this async function ...
video.addEventListener("play", async () => {
  //creates a video canvas
  const videoCanvas = faceapi.createCanvasFromMedia(video);
  //we programmatically add an id to it 'response'
  videoCanvas.id = "response";
  //We then append insert it ... into the container element 
  document.getElementById("container").appendChild(videoCanvas);
  //At regular intervals ....
  setInterval(async () => {
    const displayValues = {
      width: video.videoWidth,
      height: video.videoHeight,
    };

    //We match videocanvas to the displayvalues object 
    faceapi.matchDimensions(videoCanvas, displayValues);

    //detections will invoke a chain of async events 
    //detect all faces from the video stream 
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      //provide landmarks for every face 
      .withFaceLandmarks()
      //and a descriptor for the expression
      .withFaceExpressions();

    //We can resize the results ... however i chose to keep them equal 
    const resizedDetections = await faceapi.resizeResults(
      detections,
      displayValues
    );
    //This DRAWS the actual items onto the canvas
    faceapi.draw.drawDetections(videoCanvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(videoCanvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(videoCanvas, resizedDetections);
    //every 100ms .... 
  }, 100);
});

//Let's go (on page load... )
window.addEventListener("DOMContentLoaded", () => {
  startVideo();
});
//end of code 
