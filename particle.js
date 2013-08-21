(function(window, document, exports, undefined) {
    var Vector = exports.Vector;
    var environmentDensity = 1.22;
    var gravity = 9.81 / 2;
    var slowdown = 1000;
    var trailLength = 2;
    var trailSlowdown = 1;

    function Particle(point, velocity, size, acceleration, drag) {
        this.position = point || new Vector(0, 0);
        this.velocity = velocity || new Vector(0, 0);
        this.acceleration = acceleration || new Vector(0, 0);
        this.drag = drag || 0.47;
        this.frontalProjection = Math.PI * ((size || 0.5) ^ 2) / 10000;
        this.size = size || 1;
        this.trail = [];
        for (var i = trailLength - 1; i >= 0; i--) {
            this.trail.push(new Vector(this.position.x, this.position.y));
        }

        this.trail.slowdown = 0;
    }

    function getSign(value) {
        return value / Math.abs(value);
    }

    function getDrag(obj, velocity) {
        return -0.5 * obj.drag * obj.frontalProjection * environmentDensity * Math.pow(velocity, 2) * getSign(velocity);
    }

    function drawRectangle(ctx, fillStyle, position, size) {
        ctx.fillStyle = fillStyle;
        ctx.fillRect(position.x, position.y, size, size);
    }

    function moveTrail(particle) {
        if ((++particle.trail.slowdown % trailSlowdown) === 0) {
            particle.trail.pop();
            particle.trail.unshift(new Vector(particle.position.x, particle.position.y));
        }
    }

    function getHsl(hue, saturation, lightness) {
        return 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)';
    }

    Particle.prototype.move = function moveParticle() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        moveTrail(this);
    };

    Particle.prototype.draw = function drawParticle(ctx, color) {
        var self = this;
        var trailParticleSize = this.size;
        this.trail.forEach(function(position, reversedIndex) {
            drawRectangle(ctx, getHsl(color, 100, 90 - (reversedIndex + 1) * 5), position, trailParticleSize);
            if (trailParticleSize) {
                --trailParticleSize;
            }
        });

        drawRectangle(ctx, getHsl(color, 100, 90), this.position, this.size);
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

    Particle.prototype.submitToDrag = function submitToDrag() {
        var drag = new Vector(getDrag(this, this.velocity.x), getDrag(this, this.velocity.y));
        var acceleration = new Vector(drag.x /*/ this.mass*/ , gravity + (drag.y /*/ this.mass*/ ));
        acceleration.x = (isNaN(acceleration.x) ? 0 : acceleration.x);
        acceleration.y = (isNaN(acceleration.y) ? 0 : acceleration.y);
        this.acceleration.add(acceleration.multiply(1 / (slowdown + 1)));
    };

    exports.Particle = Particle;

})(window, document, window.PLAYGROUND);