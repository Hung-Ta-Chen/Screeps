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

// Define a map between the name of a role and its corresponding costant
const roleNameConstantMap = {
    'harvester': Role.HARVESTER,
    'hauler': Role.HAULER,
    'builder': Role.BUILDER,
    'upgrader': Role.UPGRADER,
    'defender': Role.DEFENDER,
    'remote harvester': Role.REMOTE_HARVESTER,
    'scout': Role.SCOUT,
    'claimer': Role.CLAIMER,
    'miner': Role.MINER,
    'repairer': Role.REPAIRER,
    'reserver': Role.RESERVER,
    'attacker': Role.ATTACKER,
};

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


module.exports = {
    Role,
    roleNameConstantMap,
    calculateCost,
};
