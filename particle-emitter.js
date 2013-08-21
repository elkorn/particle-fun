(function(window, document, exports, undefined) {
    var Vector = exports.Vector;
    var Particle = exports.Particle;

    function ParticleEmitter(point, velocity, spread, emisionRate) {
        this.position = point;
        this.velocity = velocity;
        this.spread = spread || Math.PI / 32;
        this.drawColor = '#999';
    }

    ParticleEmitter.prototype.emitParticle = function emitParticle(size) {
        var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);
        var magnitude = this.velocity.getMagnitude();
        var position = new Vector(this.position.x, this.position.y);
        var velocity = Vector.fromAngle(angle, magnitude);

        return new Particle(position, velocity, size);
    };

    exports.ParticleEmitter = ParticleEmitter;
})(window, document, window.PLAYGROUND);