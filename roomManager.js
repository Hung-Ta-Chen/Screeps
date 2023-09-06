let modePhase1 = require("mode.phase1");
let modePhase2 = require("mode.phase2");
let modeDefense = require("mode.defense");

const roomMode = {
    'phase1': 1,
    'phase2': 2,
    'defense': 3,
};

let roomManager = {
    run: function (roomName) {
        const roomMemory = Memory.rooms[roomName];

        const currentRoom = Game.rooms[roomName];
        let totalEnergyCapacity = 0;       
        if (currentRoom.controller) {    
            // Get the level of the controller
            roomMemory.controllerLevel = currentRoom.controller.level;
        
            // Calculate the max energy capacity
            const extensions = currentRoom.find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
            });
            const extensionsEnergyCapacity = extensions.reduce((total, extension) => {
                return total + extension.store.getCapacity(RESOURCE_ENERGY);
            }, 0); 
            totalEnergyCapacity = extensionsEnergyCapacity + (_.filter(Game.spawns, (spawn) => spawn.room.name === roomName))[0].store.getCapacity(RESOURCE_ENERGY);
        }
        
        // Detect hostile creeps
        const hostileCreeps = currentRoom.find(FIND_HOSTILE_CREEPS);

        
        // Change the mode of the room
        if(hostileCreeps.length > 0){
            // Enter defense mode if any hostile creep detected
            roomMemory.mode = roomMode['defense'];
        }
        else{
            if(roomMemory.controllerLevel >= 3 && totalEnergyCapacity >= 400){
                roomMemory.mode = roomMode['phase2'];
            }
            else{
                roomMemory.mode = roomMode['phase1'];
            }
        }

        
        // Each room do the action corresponding to its mode
        switch(roomMemory.mode){
            case roomMode['defense']:
                modeDefense(roomName);
                break;

            case roomMode['phase2']:
                modePhase2(roomName);
                break;

            case roomMode['phase1']:
                modePhase1(roomName);
                break;
        }       
    },
};


module.exports = roomManager;
