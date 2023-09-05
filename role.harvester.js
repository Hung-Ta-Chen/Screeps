let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('🚗 transfer');
        }
        if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
        }

        
        if(creep.memory.harvesting) {
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                // Find the structure with most free energy capacity
                let maxfreeCapacity = 0;
                let structureMaxFreeCapacity = targets[0];
                for(let target of targets){
                    if(target.store.getFreeCapacity(RESOURCE_ENERGY) > maxfreeCapacity){
                        maxfreeCapacity = target.store.getFreeCapacity(RESOURCE_ENERGY);
                        structureMaxFreeCapacity = target;
                    }
                }
                // Transfer the energy
                if(creep.transfer(structureMaxFreeCapacity, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureMaxFreeCapacity, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;
