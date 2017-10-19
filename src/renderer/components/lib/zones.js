'use strict';

Date.prototype.stdTimezoneOffset = function() {
    let jan = new Date(this.getFullYear(), 0, 1);
    let jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.isDST = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

export default [
 {
     std: 'EST',
     dst: 'EDT',
     display: 'Eastern',
     id: 'America/New_York',
     dstOffset: -4,
     stdOffset: -5
 },
 {
    std: 'CST',
    dst: 'CDT',
    id: 'America/Chicago',
    display: 'Central',
    dstOffset: -5,
    stdOffset: -6
},
{
    std: 'MST',
    dst: 'MDT',
    display: 'Mountain',
    id: 'America/Denver',
    dstOffset: -6,
    stdOffset: -7
},
{
    std: 'MST',
    dst: 'MST',
    display: 'Arizona',
    id: 'America/Phoenix',
    dstOffset: -6,
    stdOffset: -6
},
{
    std: 'PST',
    dst: 'PDT',
    display: 'Pacific',
    id: 'America/Los_Angeles',
    dstOffset: -7,
    stdOffset: -8
},
{
    std: 'AKST',
    dst: 'AKDT',
    display: 'Alaska',
    id: 'America/Anchorage',
    dstOffset: -8,
    stdOffset: -9
},
{
    std: 'HST',
    dst: 'HST',
    display: 'Hawaii',
    id: 'Pacific/Honolulu',
    stdOffset: -10,
    dstOffset: 10
},
];