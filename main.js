let modePhase1 = require("mode.phase1");
let modePhase2 = require("mode.phase2");
let modeDefense = require("mode.defense");

const currentRoom = Game.spawns["Spawn1"].room;
let controllerLevel = 0;
let totalEnergyCapacity = 0;

if (currentRoom.controller) {    
    // Get the level of the controller
    controllerLevel = currentRoom.controller.level;

    // Calculate the max energy capacity
    const extensions = currentRoom.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
    });
    const extensionsEnergyCapacity = extensions.reduce((total, extension) => {
        return total + extension.store.getCapacity(RESOURCE_ENERGY);
    }, 0); 
    totalEnergyCapacity = extensionsEnergyCapacity + Game.spawns["Spawn1"].store.getCapacity(RESOURCE_ENERGY);
}

// Detect hostile creeps
const hostileCreeps = currentRoom.find(FIND_HOSTILE_CREEPS);


// Main loop
if(hostileCreeps.length > 0){
    // Enter defense mode if any hostile creep detected
    module.exports.loop = modeDefense;
}
else{
    if(controllerLevel >= 3 && totalEnergyCapacity >= 400){
        module.exports.loop = modePhase2;
    }
    else{
        module.exports.loop = modePhase1;
    }
}

