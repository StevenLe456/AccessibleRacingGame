import * as tf from '@tensorflow/tfjs';

export async function initModel() {
    return await tf.loadLayersModel('model/model.json')
}

export function getPred(model: tf.LayersModel, video: HTMLCanvasElement) {
    const data = tf.browser.fromPixels(video).expandDims(0)
    return model.predict(data)
}