<template>
    <div>
        <div class="columns">
            <div class="column is-narrow">
                <h5 class="subtitle">{{step.order}}</h5>
            </div>
            <div class="column is-three-quarters">
                <textarea v-validate="'required'" name="step-text" class="textarea" placeholder="Text for Step" rows="2" v-model="step.text"></textarea>
                <p v-show="errors.has('step-text')" class="help is-danger">Required</p>
                <input class="input" v-validate="'url'" name="step-main-link" type="text" placeholder="Main Link URL" v-model="step.mainLinkUrl"/>
                <p v-show="errors.has('step-main-link')" class="help is-danger">Must be a url</p>
            </div>
            <div class="column">
                <button class="button is-danger" v-on:click="removeStep()">Remove Step</button>
            </div>
        </div>
        <div class="field">
            <label class="label">Select Tags</label>
            <div class="tags">
                <span class="tag"
                    v-for="(tag, index) in tags"
                    :key="tag.id"
                    v-on:click="selectTag(index)"
                    v-bind:class="tagClass(index)">
                    {{tag.name}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['step', 'tags'],
    data: function() {
        return {
            selectedTags: this.tags.map(t => {
                //select tags in step
                if(this.step.tags.find(st => st.id === t.id)) {
                    return {
                        id: t.id,
                        selected: true,
                        isOriginal: true
                    };
                } else {
                    return {
                        id: t.id,
                        selected: false
                    };
                }
            })
        };
    },
    methods: {
        removeStep() {
            this.$emit('remove', this.step.order);
        },
        selectTag(index) {
            this.selectedTags[index].selected = !this.selectedTags[index].selected;
            if(this.selectedTags[index].selected) {
                if(!this.selectedTags[index].isOriginal){ 
                    this.step.tags.push(this.selectedTags[index].id);
                } else {
                    let tagIndex = this.step.tags.findIndex(t => t.id === this.selectedTags[index].id);
                    this.step.tags[tagIndex].use = true;
                }
            } else {
                if(!this.selectedTags[index].isOriginal) {
                    let removeIndex = this.step.tags.findIndex(t => t.id === this.selectedTags[index].id);
                    this.step.tags.splice(removeIndex, 1);
                } else {
                    let tagIndex = this.step.tags.findIndex(t => t.id === this.selectedTags[index].id);
                    this.step.tags[tagIndex].use = false;
                }
            }
        },
        tagClass(index) {
            return this.selectedTags[index].selected ?
                {'is-info': true} :
                {};
        }
    }
}
</script>

<style scoped>
  
</style>
