
// Arrangement provides easier way of managing the arrangement position
class Arrangement {

    constructor() {
        this.pos = 0;
        this.den = 0;
    }

    get position() {
        return this.pos;
    }

    // positionList returns a fancy position string
    get positionString() {
        return [
            (Math.floor(this.pos/this.denominatorDivisor))+1,
            (Math.floor(this.pos/this.denominatorMod)%4)+1,
            (this.pos%this.denominatorMod)+1
        ].join('. ');
    }

    get denominatorMod() {
        return 16/this.den;
    }

    get denominatorDivisor() {
        return 64/this.den;
    }

    set denominator(n) {
        if ( typeof parseInt(n) === "number" ) {
            this.den = n;
        }
    }

    set position(pos) {
        if ( typeof pos === "number" ) {
            this.pos = pos;
        }
    }

    // move advances arrangement position, fucking duh
    move() {
        this.pos++;
    }
}
