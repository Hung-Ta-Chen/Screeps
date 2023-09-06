let roleHarvester = require("role.harvester");
let roleUpgrader = require("role.upgrader");
let roleBuilder = require("role.builder");
let roleDefender = require("role.defender");
let roleRepairer = require("role.repairer");
const { Role, roleNameConstantMap, calculateCost } = require('constants');



// Define body parts of each role
const roleBodyMap = new Map([
    [Role.HARVESTER, [WORK, WORK, CARRY, CARRY, MOVE]],
    [Role.HAULER, [CARRY, CARRY, MOVE]],
    [Role.BUILDER, [WORK, WORK, CARRY, CARRY, MOVE]],
    [Role.UPGRADER, [WORK, WORK, CARRY, CARRY, MOVE]],
    [Role.DEFENDER, [TOUGH, ATTACK, MOVE]],
    [Role.REMOTE_HARVESTER, [WORK, CARRY, MOVE]],
    [Role.SCOUT, [MOVE]],
    [Role.CLAIMER, [CLAIM, MOVE]],
    [Role.MINER, [WORK, CARRY, MOVE]],
    [Role.REPAIRER, [WORK, WORK, CARRY, CARRY, MOVE]],
    [Role.RESERVER, [CLAIM, MOVE]],
    [Role.ATTACKER, [TOUGH, ATTACK, MOVE]],
]);


// Define the target number of each role
const roleTargetCount = {
    'harvester': 4,
    'builder': 3,
    'defender': 3,
    'repairer': 3, 
    'upgrader': 3,
};


let modePhase2 = function (roomName) {
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

    const creepsInRoom = _.filter(Game.creeps, (creep) => creep.room.name === roomName);
    const spawnsInRoom = _.filter(Game.spawns, (spawn) => spawn.room.name === roomName);
    
    // Remove dead creeps from the memory
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            // Check if the creep has a spawning property
            if (!Memory.creeps[name].spawning) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }


    // Calculate the priority of each role based on their current count
    let rolePriorityList = {};
    for(let role in roleTargetCount){
        let roleCount = _.filter(creepsInRoom, (creep) => creep.memory.role == role).length;
        let rolePriority = roleTargetCount[role] - roleCount;

        rolePriorityList[role] = rolePriority;
    }

    // Generate a creep of the role with the highest priority
    let highestPriority = -1000;
    let highestPriorityRole = null;
    for(let role in roleTargetCount){
        if(rolePriorityList[role] > highestPriority){
            highestPriority = rolePriorityList[role];
            highestPriorityRole = role;
        }
    }

    if(highestPriorityRole && Game.rooms[roomName].energyAvailable >= calculateCost(roleBodyMap.get(roleNameConstantMap[highestPriorityRole]))){
        var newName = highestPriorityRole + Game.time;
        console.log(`[${roomName}] ` + 'Spawning new ' + highestPriorityRole + ': ' + newName);
        spawnsInRoom[0].spawnCreep(roleBodyMap.get(roleNameConstantMap[highestPriorityRole]), newName,
            {memory: {role: highestPriorityRole}});
    }

    let n_repairers = _.filter(creepsInRoom, (creep) => creep.memory.role == 'repairer');
    let n_builders = _.filter(creepsInRoom, (creep) => creep.memory.role == 'builder');
    let n_defenders = _.filter(creepsInRoom, (creep) => creep.memory.role == 'defender');
    let n_upgraders = _.filter(creepsInRoom, (creep) => creep.memory.role == 'upgrader');
    let n_harvesters = _.filter(creepsInRoom, (creep) => creep.memory.role == 'harvester');
    let numString = `[${roomName}] ` + 
                    `Harvesters: ${n_harvesters.length}, ` + 
                    `Defenders: ${n_defenders.length}, ` + 
                    `Repairers: ${n_repairers.length}, ` +
                    `Upgraders: ${n_upgraders.length}, ` + 
                    `Builders: ${n_builders.length}`;
    console.log(numString);

    
    // Make each creep do its corresponding job
    for(let name in creepsInRoom) {
        let creep = creepsInRoom[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}


module.exports = modePhase2;
