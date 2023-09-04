let roleRepairer = {
 
    run: function(creep) {
        // Check if there are any harvesters in the room
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');

        if(harvesters.length <= 2){
            // Work as a harvester if no harvester is present
            creep.say('🔄 HARVEST');
            if(creep.store.getFreeCapacity() > 0) {
                let source = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
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
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
        else{
            // Do repairer's job
            if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.repairing = false;
                creep.say('🔄 harvest');
            }
            if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
                creep.memory.repairing = true;
                creep.say('🔧 repair');
            }
        
            if(creep.memory.repairing) {
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        // Exclude walls and roads from repair targets
                        return (
                            structure.hits < structure.hitsMax &&
                            structure.structureType !== STRUCTURE_WALL &&
                            structure.structureType !== STRUCTURE_ROAD
                        );
                    }
                });
                if(targets.length) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else{
                    creep.moveTo(40, 40);
                }
            }
            else {
                let source = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        
    }
};

module.exports = roleRepairer;
