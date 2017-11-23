'use strict';

export function recipeSeasoningCmp(seasonA, seasonB) {
    if(seasonA.selected && seasonB.selected) {
        if(!seasonA.presentOrder && !seasonB.presentOrder) return 0;
        else if(!seasonA.presentOrder) return 1;
        else if(!seasonB.presentOrder) return -1;
        else if(seasonA.presentOrder < seasonB.presentOrder) return -1;
        else return 1;
    } else if(seasonA.selected) return -1;
    else if(seasonB.selected) return 1;
    else return 0;
};