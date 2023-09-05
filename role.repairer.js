// Define repairer states as constants
const RepairerState = {
    Harvesting: 'harvesting',
    Repairing: 'repairing',
    Helping: 'helping',
};

let roleHarvester = require("role.harvester");

let roleRepairer = {
 
    run: function(creep) {
        // Check if there are any harvesters in the room
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');

        if(harvesters.length <= 2){
            // Work as a harvester if no harvester is present
            roleHarvester.run(creep);
        }
        else{
            // Do repairer's job
            // Initialize repairer state if not already set
            creep.memory.repairerState = creep.memory.repairerState || RepairerState.Harvesting;

            // Find if there's any structure with hits less than half
            var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                // Exclude walls and roads from repair targets
                                return (
                                    structure.hits <= (structure.hitsMax) / 2 &&
                                    structure.structureType !== STRUCTURE_WALL
                                );
                            }
                        });

            // If no structure with hits less than half, find any damaged structure
            if(targets.length === 0){
                targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                // Exclude walls and roads from repair targets
                                return (
                                    structure.hits < structure.hitsMax &&
                                    structure.structureType !== STRUCTURE_WALL
                                );
                            }
                        });
            }
            
            
            // Handle state transitions
            if(targets.length === 0){
                creep.memory.repairerState = RepairerState.Helping;
                creep.say('🤝 Help');
            }
            else{
                if (creep.memory.repairerState === RepairerState.Repairing && creep.store[RESOURCE_ENERGY] === 0) {
                    creep.memory.repairerState = RepairerState.Harvesting;
                    creep.say('🔄 harvest');
                }
                if (creep.memory.repairerState === RepairerState.Repairing && creep.store[RESOURCE_ENERGY] > 0) {
                    // Do nothing
                }
                if (creep.memory.repairerState === RepairerState.Harvesting && creep.store.getFreeCapacity() === 0) {
                    creep.memory.repairerState = RepairerState.Repairing;
                    creep.say('🔧 repair');
                }
                if (creep.memory.repairerState === RepairerState.Harvesting && creep.store.getFreeCapacity() > 0) {
                    // Do nothing
                }
                if (creep.memory.repairerState === RepairerState.Helping && creep.store[RESOURCE_ENERGY] === 0) {
                    creep.memory.repairerState = RepairerState.Harvesting;
                    creep.say('🔄 harvest');
                }
                if (creep.memory.repairerState === RepairerState.Helping && creep.store[RESOURCE_ENERGY] > 0) {
                    creep.memory.repairerState = RepairerState.Repairing;
                    creep.say('🔧 repair');
                }
            }
    

            // Implement behavior based on the current state
            switch (creep.memory.repairerState) {
                case RepairerState.Repairing:                    
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    break;
    
                case RepairerState.Harvesting:
                    let sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                    break;
    
                case RepairerState.Helping:
                    roleHarvester.run(creep);
                    break;
            }
        } 
    }
};

module.exports = roleRepairer;
