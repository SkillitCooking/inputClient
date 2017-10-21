<template>
  <div>
      <div class="field is-horizontal">
          <div class="field-body">
              <div class="field">
                  <input type="text"
                   v-validate="{rules: {regex: /^((00|10|11|12|13|14|15|16|17|18|19|20|21|22|23)|[0-9]):[0-5][0-9]$/, required: true} }" 
                   placeholder="Input Time (military, e.g. 15:00 for 3:00pm)"
                   class="input"
                   name="time"
                   v-model="time"
                   @change="emitDateTime()">
                  <p v-if="errors.has('time')" class="help is-danger">Required and must be in a valid time format</p>
              </div>
              <div class="field is-narrow">
                  <div class="control">
                      <div class="select is-fullwidth">
                          <select v-model="timezone">
                              <option value="">Select Timezone...</option>
                              <option v-for="zone in zones" :key="zone.id" :value="zone">{{zone.display}}</option>
                          </select>
                      </div>
                  </div>
              </div>
              <div class="field">
                  <input type="text"
                   v-validate="{rules: {date_format: 'M/DD/YYYY', required: true} }"
                   placeholder="Input Date (e.g. MM/DD/YYYY)"
                   class="input"
                   name="date"
                   v-model="date"
                   @change="emitDateTime()">
                  <p v-if="errors.has('date')" class="help is-danger">Required and must be in valid date format</p>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import zones from '../lib/zones';

function getDateObj(date, time) {
    let parsedDate = date.split('/');
    let parsedTime = time.split(':');
    return {
        year: parseInt(parsedDate[2], 10),
        month: parseInt(parsedDate[0], 10) - 1, //dates run from 0-11 indicies
        day: parseInt(parsedDate[1], 10),
        hour: parseInt(parsedTime[0], 10),
        min: parseInt(parsedTime[1], 10)
    }
}

export default {
    props: ['delivery'],
    data: function() {
       return {
            time: '',
            date: '',
            timezone: '',
            zones: zones
        };
    },
    created: function() {
        if(this.delivery) {
            this.parseDelivery(this.delivery.deliveryTime, this.delivery.deliveryTimezone);
        }
    },
    watch: {
        //null or undefined on Create use; will be present and changing on Edit use
        delivery: function(val) {
            if(val) {
                this.parseDelivery(val.deliveryTime, val.deliveryTimezone);
            }
        }
    },
    methods: {
        emitDateTime() {
            // 'MM/DD/YYYY HH:MM ZONE' is a parseable string on this version of node...
            // make sure to verify agains NaN before actually emitting...
            if(this.time && this.timezone && this.date && !this.errors.any()) {
                let dateObj = getDateObj(this.date, this.time);
                let isDST = new Date(dateObj.year, dateObj.month, dateObj.day).isDST();
                if(isDST) {
                    dateObj.hour = dateObj.hour - this.timezone.dstOffset;
                } else {
                    dateObj.hour = dateObj.hour - this.timezone.stdOffset;   
                }
                let date = new Date(Date.UTC(dateObj.year, dateObj.month, dateObj.day, dateObj.hour, dateObj.min));
                this.$emit('update:delivery', {
                    delivery: date.toISOString(),
                    timezone: this.timezone.id
                });
            }
        },
        parseDelivery(deliveryStr, timezoneStr) {
            this.timezone = this.zones.find(zone => zone.id === timezoneStr);
            let date = new Date(deliveryStr);
            //reset to local tz appearing time
            if(date.isDST()) {
                date.setUTCHours(date.getUTCHours() + this.timezone.dstOffset);
            } else {
                date.setUTCHours(date.getUTCHours() + this.timezone.stdOffset);
            }
            date.get
            let month = date.getUTCMonth() + 1; //offset
            let minutes = date.getUTCMinutes();
            if(minutes < 10) {
                minutes = '0' + minutes;
            }
            this.time = date.getUTCHours() + ':' + minutes;
            this.date = month + '/' + date.getUTCDate() + '/' + date.getUTCFullYear();
            //prefix '0' to date if necessary
            if(month < 10) {
                this.date = '0' + this.date;
            }
        }
    }
}
</script>

<style scoped>

</style>
