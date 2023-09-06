module.exports.loop = function () {
    // Initialize rooms in Memory if they are not already
    for (const roomName in Game.rooms) {
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {
                manager: {
                    module: 'roomManager',
                    enabled: true, 
                },
                controllerLevel: Game.rooms[roomName].controller.level,
                mode: 0,
            };
        }
    }

    // Iterate over rooms and call room-specific managers
    for (const roomName in Memory.rooms) {
        const roomMemory = Memory.rooms[roomName];

        // Check if the room has a manager and it's enabled
        if (roomMemory.manager && roomMemory.manager.enabled) {
            const managerModule = require(roomMemory.manager.module);
            managerModule.run(roomName);
        }
    }
};
