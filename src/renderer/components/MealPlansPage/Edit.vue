<template>
  <div>
      <circle3 v-if="loading"></circle3>
      <div v-show="!loading">
          <p v-if="editSuccess" class="has-text-success">You {{editAction}} {{editedMealPlan}} for {{selectedUsername}} successfully!</p>
          <p v-if="isError" class="has-text-danger">There was an error</p>
      </div>
      <div class="field">
          <label class="label">Select User</label>
          <div class="control">
              <div class="select">
                  <select
                    ref="usersSelect"
                    v-on:change="selectUser"
                    v-model="selectedUser">
                        <option value="">Select User</option>
                        <option v-for="user in users"
                            :key="user.id"
                            :value="user">{{user.username}}</option>
                    </select>
              </div>
          </div>
      </div>
      <div v-if="userIsSelected">
          <div class="field">
              <div class="control">
                  <div class="select">
                      <select
                        ref="mealPlanSelect"
                        v-on:change="selectMealPlan"
                        v-model="selected">
                            <option value="">Select Meal Plan</option>
                            <option v-for="mealPlan in mealPlans"
                                :key="mealPlan.id"
                                :value="mealPlan">{{mealPlan.title}}</option>
                        </select>
                  </div>
              </div>
          </div>
          <div v-if="mealPlanIsSelected">
              <div class="field">
                  <label class="label">Title</label>
                  <div class="control">
                      <input type="text" class="input" placeholder="Meal Plan Title" v-model="selectedMealPlan.title" name="title" v-validate="'required'">
                  </div>
                  <p v-if="errors.has('title')" class="help is-danger">Required</p>
              </div>
              <div class="field">
                  <label class="label">Overview</label>
                  <div class="control">
                      <textarea class="textarea" rows="3" v-model="selectedMealPlan.overview"></textarea>
                  </div>
                  <p class="help">Optional. If included, will be intro paragraph</p>
              </div>
              <label class="label">Delivery Time</label>
              <delivery-time @update:delivery="updateDelivery" :delivery="deliveryObj"></delivery-time>
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
                        <label class="label">{{recipe.title}}</label>
                        <div class="control">
                            <input type="text" class="input" placeholder="Order (integer)" v-model="recipe.order">
                        </div>
                    </div>
                  </li>
              </ul>
              <div class="field is-grouped">
                  <div class="control">
                      <button v-on:click="save()" class="button is-info">Save Changes</button>
                  </div>
                  <div class="control">
                      <button v-on:click="del()" class="button is-danger">Delete Meal Plan</button>
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
            selectedRecipes: this.$store.state.Recipes.recipes.map(r => ({
                selected: false,
                title: r.title,
                id: r.id
            })),
            editSuccess: false,
            isError: false,
            selectedUsername: '',
            selectedUserId: '',
            selectedUser: '',
            userIsSelected: false,
            selected: '',
            selectedMealPlan: null,
            mealPlanIsSelected: false,
            deliveryObj: null
        };
    },
    methods: {
        save() {
            let recipesToRemove = [];
            let mealPlan = {
                id: this.selectedMealPlan.id,
                user: this.selectedMealPlan.user,
                deliveryTime: this.selectedMealPlan.deliveryTime,
                deliveryTimezone: this.selectedMealPlan.deliveryTimezone,
                title: this.selectedMealPlan.title,
                overview: this.selectedMealPlan.overview,
                recipes: []
            };
            //fill in recipes
            this.selectedRecipes.forEach(sr => {
                let recipe = this.selectedMealPlan.recipes.find(recipe => recipe.id === sr.id);
                if(sr.selected) {
                    if(!recipe) {
                        mealPlan.recipes.push({
                            id: sr.id,
                            order: sr.order    
                        });
                    }
                } else {
                    if(recipe) {
                        recipesToRemove.push(recipe.recipeMealPlanId);
                    }
                }
            });
            this.$store.dispatch('editMealPlan', {
                mealPlan,
                recipesToRemove
            }).then((editedMealPlan) => {
                this.editSuccess = true;
                this.isError = false;
                this.editAction = 'edited';
                this.editedMealPlan = editedMealPlan;
            }).catch(() => {
                this.editSuccess = false;
                this.isError = true;
            }).then(() => {
                this.selected = '';
                this.selectedMealPlan = null;
                this.mealPlanIsSelected = false;
                this.deliveryObj = null;
                this.$refs["mealPlanSelect"].value = '';
                this.selectedRecipes.forEach(r => r.selected = false);
            });
        },
        del() {
            this.$store.dispatch('deleteMealPlan', this.selectedMealPlan.id)
                .then((deletedMealPlan) => {
                    this.editSuccess = true;
                    this.isError = false;
                    this.editAction = 'deleted';
                    this.editedMealPlan = deletedMealPlan;
                })
                .catch(() => {
                    this.editSuccess = false;
                    this.isError = true;
                })
                .then(() => {
                    this.selected = '';
                    this.selectedMealPlan = null;
                    this.mealPlanIsSelected = false;
                    this.deliveryObj = null;
                    this.$refs["mealPlanSelect"].value = '';
                    this.selectedRecipes.forEach(r => r.selected = false);
                });
        },
        updateDelivery(deliveryInfo) {
            this.selectedMealPlan.deliveryTime = deliveryInfo.delivery;
            this.selectedMealPlan.deliveryTimezone = deliveryInfo.timezone;
        },
        selectRecipe(index) {
            this.selectedRecipes[index].selected = !this.selectedRecipes[index].selected;
            if(this.selectedRecipes[index].selected && !this.selectedRecipes[index].order) {
                this.selectedRecipes[index].order = 1;
            }
        },
        getRecipeTagClass(index) {
            return this.selectedRecipes[index].selected ?
                {'is-primary': true, 'is-medium': true} :
                {};
        },
        selectMealPlan() {
            if(!this.selected) {
                this.selectedMealPlan = null;
                this.mealPlanIsSelected = false;
                this.deliveryObj = null;
                this.selectedRecipes.forEach(sr => sr.selected = false);
            } else {
                this.selectedMealPlan = Object.assign({}, this.selected);
                this.mealPlanIsSelected = true;
                this.deliveryObj = {
                    deliveryTime: this.selectedMealPlan.deliveryTime,
                    deliveryTimezone: this.selectedMealPlan.deliveryTimezone
                };
                //select recipes
                this.selectedRecipes.forEach(sr => {
                    let index = this.selectedMealPlan.recipes.findIndex(recipe => recipe.id === sr.id);
                    if(index !== -1) {
                        sr.selected = true;
                        sr.order = this.selectedMealPlan.recipes[index].mealPlanOrder;
                    }
                });
            }
        },
        selectUser() {
            if(this.selectedUser) {
                this.selectedUsername = this.selectedUser.username;
                this.selectedUserId = this.selectedUser.id;
                this.selected = '';
                this.selectMealPlan();
                this.$store.dispatch('fetchMealPlans', this.selectedUserId)
                    .then(() => {
                        this.userIsSelected = true;
                    })
                    .catch(() => {
                        this.editSuccess = false;
                        this.isError = true;
                    });
            } else {
                this.selectedUsername = '';
                this.selectedUserId = '';
                this.userIsSelected = false;
            }
        }
    },
    computed: {
        loading() {
            return this.$store.state.Loading.loading;
        },
        users() {
            return this.$store.state.Users.users;
        },
        mealPlans() {
            return this.$store.state.MealPlans.mealPlans;
        }
    }
}
</script>

<style scoped>

</style>
