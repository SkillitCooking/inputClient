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
                      <input type="text" class="input" placeholder="Meal Plan Title" v-model="inputTitle">
                  </div>
                  <p class="help">Optional</p>
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
        selectRecipe(index) {
            this.selectedRecipes[index].selected = ! this.selectedRecipes[index].selected;
        },
        save() {
            //need to get recipe ids
            let mealPlan = {
                user: this.selectedUserId,
                deliveryTime: this.inputDeliveryTime,
                deliveryTimezone: this.inputDeliveryTimezone,
                recipes: this.selectedRecipes.filter(r => r.selected).map(r => r.id),
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
