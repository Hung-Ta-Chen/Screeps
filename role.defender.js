let roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            // Attack the enemy if found
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else{
            // Randomly move to a new position if no enemy found
            let xPos = Math.floor(Math.random() * 50);
            let yPos = Math.floor(Math.random() * 50);
            creep.moveTo(xPos, yPos);
        }
    }
};

module.exports = roleDefender;
