import '@tensorflow/tfjs-core';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';

export async function initFaceModel() {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const detectorConfig = <faceDetection.MediaPipeFaceDetectorTfjsModelConfig> {
        runtime: 'tfjs',
        maxFaces: 1,
    };
    return await faceDetection.createDetector(model, detectorConfig);
}

export async function getFace(detector: faceDetection.FaceDetector, video: HTMLCanvasElement) {
    const estimationConfig = {flipHorizontal: false};
    return await detector.estimateFaces(video, estimationConfig);
}