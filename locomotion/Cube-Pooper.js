(function() { 

    var FORWARD_VELOCITY = 3;
    
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
        cubeID = Entities.addEntity({ type: "Box", collisonless: true, position: inFrontOf(1) });

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

    controllerMapping.from(Controller.Standard.LS).to(function(value) {
        log(LOG_VALUE, "Value", value);
        moveCube(vec(0, -value, 0));
    });

    controllerMapping.from(Controller.Standard.LY).to(function(value) {
        log(LOG_ARCHIVE, "Value", value);
        moveCube(vec(0, -value, 0));
    });

    controllerMapping.from(Controller.Standard.LX).to(function(value) {
        log(LOG_ARCHIVE, "Value", value);
        moveCube(vec(value,0,0));
    });

    controllerMapping.from(Controller.Standard.RY).to(function(value) {
        log(LOG_ARCHIVE, "Value", value);
        moveCube(vec(0, 0, value));
    });

    controllerMapping.from(Controller.Standard.RX).to(function(value) {
        log(LOG_ARCHIVE, "Value", value);
        var currentCubeRotation = Entities.getEntityProperties(cubeID, ["rotation"]).rotation;
        var forwardDirection = Quat.getForward(currentCubeRotation);
        log(LOG_ARCHIVE, "forwardDirection", forwardDirection);
        if (value > 0 ) {
            var rotation = VEC3.multiplyQbyV(Quat.fromPitchYawRollDegrees(0, 90, 0 ), forwardDirection);
            log(LOG_ARCHIVE, "rotation", rotation);
            var quatRotation = Quat.rotationBetween(forwardDirection, rotation);
            log(LOG_ARCHIVE, "quatRotation", quatRotation);

            Entities.editEntity(cubeID, {
                rotation: quatRotation
            });
        } 

        if (value < 0 ) {
            var rotation = VEC3.multiplyQbyV(Quat.fromPitchYawRollDegrees(0, -90, 0 ), forwardDirection);
            log(LOG_ARCHIVE, "rotation", rotation);
            var quatRotation = Quat.rotationBetween(forwardDirection, rotation);
            log(LOG_ARCHIVE, "quatRotation", quatRotation);

            Entities.editEntity(cubeID, {
                rotation: quatRotation
            });
        }

        moveCube(vec(value,0));
    });

    Controller.enableMapping(MAPPING_NAME);

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
    
