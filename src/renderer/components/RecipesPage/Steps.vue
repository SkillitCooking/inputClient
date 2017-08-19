<template>
    <div>
        <div class="container" v-for="step in steps" :key="step.order">
            <step :tags="tags" :step="step"  v-on:remove="removeStep"></step>
            <hr/>
        </div>
        <button class="button is-success" v-on:click="addStep">Add Step</button>
    </div>
</template>

<script>
import Step from './Step';

export default {
    components: {
        Step
    },
    props: ['steps'],
    methods: {
        removeStep(order) {
            this.steps.splice(order - 1, 1);
            this.steps.forEach((step, index) => {
                step.order = index + 1;
            });
        },
        addStep() {
            this.steps.push({
                text: '',
                tags: [],
                order: this.steps.length + 1
            });
        }
    },
    computed: {
        tags() {
            return this.$store.state.Tags.tags;
        }
    }
}
</script>

<style scoped>
hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 1em 0;
    padding: 0;
}
</style>
