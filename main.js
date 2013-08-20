(function(window, document, undefined) {
    var Field = window.PLAYGROUND.Field;
    var Vector = window.PLAYGROUND.Vector;
    var Particle = window.PLAYGROUND.Particle;
    var ParticleEmitter = window.PLAYGROUND.ParticleEmitter;

    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var emitters = [
        new ParticleEmitter(new Vector(500, 300), Vector.fromAngle(179.1, 1), 10)
    ];
    var fields = [
        // new Field(new Vector(600, 230), -140),
        new Field(new Vector(0, 0), 0)
    ];

    var activeField = fields[0];
    var maxParticles = 10000;
    var emissionRate = 4;
    var particleSize = 2;
    var currentColor = 0;
    var maxColor = 360;
    var magnet = -10;
    var md = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function drawParticles() {
        ctx.fillStyle = 'hsl(' + (++currentColor % maxColor) + ',100%,90%)';
        particles.forEach(function(particle) {
            var position = particle.position;
            ctx.fillRect(position.x, position.y, particleSize, particleSize);
        });
    }

    function addNewParticles() {
        if (particles.length > maxParticles) {
            return;
        }

        emitters.forEach(function(emitter) {
            for (var i = 0; i < emissionRate; i++) {
                particles.push(emitter.emitParticle());
            }
        });
    }

    function plotParticles(bounds) {
        var currentParticles = [];
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            var pos = particle.position;

            // If we're out of bounds, drop this particle and move on to the next
            if (pos.x < 0 || pos.x > bounds.x || pos.y < 0 || pos.y > bounds.y) continue;

            particle.submitToDrag();
            particle.submitToFields(fields);
            // particle.submitToGravity(gravity);
            // Move our particles
            particle.move();

            // Add this particle to the list of current particles
            currentParticles.push(particle);
        }

        // Update our global particles, clearing room for old particles to be collected
        particles = currentParticles;
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function queue() {
        window.requestAnimationFrame(loop);
    }

    function update() {
        addNewParticles();
        plotParticles({
            x: canvas.width,
            y: canvas.height
        });
    }

    function draw() {
        drawParticles();
        fields.concat(emitters).forEach(drawCircle);
    }

    function loop() {
        clear();
        update();
        draw();
        queue();
    }

    function drawCircle(obj) {
        ctx.fillStyle = obj.drawColor;
        ctx.beginPath();
        ctx.arc(obj.position.x, obj.position.y, obj.size || 3, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    document.addEventListener('mousemove', activeField.setPosition.bind(activeField));
    document.addEventListener('mousedown', function(e) {
        activeField.mass += magnet;
        md = true;
        console.log("Current mass:", activeField.mass);

    });
    document.addEventListener('mouseup', function(e) {
        if (md) {
            activeField.mass -= magnet;
            md = false;
        }
        console.log("Current mass:", activeField.mass);
    });
    loop();
})(window, document);