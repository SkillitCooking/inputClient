'use strict';

let date1 = new Date(Date.UTC(2015, 11, 12, 12, 12));
let date2 = new Date(2015, 11, 12, -24, 12);
console.log('offset1', date1.getTimezoneOffset());
console.log('toIso1', date1.toISOString());
console.log('offset2', date2.getTimezoneOffset());
console.log('toIso2', date2.toISOString());