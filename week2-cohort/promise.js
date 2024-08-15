class MyPromise {
    static STATE = {
        PENDING: 'PENDING',
        FULFILLED: 'FULFILLED',
        REJECTED: 'REJECTED'
    };

    constructor(MyPromiseHandler) {
        this.status = MyPromise.STATE.PENDING;
        this.value = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.status === MyPromise.STATE.PENDING) {
                this.status = MyPromise.STATE.FULFILLED;
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn(value));
            }
        };

        const reject = (value) => {
            if (this.status === MyPromise.STATE.PENDING) {
                this.status = MyPromise.STATE.REJECTED;
                this.value = value;
                this.onRejectedCallbacks.forEach(fn => fn(value));
            }
        };

        try {
            MyPromiseHandler(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then(onFulfilled, onRejected) {
        if (this.status === MyPromise.STATE.PENDING) {
            this.onFulfilledCallbacks.push(onFulfilled);
            this.onRejectedCallbacks.push(onRejected);
        } else if (this.status === MyPromise.STATE.FULFILLED) {
            onFulfilled(this.value);
        } else if (this.status === MyPromise.STATE.REJECTED) {
            onRejected(this.value);
        }
    }
}
