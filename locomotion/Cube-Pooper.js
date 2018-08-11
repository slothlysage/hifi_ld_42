(function() { 

    var FORWARD_VELOCITY = { x: 0, y: 0, z: -1}; // m/s
    var DELTA_PITCH = 15;
    var DELTA_YAW = 15;
    var TIMEOUT_PITCH = 100;
    var TIMEOUT_YAW = 100;
    var changeableYaw = true;
    var changeablePitch = true;

    var curCubePitch;
    var curCubeYaw;
    
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

    // Init
    // /////////////////////////////////////////////////////////////////////////
    var controllerMapping = null,
        cubeID = Entities.addEntity({ 
            type: "Box", 
            collisonless: true, 
            position: MyAvatar.position,
            rotation: MyAvatar.orientation,
            velocity: FORWARD_VELOCITY,
            damping: 0
         });

        Entities

        curCubePitch = MyAvatar.bodyPitch;
        curCubeYaw = MyAvatar.bodyYaw;

    MyAvatar.orientation = Quat.fromPitchYawRollDegrees(0,0,0);
    
    // Consts
    // /////////////////////////////////////////////////////////////////////////
    var MAPPING_NAME = "Cube-Pooper";

    // Constructor
    // /////////////////////////////////////////////////////////////////////////

    // Collections
    // /////////////////////////////////////////////////////////////////////////
    // var 

    // Helper Functions
    // /////////////////////////////////////////////////////////////////////////
    function moveCube(direction) {
        var cubePosition = Entities.getEntityProperties(cubeID, ["position"]).position;
        var newPosition = VEC3.sum(cubePosition, direction);
        Entities.editEntity(cubeID, {
            position: newPosition
        })
    };

    // Procedural Functions
    // /////////////////////////////////////////////////////////////////////////


    // Main
    // /////////////////////////////////////////////////////////////////////////

    controllerMapping = Controller.newMapping(MAPPING_NAME);

    // R STICK UP DOWN SNAP PITCH
    function snapPitch (direction) {
        // invisible cube guiding avatar forward

        var change = direction > 0 ? 1 : -1;
        var curPitch = curCubePitch;
        var newPitch = curPitch + DELTA_PITCH * change;
        var properties = Entities.getEntityProperties(cubeID, "rotation");
        var properties 

        if (newPitch > 90 || newPitch < -90) {
            // do not use
            return;
        } else {
            curCubePitch = newPitch;
            Entities.editEntity(cubeID, {
                rotation: 
            });
        }
    }

    // L STICK LEFT RIGHT SNAP YAW
    function snapYaw (direction) {
        // invisible cube guiding avatar forward

        var change = direction > 0 ? 1 : -1;
        var curYaw = MyAvatar.bodyYaw;
        var newYaw = curYaw + DELTA_YAW * change;

        if (newYaw > 90 || newYaw < -90) {
            // do not use
            return;
        } else {
            MyAvatar.bodyYaw = newYaw;
            Entities.editEntity(cubeID, {
                rotation: MyAvatar.orientation
            });
        }
    }

    
    
    controllerMapping.from(Controller.Standard.RY).to(function(value) {
        log(LOG_VALUE, "Value", value);

        if (changeablePitch && (value > 0.3 || value < -0.3)) {
            snapPitch(value);
            changeablePitch = false;

            Script.setTimeout(function () {
                changeablePitch = true;
            }, TIMEOUT_PITCH);
        }

    });

    var noop = function () {};

    controllerMapping.from(Controller.Standard.RX).to(noop);
    controllerMapping.from(Controller.Standard.LY).to(noop);

    controllerMapping.from(Controller.Standard.LX).to(function(value) {
        if (changeableYaw && (value > 0.3 || value < -0.3)) {
            snapYaw(value);
            changeableYaw = false;

            Script.setTimeout(function () {
                changeableYaw = true;
            }, TIMEOUT_YAW);
        }
    });

    
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

    // Controller.enableMapping(MAPPING_NAME);

    MyAvatar.setParentID(cubeID);

    // Cleanup
    // /////////////////////////////////////////////////////////////////////////
    function scriptEnding() {
        console.log("### in script ending");
        Controller.disableMapping(MAPPING_NAME);
        Entities.deleteEntity(cubeID);
        
    }    

    Script.scriptEnding.connect(scriptEnding);
})();
    
