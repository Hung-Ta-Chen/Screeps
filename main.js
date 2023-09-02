let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');

// Define constants for roles
const Role = {
    HARVESTER: 0,
    HAULER: 1,
    BUILDER: 2,
    UPGRADER: 3,
    DEFENDER: 4,
    REMOTE_HARVESTER: 5,
    SCOUT: 6,
    CLAIMER: 7,
    MINER: 8,
    REPAIRER: 9,
    RESERVER: 10,
    ATTACKER: 11,
};

// Body parts of each role
const roleBodyMap = new Map([
    [Role.HARVESTER, [WORK, CARRY, MOVE]],
    [Role.HAULER, [CARRY, CARRY, MOVE]],
    [Role.BUILDER, [WORK, CARRY, MOVE]],
    [Role.UPGRADER, [WORK, CARRY, MOVE]],
    [Role.DEFENDER, [TOUGH, ATTACK, MOVE]],
    [Role.REMOTE_HARVESTER], [WORK, CARRY, MOVE]],
    [Role.SCOUT, [MOVE]],
    [Role.CLAIMER, [CLAIM, MOVE]],
    [Role.MINER, [WORK, CARRY, MOVE]],
    [Role.REPAIRER, [WORK, CARRY, MOVE]],
    [Role.RESERVER, [CLAIM, MOVE]],
    [Role.ATTACKER, [TOUGH, ATTACK, MOVE]],
]);

// Calculate the cost of creating a creep
function calculateCost(bodyParts){
    let costMap = new Map([
        [MOVE, 50],
        [WORK, 100],
        [CARRY, 50],
        [ATTACK, 80],
        [RANGED_ATTACK, 150],
        [HEAL, 250],
        [CLAIM, 600],
        [TOUGH, 10],
    ]);

    let cost = 0;
    for(let bodyPart of bodyParts){
        cost += costMap.get(bodyPart);
    }
    return cost;
}

module.exports.loop = function () {
    /*
    let tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    */

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
