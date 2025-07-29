import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import Samples from '../components/Samples';
import { useAddFeedbackMutation } from "../apis/authApi";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

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
  const [stars, setStars] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const [addFeedback, { isLoading }] = useAddFeedbackMutation();
  const user = useSelector((state) => state.auth.userData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    if (stars === 0) {
      setFeedbackError("Please select a star rating.");
      return;
    }

    setFeedbackError("");
    try {
      const res = await addFeedback({ stars, feedback: data.feedback }).unwrap();
      setFeedbackSubmitted(true);
      reset();
      setStars(0);
    } catch (error) {
      let msg = "Something went wrong. Please try again later.";
      if (error?.data?.message) {
        msg = error.data.message;
      } else if (error?.error) {
        msg = error.error;
      }
      setFeedbackError(msg);
      console.error("Feedback submission failed:", error);
    }
  };

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

    const interval = setInterval(() => detect(), 1500);
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

      {/* Feedback Section */}
      {user && (
        <div className="mt-16 bg-white p-6 rounded-xl shadow-lg border border-gray-300 text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-[#2e7d32] mb-4">Share Your Feedback</h2>

          {feedbackSubmitted ? (
            <p className="text-lg text-green-700 font-medium">Thank you! Your feedback has been submitted.</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Star Rating */}
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    onClick={() => setStars(i)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={i <= stars ? "#facc15" : "none"}
                    viewBox="0 0 24 24"
                    stroke="#facc15"
                    className="w-8 h-8 cursor-pointer mx-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.362 7.288h7.646c.969 0 1.371 1.24.588 1.81l-6.176 4.49 2.362 7.29c.3.92-.755 1.688-1.538 1.117L12 18.26l-6.195 4.662c-.782.57-1.837-.197-1.538-1.117l2.362-7.29-6.176-4.49c-.783-.57-.38-1.81.588-1.81h7.646l2.362-7.288z"
                    />
                  </svg>
                ))}
              </div>

              {/* Feedback Textarea */}
              <textarea
                {...register("feedback", { required: "Feedback is required." })}
                placeholder="Write your feedback..."
                className="w-full p-3 border border-gray-300 rounded mb-2 resize-none"
                rows={4}
              />

              {/* Error Messages */}
              {feedbackError && (
                <p className="text-red-600 text-sm mb-2">{feedbackError}</p>
              )}
              {errors.feedback && (
                <p className="text-red-600 text-sm mb-2">{errors.feedback.message}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#2e7d32] hover:bg-green-700 text-white font-bold py-2 px-6 rounded cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
