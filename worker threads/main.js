const { Worker } = require('worker_threads')

const size = 100
const sharedArray = new SharedArrayBuffer(size * Int32Array.BYTES_PER_ELEMENT)
const array = new Int32Array(sharedArray)

for (let i = 0; i < size; i++) {
    array[i] = i + 1
}

let totalSum = 0

const numberOfThreads = 4
const chunkSize = 25
const workers = []

for (let i = 0; i < numberOfThreads; i++) {
    const start = i * chunkSize
    const end = start + chunkSize
    workers.push(new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', {
            workerData: {
                start, end, array
            }
        })

        worker.on('message', partialSum => {
            resolve(partialSum)
        })
    }))
}

Promise.all(workers).then(partialSums => {
    partialSums.forEach(partialSum => {
        totalSum += partialSum
    })

    console.log(totalSum)
})