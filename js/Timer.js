
// Timer provides a *fairly* accurate timing mechanism, nothing fancy
class Timer {

    constructor(options) {
        this.interval = 10; // callback will be called every interval
        this.initialt = performance.now();  // initial time
        this.comparer = 0;  // var used to compare curr time to
        this.callback = () => {};   // the callback
        this.stoppage = false;  // it'll be true if the timer has to stop
        // set to true if callback should be called before first interval
        this.startint = false;
        // you don't really have to set this, it determines how long
        // the setTimeout takes
        this.accuracy = false;

        // well, it sets the options
        if ( options ) {
            this.interval = options.interval?options.interval:this.interval;
            this.callback = options.callback?options.callback:this.callback;
            this.startint = options.startint?options.startint:this.startint;
            this.accuracy = options.accuracy?options.accuracy:this.accuracy;
        }
    }

    setCallback(cb) {
        if ( typeof cb === "function" ) {
            this.callback = cb;
        }
    }

    setInterval(ms) {
        if ( typeof ms === "number" ) {
            this.interval = ms;
        }
    }

    update(callback) {
        if ( this.stoppage ) {
            return;
        }

        // calculating if the timer is due to call callback
        if ( performance.now()-(this.initialt+this.comparer) > this.interval ) {
            this.callback();
            this.comparer += this.interval;
        }

        // calling local callback
        callback();
    }

    start() {
        this.stoppage = false;
        this.initialt = performance.now();
        this.comparer = 0;

        if ( this.startint ) {
            this.callback();
        }

        let loop = () => {
            this.update(() => {
                setTimeout(
                    loop,
                    isNaN(this.accuracy) | this.accuracy==0?
                        0 : this.interval/this.accuracy
                );
            });
        }
        loop();
    }

    stop() {
        this.stoppage = true;
        return performance.now() - this.initialt;
    }
}
