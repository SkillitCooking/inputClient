<template>
    <div class="columns">
        <div class="column is-two-thirds">
            <recipe-ingredient v-for="ri in recipeIngredients" :key="ri.id" :ingredient="ri" v-on:remove-ingredient="removeIngredient"></recipe-ingredient>
        </div>
        <div class="column">
            <nav class="panel">
                <p class="panel-heading">Select Ingredients</p>
                <div class="panel-block" v-for="(ingredient, index) in selectedIngredients" :key="ingredient.id">
                    <button :class="getPanelClass(index)" v-on:click="selectIngredient(index)">{{ingredient.nameSingular}}</button>
                </div>
            </nav>
        </div>
    </div>
</template>

<script>
import RecipeIngredient from './RecipeIngredient';

export default {
    components: {
        RecipeIngredient
    },
    props: ['selectedIngredients', 'recipeIngredients'],
    methods: {
        getPanelClass(index) {
            return this.selectedIngredients[index].selected ? 
                {'button': true, 'is-primary': true, 'full-width': true} :
                {'button': true, 'full-width': true};
        },
        selectIngredient(index) {
            this.selectedIngredients[index].selected = !this.selectedIngredients[index].selected;
            //push or remove from recipeIngredients
            if(this.selectedIngredients[index].selected) {
                this.recipeIngredients.push({
                    id: this.selectedIngredients[index].id,
                    nameSingular: this.selectedIngredients[index].nameSingular,
                    servingSize: this.selectedIngredients[index].servingSize,
                    proportion: 1,
                    isFrozen: false
                });
            } else {
                let removeIndex = this.recipeIngredients.findIndex(ri => ri.id === this.ingredients[index].id);
                this.recipeIngredients.splice(removeIndex, 1);
            }
        },
        removeIngredient(ingredientId) {
            let index = this.recipeIngredients.findIndex(ri => ri.id === ingredientId);
            this.selectedIngredients[index].selected = false;
            this.recipeIngredients.splice(index, 1);
        }
    }
}
</script>

<style scoped>
</style>
