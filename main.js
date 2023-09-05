let modePhase1 = require("mode.phase1");
let modePhase2 = require("mode.phase2");

const currentRoom = Game.spawns["Spawn1"].room;
let controllerLevel = 0;
let totalEnergyCapacity = 0;

if (currentRoom.controller) {    
    controllerLevel = currentRoom.controller.level;

    const extensions = currentRoom.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
    });
    const extensionsEnergyCapacity = extensions.reduce((total, extension) => {
        return total + extension.store.getCapacity(RESOURCE_ENERGY);
    }, 0);
    
    totalEnergyCapacity = extensionsEnergyCapacity + Game.spawns["Spawn1"].getCapacity(RESOURCE_ENERGY);
}


// Main loop
if(controllerLevel >= 3 && totalEnergyCapacity >= 400){
    module.exports.loop = modePhase2;
}
else{
    module.exports.loop = modePhase1;
}
