// Entity method for initiate game block

// parse userData

// wait for hand swipe when all players are ready
// when car entities are chosen wait for them to have alpha 0.5 to indicate a car color has been chosen

// on start
// spawn everyone to places
// 1,2,3 start overlay? nice to have
// On every client
    // add locomotion script

// may have issues others starting another game
    

// server script has:
     // avatarList
     // pushAvatartoGameList(uuid)
     // resetAvatarList()
     // gameStart
     // gameEnd
     // avatarDefeated()
     //


(function (){

    var entityID;
    var CAR_AVATAR_NAME = "car";
    var HALF = 0.5;
    var ONE_AND_HALF = 1.5;
    
    var checkHandInterval;
    var carList = [];
    var avatarList = []; // should be on a server script
    var locations;

    function startGame () {
        // call server script method to get list of AvatarIDs
        try {
            // parse server data string

        } catch (err){
            console.log(err);
        }

        // change color of startGameBox

        // interval for endGame? To watch for which avatar is defeated and there's only 1 left.
        // interval on spectator box? then calls winner function 
        
        // set avatar list in server script to []
    }

    function endGame(winnerID) { // probably two arguments
        // remotely callable method
        // teleport all avatars from the participant box onto beginning platform

        // teleport winner ID to the winner spot with confetti!

    }

    function findParticipants (avatarList) {
        // add a interval that checks server script if a game started then call this method

        var properties = Entities.getEntityProperties(entityID, ["position"]);

        for (var i = 0; i < avatarList.length; i++) {
            var searchItem = avatarsInRange[i];
            if (avatarsInRange.indexOf(MyAvatar.sessionUUID) > -1) {
                Window.location.handleLookupString(_backupLocation);
            }
        }
    }

    function parseUserData (data) {

        try {
            var userData = JSON.parse(data);
        } catch (err) {
            console.error(err);
        }

        if (userData && userData.locations)
            locations = userData.locations;
    }
    
    function isColliding(vector3) {
        // does not factor in rotation

        var properties = Entities.getEntityProperties(entityID, ["position", "dimensions"]);
        var dimensions = properties.dimensions;
        var position = properties.position;

        var minX = position.x - dimensions.x * HALF;
        var maxX = position.x + dimensions.x * HALF;
        var minY = position.y + dimensions.y * HALF; // is at top of box
        var maxY = position.y + dimensions.y * ONE_AND_HALF; // is above box
        var minZ = position.z - dimensions.z * HALF;
        var maxZ = position.z + dimensions.z * HALF;

        if (vector3.x >= minX && vector3.x <= maxX
            && vector3.y >= minY && vector3.y <= maxY
            && vector3.z >= minZ && vector3.z <= maxZ) {
            return true;
        } else {
            return false;
        }
    }

    var Start = function () {

    }

    Start.prototype = {
        preload: function (id) {
            entityID = id;

            var properties = Entities.getEntityProperties(entityID, ["position", userData]);
            var carEntities = Entities.findEntitiesByName(CAR_AVATAR_NAME, properties.position, 20);

            carList = carEntities;

            checkHandInterval = Script.setInterval(function () {

                var properties = Entities.getEntityProperties(entityID, "position");

                if (Vec3.distance(MyAvatar.position, properties.position) < MIN_DISTANCE_CHECK) {
                    var leftHandIndex = MyAvatar.getJointIndex("LeftHandIndex3");
                    var rightHandIndex = MyAvatar.getJointIndex("RightHandIndex3");

                    var leftPosition = MyAvatar.getJointPosition(leftHandIndex);
                    var rightPosition = MyAvatar.getJointPosition(rightHandIndex); 

                    var hasCollision = isColliding(leftPosition) || isColliding(rightPosition);
                    if (hasCollision && !timeOutSet) {
                        toggleInstrumentGrabbable();
                        timeOutSet = true;
                        Script.setTimeout(function() {
                            timeOutSet = false;
                        }, IS_TOGGLEABLE_TIMEOUT);
                    }
                }

            }, CHECK_INTERVAL);
        },
        addAvatarToQueue: function () {
            // remotely callable method 

            // when avatars put on the avatar cars 
            // can look for avatars wearing the cars or should be in a server entity script to always be running

            // call server script method
        },

        resetAvatarQueue: function () {
            // call server script method
        },

        unload: function () {

        }
    }


})();