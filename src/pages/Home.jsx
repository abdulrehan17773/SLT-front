import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Samples from '../components/Samples';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

// Helper functions
function flattenLandmarks(landmarks) {
  return landmarks.flatMap(pt => [pt.x, pt.y]);
}

function euclideanDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

function knnPredict(landmarks, samples, k = 1) {
  if (samples.length === 0) return '?';
  const distances = samples.map(sample => ({
    label: sample.label,
    dist: euclideanDistance(landmarks, sample.landmarks),
  }));
  distances.sort((a, b) => a.dist - b.dist);
  return distances[0].label;
}

const SIGNS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), ...'0123456789'.split('')];



const Home = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState('Waiting...');
  const [detector, setDetector] = useState(null);
  const [aslSamples, setAslSamples] = useState(Samples);
  const [selectedSign, setSelectedSign] = useState('A');
  const [lastCaptured, setLastCaptured] = useState(null);

  // Load the hand pose detector
  useEffect(() => {
    const loadDetector = async () => {
      await tf.setBackend('webgl');
      await tf.ready();
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: 'tfjs',
        modelType: 'lite',
      };
      const handDetector = await handPoseDetection.createDetector(model, detectorConfig);
      setDetector(handDetector);
    };
    loadDetector();
  }, []);

  // Prediction + drawing loop
  useEffect(() => {
    const detect = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4 &&
        detector
      ) {
        const video = webcamRef.current.video;
        const hands = await detector.estimateHands(video);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw green guide box
        const boxSize = 150;
        const offsetX = (canvas.width - boxSize) / 2;
        const offsetY = (canvas.height - boxSize) / 2;
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX, offsetY, boxSize, boxSize);

        // Handle hand detection
        if (hands.length > 0) {
          const landmarks = hands[0].keypoints;
          const flat = flattenLandmarks(landmarks);
          setLastCaptured(flat);
          if (aslSamples.length > 0 && flat.length === aslSamples[0].landmarks.length) {
            const letter = knnPredict(flat, aslSamples);
            setPrediction(`Predicted: ${letter}`);
          } else {
            setPrediction('Hand detected, but no samples yet or landmark count mismatch');
          }
        } else {
          setPrediction('No hand detected');
          setLastCaptured(null);
        }
      }
    };

    const interval = setInterval(() => {
      detect();
    }, 300);

    return () => clearInterval(interval);
  }, [detector, aslSamples]);

  // Capture a sample
  const handleCaptureSample = () => {
    if (lastCaptured) {
      const sample = { label: selectedSign, landmarks: lastCaptured };
      setAslSamples(prev => [...prev, sample]);
      console.log('Sample for', selectedSign, ':', JSON.stringify(sample));
      alert(`Sample for ${selectedSign} captured and logged to console!`);
    } else {
      alert('No hand detected to capture!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
      <h2>Real-Time Sign Language Translator (A-Z, 0-9)</h2>

      {/* Webcam + Canvas wrapper */}
      <div style={{ position: 'relative', width: 350, height: 263 }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          width={350}
          height={263}
          style={{ borderRadius: '10px', border: '2px solid #ccc' }}
        />
        <canvas
          ref={canvasRef}
          width={350}
          height={263}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
          }}
        />
      </div>

      {/* Prediction */}
      <div style={{ marginTop: '1rem' }}>
        <h4>Prediction:</h4>
        <p style={{ fontSize: '1.5rem', color: 'green' }}>{prediction}</p>
      </div>

      {/* Data Collection Panel */}
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
        <h4>Data Collection Mode</h4>
        <label>
          Select Sign:
          <select value={selectedSign} onChange={e => setSelectedSign(e.target.value)} style={{ marginLeft: '0.5rem' }}>
            {SIGNS.map(sign => (
              <option key={sign} value={sign}>{sign}</option>
            ))}
          </select>
        </label>
        <button onClick={handleCaptureSample} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Capture Sample
        </button>
        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
          Show the sign in front of the webcam, then click Capture Sample. Check the console for the sample data to copy into your code.
        </p>
      </div>
    </div>
  );
};

export default Home;