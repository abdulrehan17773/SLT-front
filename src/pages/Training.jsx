    import React, { useEffect, useRef, useState } from 'react';
    import Webcam from 'react-webcam';
    import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
    import * as tf from '@tensorflow/tfjs-core';
    import '@tensorflow/tfjs-backend-webgl';
    import SideBar from '../components/SideBar';

    // Helper functions
    function flattenLandmarks(landmarks) {
    return landmarks.flatMap(pt => [pt.x, pt.y]);
    }

    const Training = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [detector, setDetector] = useState(null);
    const [lastCaptured, setLastCaptured] = useState(null);

    // Load hand detector
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

    // Detection loop
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
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw guide box
            const boxSize = 130;
            const offsetX = (canvas.width - boxSize) / 2;
            const offsetY = (canvas.height - boxSize) / 2;
            ctx.strokeStyle = '#2e7d32';
            ctx.lineWidth = 2;
            ctx.strokeRect(offsetX, offsetY, boxSize, boxSize);

            // Capture hand landmarks
            if (hands.length > 0) {
            const landmarks = hands[0].keypoints;
            const flat = flattenLandmarks(landmarks);
            setLastCaptured(flat);
            } else {
            setLastCaptured(null);
            }
        }
        };

        const interval = setInterval(() => {
        detect();
        }, 300);

        return () => clearInterval(interval);
    }, [detector]);

    const handleCapture = () => {
        if (lastCaptured) {
        const sample = {
            label: 'add keyword',
            landmarks: lastCaptured,
        };
        console.log('Captured Sample:', JSON.stringify(sample));
        alert('Sample captured! Check console for logged data.');
        } else {
        alert('No hand detected. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen bg-green-50">
        <SideBar activeTab="/dashboard/training" />

        <main className="flex-1 p-6 pt-24 md:pt-10 md:p-10 overflow-y-auto">
            <h1 className="text-3xl font-bold text-green-800 mb-8">Train Model - Hand Sign Capture</h1>

            <div className="flex flex-col items-center">
            {/* Webcam + Canvas */}
            <div className="relative w-[350px] h-[263px] rounded-lg border-2 border-green-200 overflow-hidden">
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

            {/* Capture Button */}
            <div className="mt-6 flex flex-col items-center">
                <button
                    onClick={handleCapture}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                    Capture Sample
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center max-w-xs">
                    Show your hand in front of the webcam, then click the button to capture and log landmarks with label "add".
                </p>
                </div>

            </div>
        </main>
        </div>
    );
    };

    export default Training;
