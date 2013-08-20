(function(window, document, exports, undefined) {
    function Field(point, mass) {
        this.position = point;
        this.setMass(mass);
        this.size = Math.abs(this.mass / 10);
    }

    Field.prototype.setMass = function setMass(mass) {
        this.mass = mass || 100;
        this.drawColor = mass < 0 ? "#f00" : "#0f0";
    };

    Field.prototype.setPosition = function setFieldPosition(position) {
        this.position.x = position.x;
        this.position.y = position.y;
    };

    exports.Field = Field;
})(window, document, window.PLAYGROUND);