import * as tf from '@tensorflow/tfjs';

import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';


export async function initFaceModel() {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const detectorConfig = <faceDetection.MediaPipeFaceDetectorMediaPipeModelConfig> {
        runtime: 'mediapipe',
        maxFaces: 1,
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection',
    };
    return await faceDetection.createDetector(model, detectorConfig);
}

export async function getFace(detector: faceDetection.FaceDetector, video: HTMLCanvasElement) {
    const estimationConfig = {flipHorizontal: false};
    return await detector.estimateFaces(video, estimationConfig);
}

export async function initModel() {
    return await tf.loadLayersModel('model/model.json')
}

export function getPred(model: tf.LayersModel, video: HTMLCanvasElement) {
    const data = tf.browser.fromPixels(video).expandDims(0)
    return model.predict(data)
}