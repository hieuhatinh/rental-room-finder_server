// import '@tensorflow/tfjs-node'
import * as tf from '@tensorflow/tfjs'

function onehotEncoding(categories, inputArray) {
    return categories.map((item) => (inputArray.includes(item) ? 1 : 0))
}

function computeCosineSimilarityScore(newSample, samples) {
    const samplesMatrix = tf.tensor(samples)
    const newSampleVector = tf.tensor(newSample).reshape([-1, 1])
    const scalarProduct = tf.matMul(samplesMatrix, newSampleVector)
    const samplesNorm = tf.sqrt(tf.sum(tf.square(samplesMatrix), 1))
    const newSampleNorm = tf.sqrt(tf.sum(tf.square(newSampleVector)))
    const cosineSimilarity = tf.div(
        scalarProduct.reshape([-1]),
        tf.mul(samplesNorm, newSampleNorm),
    )

    return cosineSimilarity
}

function vectorize(requestInfo, hobbiesCategories, habitsCategories) {
    let habits = requestInfo.habits
    habits = onehotEncoding(habitsCategories, habits)

    let hobbies = requestInfo.hobbies
    hobbies = onehotEncoding(hobbiesCategories, hobbies)

    return [...habits, ...hobbies]
}

function knnModel(samples, newSample, k = 5) {
    let cosineSimilarity = computeCosineSimilarityScore(newSample, samples)
    let cosineArray = cosineSimilarity.arraySync()

    let kSamples = cosineArray
        .map((value, index) => ({
            value,
            index,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, k)
        .map((item) => item)
    return kSamples
}

export {
    onehotEncoding,
    computeCosineSimilarityScore,
    knnModel as knn,
    vectorize,
}
