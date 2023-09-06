let modePhase1 = require("mode.phase1");
let modePhase2 = require("mode.phase2");
let modeDefense = require("mode.defense");

const roomMode = {
    'phase1': 1,
    'phase2': 2,
    'defense': 3,
};

module.exports = {
    run: function (roomName) {
        const roomMemory = Memory.rooms[roomName];

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
