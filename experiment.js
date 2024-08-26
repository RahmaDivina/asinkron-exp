// Custom Promise Library
class MyPromise {
    constructor(executor) {
        this.state = 'PENDING';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.state === 'PENDING') {
                this.state = 'FULFILLED';
                this.value = value;
                this.onFulfilledCallbacks.forEach(callback => callback());
            }
        };

        const reject = (reason) => {
            if (this.state === 'PENDING') {
                this.state = 'REJECTED';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(callback => callback());
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            if (this.state === 'FULFILLED') {
                try {
                    const x = onFulfilled(this.value);
                    resolve(x);
                } catch (error) {
                    reject(error);
                }
            }

            if (this.state === 'REJECTED') {
                try {
                    const x = onRejected(this.reason);
                    resolve(x);
                } catch (error) {
                    reject(error);
                }
            }

            if (this.state === 'PENDING') {
                this.onFulfilledCallbacks.push(() => {
                    try {
                        const x = onFulfilled(this.value);
                        resolve(x);
                    } catch (error) {
                        reject(error);
                    }
                });

                this.onRejectedCallbacks.push(() => {
                    try {
                        const x = onRejected(this.reason);
                        resolve(x);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    static all(promises) {
        return new MyPromise((resolve, reject) => {
            let results = [];
            let completed = 0;

            promises.forEach((promise, index) => {
                promise.then((value) => {
                    results[index] = value;
                    completed++;

                    if (completed === promises.length) {
                        resolve(results);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }
}

// Fungsi Tugas Sinkron dengan Iterasi yang Dapat Dimodifikasi
function syncTask(iterations) {
    for (let i = 0; i < iterations; i++) {
        // Simulasi tugas berat secara sinkron
        Math.sqrt(i);
    }
}

// Fungsi Tugas Asinkron dengan Iterasi yang Dapat Dimodifikasi
function asyncTask(iterations) {
    return new MyPromise((resolve) => {
        setTimeout(() => {
            for (let i = 0; i < iterations; i++) {
                // Simulasi tugas berat secara asinkron
                Math.sqrt(i);
            }
            resolve('Done');
        }, 0);
    });
}

// Eksperimen Operasi Sinkron dengan Iterasi yang Dapat Dimodifikasi
function experimentSync(iterations) {
    console.time('Sync Task');
    syncTask(iterations);
    console.timeEnd('Sync Task');
}

// Eksperimen Operasi Asinkron dengan Custom Promise
function experimentAsyncCustomPromise(iterations) {
    console.time('Async Task with MyPromise');
    asyncTask(iterations).then(() => {
        console.timeEnd('Async Task with MyPromise');
    });
}

// Eksperimen Operasi Asinkron dengan Native Promise
function experimentAsyncNativePromise(iterations) {
    console.time('Async Task with Native Promise');
    new Promise((resolve) => {
        setTimeout(() => {
            for (let i = 0; i < iterations; i++) {
                Math.sqrt(i);
            }
            resolve('Done');
        }, 0);
    }).then(() => {
        console.timeEnd('Async Task with Native Promise');
    });
}

// Eksperimen Lanjut: Jalankan Beberapa Tugas Asinkron Secara Paralel
function experimentParallelAsync(iterations, taskCount) {
    console.time('Parallel Async Tasks with MyPromise');
    const tasks = [];
    for (let i = 0; i < taskCount; i++) {
        tasks.push(asyncTask(iterations));
    }A
    MyPromise.all(tasks).then(() => {
        console.timeEnd('Parallel Async Tasks with MyPromise');
    });
}

// Jalankan Eksperimen dengan Berbagai Jumlah Iterasi
const iterations = 1e6; // Jumlah iterasi dalam loop
experimentSync(iterations); // Jalankan tugas sinkron
experimentAsyncCustomPromise(iterations); // Jalankan tugas asinkron dengan custom promise
experimentAsyncNativePromise(iterations); // Jalankan tugas asinkron dengan native promise

// Jalankan Eksperimen Paralel dengan 5 Tugas Asinkron
const taskCount = 5; // Jumlah tugas asinkron yang dijalankan paralel
experimentParallelAsync(iterations, taskCount);
