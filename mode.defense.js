let roleHarvester = require("role.harvester");
let roleUpgrader = require("role.upgrader");
let roleBuilder = require("role.builder");
let roleDefender = require("role.defender");
let roleRepairer = require("role.repairer");
const { Role, roleNameConstantMap, calculateCost } = require('constants');



// Define body parts of each role
const roleBodyMap = new Map([
    [Role.HARVESTER, [WORK, CARRY, MOVE]],
    [Role.HAULER, [CARRY, CARRY, MOVE]],
    [Role.BUILDER, [WORK, CARRY, MOVE]],
    [Role.UPGRADER, [WORK, CARRY, MOVE]],
    [Role.DEFENDER, [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE]],
    [Role.REMOTE_HARVESTER, [WORK, CARRY, MOVE]],
    [Role.SCOUT, [MOVE]],
    [Role.CLAIMER, [CLAIM, MOVE]],
    [Role.MINER, [WORK, CARRY, MOVE]],
    [Role.REPAIRER, [WORK, CARRY, MOVE]],
    [Role.RESERVER, [CLAIM, MOVE]],
    [Role.ATTACKER, [TOUGH, ATTACK, MOVE]],
]);


// Define the target number of each role
const roleTargetCount = {
    'harvester': 4,
    'builder': 0,
    'defender': 15,
    'repairer': 0, 
    'upgrader': 1,
};

let modeDefense = function () {
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
        let roleCount = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
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

    if(highestPriorityRole && Game.spawns["Spawn1"].room.energyAvailable >= calculateCost(roleBodyMap.get(roleNameConstantMap[highestPriorityRole]))){
        var newName = highestPriorityRole + Game.time;
        console.log('Spawning new ' + highestPriorityRole + ': ' + newName);
        Game.spawns['Spawn1'].spawnCreep(roleBodyMap.get(roleNameConstantMap[highestPriorityRole]), newName,
            {memory: {role: highestPriorityRole}});
    }

    let n_repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    let n_builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let n_defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    let n_upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    let n_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    let numString = `Harvesters: ${n_harvesters.length}, ` + 
                    `Defenders: ${n_defenders.length}, ` + 
                    `Repairers: ${n_repairers.length}, ` +
                    `Upgraders: ${n_upgraders.length}, ` + 
                    `Builders: ${n_builders.length}`;
    console.log(numString);

    
    // Make each creep do its corresponding job
    // Also make everyone other than defensers and upgraders go harvesting 
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
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
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleHarvester.run(creep);
        }
    }
}


module.exports = modeDefense;