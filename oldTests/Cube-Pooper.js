(function() { 

    var FORWARD_VELOCITY = { x: 0, y: 0, z: -1}; // m/s
    var NOOP = function () {};
    var MAPPING_NAME = "Cube-Pooper";

    var DELTA_PITCH = 15;
    var DELTA_YAW = 15;
    var TIMEOUT_PITCH = 500;
    var TIMEOUT_YAW = 500;

    var EULER_UP = { x: DELTA_PITCH, y: 0, z: -1}; // Quat.fromPitchYawRollDegrees(DELTA_PITCH, 0, 0);
    var EULER_DOWN = { x: -DELTA_PITCH, y: 0, z: -1}; // Quat.fromPitchYawRollDegrees(-DELTA_PITCH, 0, 0);
    var EULER_LEFT = { x: 0, y: DELTA_YAW, z: -1}; // Quat.fromPitchYawRollDegrees(0, DELTA_YAW, 0);
    var EULER_RIGHT = { x: 0, y: -DELTA_YAW, z: -1}; // Quat.fromPitchYawRollDegrees(0, -DELTA_YAW, 0);

    var changeableYaw = true;
    var changeablePitch = true;
    
    // Dependencies
    // /////////////////////////////////////////////////////////////////////////
    Script.require("../Utilities/Polyfills.js")();

    var Helper = Script.require("../Utilities/Helper.js?" + Date.now()),
        inFrontOf = Helper.Avatar.inFrontOf,
        vec = Helper.Maths.vec;

    // Log Setup
    var LOG_CONFIG = {},
        LOG_ENTER = Helper.Debug.LOG_ENTER,
        LOG_UPDATE = Helper.Debug.LOG_UPDATE,
        LOG_ERROR = Helper.Debug.LOG_ERROR,
        LOG_VALUE = Helper.Debug.LOG_VALUE,
        LOG_ARCHIVE = Helper.Debug.LOG_ARCHIVE;

    LOG_CONFIG[LOG_ENTER] = true;
    LOG_CONFIG[LOG_UPDATE] = true;
    LOG_CONFIG[LOG_ERROR] = true;
    LOG_CONFIG[LOG_VALUE] = true;
    LOG_CONFIG[LOG_ARCHIVE] = false;
    var log = Helper.Debug.log(LOG_CONFIG);

    var controllerMapping = null,
        cubeID = Entities.addEntity({ 
            type: "Box", 
            collisonless: true, 
            position: Camera.position,
            rotation: MyAvatar.orientation,
            //velocity: FORWARD_VELOCITY,
            damping: 0
         });

    // MyAvatar.orientation = Quat.fromPitchYawRollDegrees(0,0,0);

    controllerMapping = Controller.newMapping(MAPPING_NAME);

    // R STICK UP DOWN SNAP PITCH
    // L STICK LEFT RIGHT SNAP YAW
    function changeDirection(direction, value) {

        print("CHANGE VALUE");

        // invisible cube guiding avatar forward
        var orientation = Quat.getForward(MyAvatar.orientation);
        var eulerOrientation = Quat.safeEulerAngles(orientation);
        var isPositive = value > 0;

        if (direction === "pitch" 
            && (eulerOrientation.x >= 89.8 && isPositive)
            || (eulerOrientation.x <= -89.8 && !isPositive)) {
            // is facing straight up and wants to go up
            // or is facing straight down and wants to go down
            return;
        }

        var delta = direction === "pitch" 
            ? isPositive ? EULER_UP : EULER_DOWN // pitch
            : isPositive ? EULER_LEFT : EULER_RIGHT; // yaw

        var euler = Vec3.sum(eulerOrientation, delta);
        var quat = Quat.fromPitchYawRollDegrees(euler.x, euler.y, euler.z);
        var newDirection = Quat.multiply(orientation, quat);
        Entities.editEntity(cubeID, {
            rotation: newDirection,
            // position: Camera.position
        });
    }

    controllerMapping.from(Controller.Standard.RX).to(NOOP);
    controllerMapping.from(Controller.Standard.LY).to(NOOP);
    
    controllerMapping.from(Controller.Standard.RY).to(function(value) {
        log(LOG_VALUE, "Value", value);

        if (changeablePitch && (value > 0.8 || value < -0.8)) {
            Entities.editEntity(cubeID, {
                position: Camera.position
            });
            changeDirection("pitch", value);
            changeablePitch = false;

            Script.setTimeout(function () {
                changeablePitch = true;
            }, TIMEOUT_PITCH);
        }

    });

    controllerMapping.from(Controller.Standard.LX).to(function(value) {
        if (changeableYaw && (value > 0.8 || value < -0.8)) {
            Entities.editEntity(cubeID, {
                position: { x: 0, y: 0, z: 0}
            });
            changeDirection("yaw", value);
            changeableYaw = false;

            Script.setTimeout(function () {
                changeableYaw = true;
            }, TIMEOUT_YAW);
        }
    });

    Controller.enableMapping(MAPPING_NAME);

    MyAvatar.setParentID(cubeID);

    function scriptEnding() {
        console.log("### in script ending");
        Controller.disableMapping(MAPPING_NAME);
        Entities.deleteEntity(cubeID);
    }    

    Script.scriptEnding.connect(scriptEnding);


})();





