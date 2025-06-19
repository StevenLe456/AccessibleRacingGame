import '@mediapipe/face_mesh'
import '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'
import * as face from '@tensorflow-models/face-landmarks-detection'

export async function load(): Promise<face.FaceLandmarksDetector> {
    const model = face.SupportedModels.MediaPipeFaceMesh
    const detectorConfig: face.MediaPipeFaceMeshMediaPipeModelConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        refineLandmarks: false
    }
    const detector = await face.createDetector(model, detectorConfig)
    return detector
}

export function initVideo(): HTMLVideoElement {
    var video: HTMLVideoElement = <HTMLVideoElement> document.getElementById("videoElement")
    if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream
        })
        .catch(function (error) {
            console.log("Something went wrong!")
        })
    }
    return video
}

export async function faceMesh(detector: face.FaceLandmarksDetector, video: HTMLVideoElement): Promise<Object[]> {
    const estimationConfig = {flipHorizontal: false}
    const faces = await detector.estimateFaces(video, estimationConfig)
    return faces
}