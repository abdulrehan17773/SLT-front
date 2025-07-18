import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import Samples from '../components/Samples';

function flattenLandmarks(landmarks) {
  return landmarks.flatMap(pt => [pt.x, pt.y]);
}

function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
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

const Home = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState('');
  const [detector, setDetector] = useState(null);
  const [modelReady, setModelReady] = useState(false);
  const [aslSamples, setAslSamples] = useState(Samples);
  const [lastCaptured, setLastCaptured] = useState(null);

  useEffect(() => {
    const loadDetector = async () => {
      await tf.setBackend('webgl');
      await tf.ready();
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = { runtime: 'tfjs', modelType: 'lite' };
      const handDetector = await handPoseDetection.createDetector(model, detectorConfig);
      setDetector(handDetector);
      setModelReady(true);
    };
    loadDetector();
  }, []);

  useEffect(() => {
    const detect = async () => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4 && detector) {
        const video = webcamRef.current.video;
        const hands = await detector.estimateHands(video);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const boxSize = 130;
        const offsetX = (canvas.width - boxSize) / 2;
        const offsetY = (canvas.height - boxSize) / 2;
        ctx.strokeStyle = '#2e7d32';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX, offsetY, boxSize, boxSize);

        if (hands.length > 0) {
          const landmarks = hands[0].keypoints;
          const flat = flattenLandmarks(landmarks);
          setLastCaptured(flat);
          if (aslSamples.length > 0 && flat.length === aslSamples[0].landmarks.length) {
            const letter = knnPredict(flat, aslSamples);
            setPrediction(`That means: ${letter}`);
          } else {
            setPrediction('Hand detected, but no matching samples');
          }
        } else {
          setPrediction('');
          setLastCaptured(null);
        }
      }
    };

    const interval = setInterval(() => detect(), 300);
    return () => clearInterval(interval);
  }, [detector, aslSamples]);

  return (
    <div className="bg-[#e6f2ec] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-[#2e7d32] mb-4">
          Sign Language Translator
        </h1>
        <p className="text-lg text-gray-700 mb-10">
          Show a sign using your hand in front of your webcam, and we'll tell you what it means in real time.
        </p>
      </div>

      {/* Webcam + Canvas */}
      <div className="flex justify-center">
        <div className="relative w-[350px] h-[263px] rounded-lg border-2 border-[#86ba98] overflow-hidden shadow-md">
          <Webcam
            ref={webcamRef}
            audio={false}
            width={350}
            height={263}
            className="rounded-md"
          />
          <canvas
            ref={canvasRef}
            width={350}
            height={263}
            className="absolute top-0 left-0 z-10"
          />
        </div>
      </div>

      {/* Prediction */}
      <div className="text-center mt-6">
        <h2 className="text-xl font-semibold text-[#2e7d32] mb-2">Prediction</h2>
        <p className="text-2xl text-green-800">
          {!modelReady
            ? 'Loading model...'
            : prediction
              ? prediction
              : 'Looking for your hand...'}
        </p>
      </div>

      {/* Info Section */}
      <div className="max-w-4xl mx-auto mt-16 bg-white p-8 rounded shadow border border-[#86ba98]">
        <h3 className="text-2xl font-bold text-[#2e7d32] mb-4">Why It Matters</h3>
        <p className="text-gray-700 text-lg leading-relaxed">
          Sign language is a powerful bridge between the hearing and Deaf communities.
          Our AI-powered translator helps break down communication barriers in real time.
          Whether you're learning, teaching, or simply connecting, this tool is designed
          to make communication more inclusive and accessible to everyone.
        </p>
      </div>
    </div>
  );
};

export default Home;
