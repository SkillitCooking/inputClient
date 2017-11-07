<template>
    <div class="columns">
        <div class="column">
            <p class="title is-5 has-text-info">{{ingredient.nameSingular}}</p>
            <p class="title is-5 has-text-info">{{ingredient.storeKeepingName}}</p>
            <p class="subtitle is-6">Serving Size: {{ingredient.servingSize}}</p>
            <div class="field">
                <label class="label">Proportion</label>
                <p class="help">Relative to Serving Size</p>
                <div class="control">
                    <input v-validate="'required|decimal'" name="proportion" class="input" type="text" placeholder="Input Proportion" v-model="ingredient.proportion">
                </div>
                <p v-show="errors.has('proportion')" class="help is-danger">Required and must be a decimal</p>
            </div>
            <div class="field">
                <div class="control">
                    <label class="checkbox">
                        <input type="checkbox" v-model="ingredient.isFrozen">
                        Is Frozen?
                    </label>
                </div>
            </div>
        </div>
        <div class="column is-narrow">
            <button class="button is-danger" v-on:click="removeIngredient">Remove</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['ingredient'],
    methods: {
        removeIngredient() {
            this.$emit('remove-ingredient', this.ingredient.id);
        }
    }
}
</script>

<style scoped>
  
</style>
