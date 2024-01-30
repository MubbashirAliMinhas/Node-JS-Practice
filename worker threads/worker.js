const { workerData, parentPort } = require('worker_threads')

const { start, end, array } = workerData
let partialSum = 0

for (let i = start; i < end; i++) {
    partialSum += array[i]
}

parentPort.postMessage(partialSum)