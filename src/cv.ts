import '@mediapipe/face_mesh'
import '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'
import * as face from '@tensorflow-models/face-landmarks-detection'

const model = face.SupportedModels.MediaPipeFaceMesh
const detectorConfig: face.MediaPipeFaceMeshMediaPipeModelConfig = {
  runtime: 'mediapipe',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
  refineLandmarks: false
}
var detector = async () => {await face.createDetector(model, detectorConfig)}