(function(window, document, exports, undefined) {
    var Vector = exports.Vector;
    var environmentDensity = 1.22;
    var gravity = 0;//9.81;
    var slowdown = 10;

    function Particle(point, velocity, acceleration, size, drag) {
        this.position = point || new Vector(0, 0);
        this.velocity = velocity || new Vector(0, 0);
        this.acceleration = acceleration || new Vector(0, 0);
        this.drag = drag || 0.47;
        this.frontalProjection = Math.PI * ((size || 0.5) ^ 2) / 10000;
    }

    function getSign(value) {
        return value / Math.abs(value);
    }

    function getDrag(obj, velocity) {
        return -0.5 * obj.drag * obj.frontalProjection * environmentDensity * Math.pow(velocity, 2) * getSign(velocity);
    }

    Particle.prototype.move = function moveParticle() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    };

    Particle.prototype.submitToFields = function submitToFields(fields) {
        var totalAcceleration = new Vector(0, 0);
        var self = this;
        fields.forEach(function(field) {
            var vector = new Vector(field.position.x - self.position.x, field.position.y - self.position.y);
            var force = field.mass / Math.pow(Math.pow(vector.x, 2) + Math.pow(vector.y, 2), 1.5);
            totalAcceleration.add(vector.multiply(force));
        });

        this.acceleration.add(totalAcceleration);
    };

    // Particle.prototype.submitToGravity = function submitToGravity(gravityForce) {
    //     this.acceleration.add(new Vector(0, gravityForce / 100));
    // };

    Particle.prototype.submitToDrag = function submitToDrag() {
        var drag = new Vector(getDrag(this, this.velocity.x), getDrag(this, this.velocity.y));
        var acceleration = new Vector(drag.x /*/ this.mass*/ , gravity + (drag.y /*/ this.mass*/ ));
        // acceleration.x = (isNaN(acceleration.x) ? 0 : acceleration.x);
        // acceleration.y = (isNaN(acceleration.y) ? 0 : acceleration.y);
        this.acceleration.add(acceleration.multiply(1 / (slowdown + 1)));
    };

    exports.Particle = Particle;

})(window, document, window.PLAYGROUND);