<template>
  <div>
      <circle3 v-if="loading"></circle3>
      <div v-show="!loading">
          <p v-if="saveSuccess" class="has-text-success">You saved {{savedMealPlan}} successfully!</p>
          <p v-if="isError" class="has-text-danger">There was an error</p>
          <div class="field">
              <label class="label">Select User</label>
              <div class="control">
                  <div class="select">
                      <select
                        ref="usersSelect"
                        v-on:change="selectUser"
                        v-model="selectedUserId">
                        <option value="">Select User</option>
                        <option v-for="user in users"
                            :key="user.id"
                            :value="user.id">{{user.username}}</option>    
                    </select>
                </div>
            </div>
          </div>
          <div v-if="userIsSelected">
              <div class="field">
                  <label class="label">Title</label>
                  <div class="control">
                      <input type="text" class="input" placeholder="Meal Plan Title" v-model="inputTitle" name="title" v-validate="'required'">
                  </div>
                  <p v-if="errors.has('title')" class="help is-danger">Required</p>
              </div>
              <div class="field">
                  <label class="label">Overview</label>
                  <div class="control">
                      <textarea v-model="inputOverview" class="textarea" rows="3"></textarea>
                  </div>
                  <p class="help">Optional. If included, will be intro paragraph to Meal Plan email</p>
              </div>
              <label class="label">Delivery Time</label>
              <delivery-time @update:delivery="updateDelivery"></delivery-time>
              <!-- select ingredients -->
              <div class="field">
                  <label class="label">Select Meal Plan Specific Ingredients</label>
                  <div class="tags">
                      <span
                        class="tag"
                        v-for="(ingredient, index) in selectedIngredients"
                        :key="ingredient.id"
                        v-on:click="selectIngredient(index)"
                        :class="getIngredientTagClass(index)">{{ingredient.nameSingular}}</span>
                  </div>
              </div>
              <!-- select recipes -->
              <div class="field">
                  <label class="label">Select Recipes</label>
                  <div class="tags">
                      <span
                        class="tag"
                        v-for="(recipe, index) in selectedRecipes"
                        :key="recipe.id"
                        v-on:click="selectRecipe(index)"
                        :class="getRecipeTagClass(index)">{{recipe.title}}</span>
                  </div>
              </div>
              <ul>
                  <li
                    v-for="(recipe, index) in selectedRecipes"
                    v-if="recipe.selected"
                    :key="recipe.id">
                    <div class="field">
                        <label class="label">{{recipe.title}}'s Order</label>
                        <div class="control">
                            <input type="text" class="input" placeholder="Order (integer)" v-model="recipe.order">
                        </div>
                    </div>
                  </li>
              </ul>
              <div class="field">
                  <div class="control">
                      <button v-on:click="save()" class="button is-primary">Save</button>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Circle3 from 'vue-loading-spinner/src/components/Circle3';
import DeliveryTime from '../lib/DeliveryTime';

export default {
    components: {
        Circle3,
        DeliveryTime
    },
    data: function() {
        return {
            saveSuccess: false,
            isError: false,
            userIsSelected: false,
            selectedUserId: '',
            inputTitle: '',
            inputOverview: '',
            inputDeliveryTime: '',
            inputDeliveryTimezone: '',
            selectedRecipes: this.$store.state.Recipes.recipes.map(r => ({
                selected: false,
                title: r.title,
                id: r.id
            })),
            selectedIngredients: this.$store.state.Ingredients.ingredients.map(i => ({
                selected: false,
                nameSingular: i.nameSingular,
                id: i.id
            }))
        };
    },
    methods: {
        selectUser() {
            this.userIsSelected = true;
        },
        updateDelivery(deliveryInfo) {
            this.inputDeliveryTime = deliveryInfo.delivery;
            this.inputDeliveryTimezone = deliveryInfo.timezone;
        },
        getRecipeTagClass(index) {
            return this.selectedRecipes[index].selected ?
                {'is-primary': true, 'is-medium': true} :
                {};
        },
        getIngredientTagClass(index) {
            return this.selectedIngredients[index].selected ?
                {'is-info': true, 'is-medium': true} : {};
        },
        selectRecipe(index) {
            this.selectedRecipes[index].selected = !this.selectedRecipes[index].selected;
            if(this.selectedRecipes[index].selected) {
                this.selectedRecipes[index].order = 1;
            }
        },
        selectIngredient(index) {
            this.selectedIngredients[index].selected = !this.selectedIngredients[index].selected;
        },
        save() {
            //need to get recipe ids
            let mealPlan = {
                user: this.selectedUserId,
                deliveryTime: this.inputDeliveryTime,
                deliveryTimezone: this.inputDeliveryTimezone,
                recipes: this.selectedRecipes.filter(r => r.selected).map(r => ({
                    id: r.id,
                    order: r.order
                })),
                ingredients: this.selectedIngredients.filter(i => i.selected).map(i => i.id),
                title: this.inputTitle,
                overview: this.inputOverview
            };
            this.$store.dispatch('saveMealPlan', mealPlan)
                .then((savedMealPlan) => {
                    this.saveSuccess = true;
                    this.isError = false;
                    this.savedMealPlan = savedMealPlan;
                    this.userIsSelected = false;
                    this.selectedUserId = '';
                    this.inputTitle = '';
                    this.inputOverview = '';
                    this.inputDeliveryTime = '';
                    this.inputDeliveryTimezone = '';
                    this.selectedRecipes.forEach(r => {
                        r.selected = false;
                    });
                })
                .catch(() => {
                    this.saveSuccess = false;
                    this.isError = false;
                    this.savedMealPlan = null;
                });
        }
    },
    computed: {
        loading() {
            return this.$store.state.Loading.loading;
        },
        users() {
            return this.$store.state.Users.users;
        }
    }
}
</script>

<style scoped>

</style>
