let roleRepairer = {
  
    run: function(creep) {
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (target) {
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleRepairer;
