let roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            // Attack the enemy if found
            creep.say("🔪🔪");
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffcccb' } });
            }
        }
        else{
            // Randomly move to a new position if no enemy found
            /*
            let xPos = Math.floor(Math.random() * 50);
            let yPos = Math.floor(Math.random() * 50);
            creep.moveTo(xPos, yPos);
            */
            // If no hostile creeps are present, patrol between waypoints
            let waypoints = [{ x: 12, y: 10 }, 
                             { x: 9, y: 27 }, 
                             { x: 13, y: 44 }, 
                             { x: 27, y: 38 }, 
                             { x: 43, y: 35 }, 
                             { x: 39, y: 22 },
                             { x: 24, y: 19 },
                            ];
            let currentWaypoint = creep.memory.waypoint || 0;

            if (Math.abs(creep.pos.x - waypoints[currentWaypoint].x) <= 3 && Math.abs(creep.pos.y - waypoints[currentWaypoint].y) <= 3) {
                currentWaypoint = (currentWaypoint + 1) % waypoints.length;
            }

            // Store the index of current waypoint in memory
            creep.memory.waypoint = currentWaypoint;

            // Move toward the current waypoint
            const targetPosition = new RoomPosition(waypoints[currentWaypoint].x, waypoints[currentWaypoint].y, creep.room.name);
            creep.moveTo(targetPosition, { visualizePathStyle: { stroke: '#fadede' } });
            creep.say("💤");
        }
    }
};

module.exports = roleDefender;
