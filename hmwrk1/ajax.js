// CustomPromise class which works like a Promise ()
class CustomPromise {
    constructor(executor) {
      this.state = 'pending';
      this.value = undefined;
      this.callbacks = [];
  
      const resolve = (value) => {
        if (this.state === 'pending') {
          this.state = 'fulfilled';
          this.value = value;
          this.executeCallbacks();
        }
      };
  
      const reject = (reason) => {
        if (this.state === 'pending') {
          this.state = 'rejected';
          this.value = reason;
          this.executeCallbacks();
        }
      };
  
      try {
        executor(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }
  
    executeCallbacks() {
      this.callbacks.forEach(({ onFulfilled, onRejected }) => {
        if (this.state === 'fulfilled') {
          onFulfilled(this.value);
        } else if (this.state === 'rejected') {
          onRejected(this.value);
        }
      });
    }
  
    then(onFulfilled, onRejected) {
      return new Promise((resolve, reject) => {
        const callback = {
          onFulfilled: (value) => {
            try {
              if (typeof onFulfilled === 'function') {
                const result = onFulfilled(value);
                resolve(result);
              } else {
                resolve(value);
              }
            } catch (error) {
              reject(error);
            }
          },
          onRejected: (reason) => {
            try {
              if (typeof onRejected === 'function') {
                const result = onRejected(reason);
                resolve(result);
              } else {
                reject(reason);
              }
            } catch (error) {
              reject(error);
            }
          },
        };
  
        if (this.state === 'pending') {
          this.callbacks.push(callback);
        } else {
          setTimeout(() => {
            this.executeCallback(callback);
          });
        }
      });
    }
  
    catch(onRejected) {
      return this.then(undefined, onRejected);
    }
}
  
//The first homework assignment where a function is created that returns a promise to which an XML request is sent
const ajax = (url, config = {}) => {
  return new CustomPromise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(config.method || 'GET', url);

    if (config.headers) {
      for (const header in config.headers) {
        xhr.setRequestHeader(header, config.headers[header]);
      }
    }

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.statusText));
      }
    };

    xhr.onerror = function () {
      reject(new Error('Network error'));
    };

    xhr.send(config.body);
  });
}

const HOST = '127.0.0.1';
const PORT = '4000'
const firstElem = document.querySelector('.first');
const secondElem = document.querySelector('.second');

//An example of using the ajax function
ajax(`http://${HOST}:${PORT}`)
  .then(response => {
    firstElem.innerText =`First example response(GET) :${response}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });

//Second homework where request will be send by using configs
const config = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({ key: 'value' })
};

//An example of using the ajax function with config (sending this time post request) 
ajax(`http://${HOST}:${PORT}`, config)
  .then(response => {
    secondElem.innerText = `Second example response(POST):${response}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });
