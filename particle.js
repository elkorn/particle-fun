(function(window, document, exports, undefined) {
    var Vector = exports.Vector;

    function Particle(point, velocity, acceleration) {
        this.position = point || new Vector(0, 0);
        this.velocity = velocity || new Vector(0, 0);
        this.acceleration = acceleration || new Vector(0, 0);
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

    exports.Particle = Particle;

})(window, document, window.PLAYGROUND);