import mysql from 'mysql2/promise'
import * as tf from '@tensorflow/tfjs'

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Hieucs5*',
    database: 'rental_room_finder_db',
})
const connection = await pool.getConnection()

function computeEuclideanDistance(newSample, samples) {
    let samplesMatrix = tf.tensor(samples)
    let newSampleVector = tf.tensor(newSample)
    let differences = samplesMatrix.sub(newSampleVector)
    let distance = tf.sqrt(tf.sum(differences.square(), 1))

    return distance.arraySync()
}

const newSample = [1, 2, 3]
const samples = [
    [4, 5, 6],
    [7, 8, 9],
    [1, 0, 1],
]

console.log(computeEuclideanDistance(newSample, samples))

// async function getHobbies() {
//     try {
//         const [hobbies] = await connection.execute(
//             `SELECT DISTINCT hobbies FROM roommate_request`,
//         )
//         let uniqueHobbies = []
//         hobbies.forEach((element) => {
//             let hobbiesElement = element.hobbies.split(', ')
//             uniqueHobbies.push(...hobbiesElement)
//         })
//         uniqueHobbies = [...new Set(uniqueHobbies)]
//         return uniqueHobbies
//     } catch (error) {
//         throw new Error(error?.message || 'Có lỗi xảy ra')
//     }
// }

// getHobbies()
