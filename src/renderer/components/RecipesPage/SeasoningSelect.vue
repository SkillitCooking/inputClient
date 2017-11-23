<template>
    <div>
        <div class="field is-grouped is-grouped-multiline">
            <div v-for="(s, index) in seasonings"
                class="control"
                :key="s.id">
                <div class="tags has-addons">
                    <span @click="adjustOrder(index, -1)" v-if="s.selected" class="tag is-success">
                        <span class="icon"><i class="fa fa-arrow-left"></i></span>
                    </span>
                    <span class="tag" @click="toggleSeasoning(index)" :class="getSeasoningClass(index)">{{s.name}}</span>
                    <span @click="adjustOrder(index, 1)" v-if="s.selected" class="tag is-success">
                        <span class="icon"><i class="fa fa-arrow-right"></i></span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['seasonings', 'is-edit'],
    methods: {
        getSeasoningClass(index) {
            return this.seasonings[index].selected ?
                {'is-primary': true} : {};
        },
        adjustOrder(index, dir) {
            let swapIndex = index + dir;
            if(swapIndex >= 0 && swapIndex < this.seasonings.length) {
                if(this.seasonings[swapIndex].selected) {
                    let tmp;
                    if(swapIndex < index) {
                        tmp = this.seasonings.splice(index, 1)[0];
                        this.seasonings.splice(swapIndex, 0, tmp);
                    } else {
                        tmp = this.seasonings.splice(swapIndex, 1)[0];
                        this.seasonings.splice(index, 0, tmp);
                    }
                }
            }
        },
        toggleSeasoning(index) {
            if(this.seasonings[index].selected) {
                let s = this.seasonings.splice(index, 1)[0];
                s.selected = false;
                this.seasonings.push(s);
            } else {
                let s = this.seasonings.splice(index, 1)[0];
                s.selected = true;
                let i;
                for(i = this.seasonings.length - 1; i >= 0; i--) {
                    if(this.seasonings[i].selected) break;
                }
                i++;
                this.seasonings.splice(i, 0, s);
            }
        }
    }
}
</script>

<style scoped>

</style>
