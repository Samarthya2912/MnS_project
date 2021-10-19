/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetector from '@tensorflow-models/face-landmarks-detection';
import Webcam from 'react-webcam';
import { createContext, useEffect, useRef } from 'react';
import {drawMesh} from './utils';

const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',null]

function App() {
  const webcamRef = useRef();
  const canvasRef = useRef();
  const videoRef = useRef();
  let letterIndex = 0;


  const runFaceLandmarksDetector = async () => {
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
      const ctx = canvasRef.current.getContext("2d");
      // ctx.drawImage(video, 0,0);
      drawMesh(face, ctx);
      // document.querySelector('h1').innerHTML = face[0].scaledMesh[14][1] - face[0].scaledMesh[13][1] > 10? "mouth is open":"mouth is close";
      
      if(face.length > 0) {
        if(face[0].scaledMesh[374][1] - face[0].scaledMesh[386][1] < 4) {
          document.querySelector('#eyestatus').innerHTML = "eye is close";
          if(letters[letterIndex] !== null)
          document.querySelector('#pad').innerHTML += letters[letterIndex];
          letterIndex = 26;
        } else {
          document.querySelector('#eyestatus').innerHTML = "eye is open";
          // document.getElementById(`letter_${letterIndex}`).style.color = "black";
        }
      }      
    } else {
      console.log('feed error');
    }
  }
  
  
  useEffect(runFaceLandmarksDetector, []);
  useEffect(() => {
    setInterval(() => {
      document.getElementById(`letter_${letterIndex}`).style.color = "black";
      
      if(letterIndex === 26) letterIndex = 0
      else letterIndex++;
      
      document.getElementById(`letter_${letterIndex}`).style.color = "red";
    }, 500)
  }, [])

  return (
    <div className="App">
        <div style={{ display: 'flex', alignContent: 'center' }}>
          <canvas height="400" width="600" ref={canvasRef} id="canvas" ></canvas>
          <Webcam ref={webcamRef} id="webcam"/>
        </div>
        <h1 id="eyestatus">Eyestatus</h1>
        <div className="letters">
          {
            letters.map((letter, index) => <h1 key={index} id={`letter_${index}`}>{letter}</h1>)
          }
        </div>
        <div>
          <h1 id="pad">.</h1>
          <h1>Writing Pad</h1>
        </div>
    </div>
  );
}

export default App;
