let roleHarvester = require("role.harvester");
let roleUpgrader = require("role.upgrader");
let roleBuilder = require("role.builder");
let roleDefender = require("role.defender");
let roleRepairer = require("role.repairer");

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
    [Role.REMOTE_HARVESTER, [WORK, CARRY, MOVE]],
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

// Main loop
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

    // Remove dead creeps from the memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    
    // Check the number of harvesters
    let n_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + n_harvesters.length);

    if(n_harvesters.length < 4 && Game.spawns["Spawn1"].room.energyAvailable >= calculateCost(roleBodyMap.get(Role.HARVESTER))) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(roleBodyMap.get(Role.HARVESTER), newName,
            {memory: {role: 'harvester'}});
    }

    // Check the number of defenders
    let n_defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    console.log('Defenders: ' + n_defenders.length);

    if(n_defenders.length < 3 && Game.spawns["Spawn1"].room.energyAvailable >= calculateCost(roleBodyMap.get(Role.DEFENDER))) {
        var newName = 'Defender' + Game.time;
        console.log('Spawning new defender: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(roleBodyMap.get(Role.DEFENDER), newName,
            {memory: {role: 'defender'}});
    }

    // Check the number of builders
    let n_builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + n_builders.length);

    if(n_builders.length < 4 && Game.spawns["Spawn1"].room.energyAvailable >= calculateCost(roleBodyMap.get(Role.BUILDER))) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(roleBodyMap.get(Role.BUILDER), newName,
            {memory: {role: 'builder'}});
    }

    // Check the number of upgraders
    let n_upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + n_upgraders.length);

    if(n_upgraders.length < 3 && Game.spawns["Spawn1"].room.energyAvailable >= calculateCost(roleBodyMap.get(Role.UPGRADER))) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(roleBodyMap.get(Role.UPGRADER), newName,
            {memory: {role: 'upgrader'}});
    }

    // Check the number of repairers
    let n_repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    console.log('Repairers: ' + n_repairers.length);

    if(n_repairers.length < 2 && Game.spawns["Spawn1"].room.energyAvailable >= calculateCost(roleBodyMap.get(Role.REPAIRER))) {
        var newName = 'Repairer' + Game.time;
        console.log('Spawning new repairer: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(roleBodyMap.get(Role.REPAIRER), newName,
            {memory: {role: 'repairer'}});
    }

    // Make each creep do irs coeesponding job
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
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}
