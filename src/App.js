/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetector from '@tensorflow-models/face-landmarks-detection';
import Webcam from 'react-webcam';
import { useEffect, useRef } from 'react';
import {drawMesh} from './utils';

function App() {
  const webcamRef = useRef();
  const canvasRef = useRef();
  const videoRef = useRef();


  const runFaceLandmarksDetector = async () => {
    console.log("here");
    const model = await faceLandmarksDetector.load(
      faceLandmarksDetector.SupportedPackages.mediapipeFacemesh
      )
      setInterval(() => {
        detectFace(model);
      }, 10)
  }

  const detectFace = async (model) => {
    if(
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null && 
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;


      // const video = webcamRef.current.video;

      const face = await model.estimateFaces({
        input: video
      })

      // console.log(face);
      drawMesh(face, canvasRef.current.getContext("2d"));

    } else {
      console.log('feed error');
    }
  }


  useEffect(runFaceLandmarksDetector, []);

  return (
    <div className="App">
        {/* <video src="" ref={videoRef}  id="video" autoPlay={true}></video> */}
        <canvas height="400px" width="600px" ref={canvasRef} id="canvas" ></canvas>
        <Webcam ref={webcamRef} id="webcam" />
    </div>
  );
}

export default App;
