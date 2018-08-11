// Adds Avatar movement velocity for Cube-Pooper Motion!
// Uses head movements to move forward. Should be used in the air.

(function () {

    var MOTOR_VELOCITY = {x: 0, y: 0, z: 3};
    var MOTOR_TIMESCALE = 0.5;

    MyAvatar.motorVelocity = MOTOR_VELOCITY;
    MyAvatar.motorTimescale = MOTOR_TIMESCALE;


    function scriptEnding() {
        console.log("### in script ending");
        MyAvatar.motorVelocity = {x: 0, y: 0, z: 0};
        MyAvatar.motorTimescale = 0;
    }    

    Script.scriptEnding.connect(scriptEnding);

})();