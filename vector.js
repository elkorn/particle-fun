(function(window, document, exports, undefined) {
    function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Vector.prototype.add = function(vector) {
        this.x += vector.x;
        this.y += vector.y;
    };

    Vector.prototype.getMagnitude = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };

    Vector.prototype.getAngle = function() {
        return Math.atan2(this.x, this.y);
    };

    Vector.prototype.multiply = function multiplyVector(multiplier) {
        return new Vector(this.x * multiplier, this.y * multiplier);
    };

    Vector.fromAngle = function fromAngle(angle, magnitude) {
        return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
    };

    exports.Vector = Vector;
})(window, document, window.PLAYGROUND);