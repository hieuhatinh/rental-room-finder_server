// import '@tensorflow/tfjs-node'
import * as tf from '@tensorflow/tfjs'

function onehotEncoding(categories, inputArray) {
    return categories.map((item) => (inputArray.includes(item) ? 1 : 0))
}

function computeEuclideanDistance(newSample, samples) {
    let samplesMatrix = tf.tensor(samples)
    let newSampleVector = tf.tensor(newSample)
    let differences = samplesMatrix.sub(newSampleVector)
    let distance = tf.sqrt(tf.sum(differences.square(), 1))

    return distance
}

function vectorize(requestInfo, hobbiesCategories, habitsCategories) {
    let habits = requestInfo.habits.split(', ')
    habits = onehotEncoding(habitsCategories, habits)

    let hobbies = requestInfo.hobbies.split(', ')
    hobbies = onehotEncoding(hobbiesCategories, hobbies)

    return [...habits, ...hobbies]
}

function knnModel(samples, newSample, k = 5) {
    let distanceOfSamples = computeEuclideanDistance(newSample, samples)
    let distanceArray = distanceOfSamples.arraySync()

    let kSamples = distanceArray
        .map((value, index) => ({
            value,
            index,
        }))
        .sort((a, b) => a.value - b.value)
        .slice(0, k)
        .map((item) => item)
    return kSamples
}

export { onehotEncoding, computeEuclideanDistance, knnModel as knn, vectorize }