/*

    function moveCube(direction) {
        var cubePosition = Entities.getEntityProperties(cubeID, ["position"]).position;
        var newPosition = VEC3.sum(cubePosition, direction);
        Entities.editEntity(cubeID, {
            position: newPosition
        })
    };
    
    // controllerMapping.from(Controller.Standard.LX).to(function(value) {
    //     log(LOG_VALUE, "Value", value);

    //     if (changeablePitch && (value > 0.3 || value < -0.3)) {
    //         snapPitch(value);
    //         changeablePitch = false;

    //         Script.setTimeout(function () {
    //             changeablePitch = true;
    //         }, TIMEOUT_PITCH);
    //     }

    // });

    // controllerMapping.from(Controller.Standard.RY).to(function(value) {
    //     if (changeableYaw && (value > 0.3 || value < -0.3)) {
    //         snapYaw(value);
    //         changeableYaw = false;

    //         Script.setTimeout(function () {
    //             changeableYaw = true;
    //         }, TIMEOUT_YAW);
    //     }
    // });

    // controllerMapping.from(Controller.Standard.LS).to(function(value) {
    //     log(LOG_VALUE, "Value", value);

    //     moveCube(vec(0, -value, 0));
    // });

    // controllerMapping.from(Controller.Standard.LY).to(function(value) {
    //     log(LOG_ARCHIVE, "Value", value);
    //     moveCube(vec(0, -value, 0));
    // });

    // controllerMapping.from(Controller.Standard.LX).to(function(value) {
    //     log(LOG_ARCHIVE, "Value", value);
    //     moveCube(vec(value,0,0));
    // });

    // controllerMapping.from(Controller.Standard.RY).to(function(value) {
    //     log(LOG_ARCHIVE, "Value", value);
    //     moveCube(vec(0, 0, value));
    // });

    // controllerMapping.from(Controller.Standard.RX).to(function(value) {
    //     log(LOG_ARCHIVE, "Value", value);
    //     var currentCubeRotation = Entities.getEntityProperties(cubeID, ["rotation"]).rotation;
    //     var forwardDirection = Quat.getForward(MyAvatar);
    //     log(LOG_ARCHIVE, "forwardDirection", forwardDirection);

    //     if (value > 0 ) {
    //         var rotation = VEC3.multiplyQbyV(Quat.fromPitchYawRollDegrees(0, 90, 0 ), forwardDirection);
    //         log(LOG_ARCHIVE, "rotation", rotation);
    //         var quatRotation = Quat.rotationBetween(forwardDirection, rotation);
    //         log(LOG_ARCHIVE, "quatRotation", quatRotation);

    //         Entities.editEntity(cubeID, {
    //             rotation: quatRotation
    //         });
    //     } 

    //     if (value < 0 ) {
    //         var rotation = VEC3.multiplyQbyV(Quat.fromPitchYawRollDegrees(0, -90, 0 ), forwardDirection);
    //         log(LOG_ARCHIVE, "rotation", rotation);
    //         var quatRotation = Quat.rotationBetween(forwardDirection, rotation);
    //         log(LOG_ARCHIVE, "quatRotation", quatRotation);

    //         Entities.editEntity(cubeID, {
    //             rotation: quatRotation
    //         });
    //     }

    //     moveCube(vec(value,0));
    // });

    
    
    // function snapYaw (direction) {
    //     // invisible cube guiding avatar forward

    //     var change = direction > 0 ? QUAT_LEFT : QUAT_RIGHT;
    //     var newYaw = curYaw + DELTA_YAW * change;

    //     if (newYaw > 90 || newYaw < -90) {
    //         // do not use
    //         return;
    //     } else {
    //         MyAvatar.bodyYaw = newYaw;
    //         Entities.editEntity(cubeID, {
    //             rotation: MyAvatar.orientation
    //         });
    //     }
    // }

    
    */
