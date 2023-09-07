let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            let nonRoadWallTargets = targets.filter(target => {
                return (
                    (target.structureType !== STRUCTURE_ROAD) &&
                    (target.structureType !== STRUCTURE_WALL)
                );
            });
            let roadWallTargets = targets.filter(target => {
                return (
                    (target.structureType === STRUCTURE_ROAD) ||
                    (target.structureType === STRUCTURE_WALL)
                );
            });
            if(nonRoadWallTargets.length) {
                if(creep.build(nonRoadWallTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nonRoadWallTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if(roadWallTargets.length){
                if(creep.build(roadWallTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(roadWallTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;
