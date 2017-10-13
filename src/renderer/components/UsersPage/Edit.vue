<template>
  <div>
      <circle3 v-if="loading"></circle3>
      <div v-if="!loading">
          <p v-if="editSuccess" class="has-text-success">You {{editAction}} {{editedUser}} successfully!</p>
          <p v-if="isError" class="has-text-danger">There was an error</p>
          <div class="field">
              <label class="label">Select User</label>
              <div class="select">
                  <select
                    ref="userSelect"
                    v-on:change="selectUser"
                    v-model="selected">
                    <option value="">Select User...</option>
                    <option v-for="user in users"
                        :key="user.id"
                        :value="user">
                        {{user.username}}
                    </option>
                  </select>
              </div>
          </div>
          <div v-if="selectedUser">
              <div class="field">
                  <label class="label">Username</label>
                  <div class="control">
                      <input type="text" v-model="selectedUser.username" placeholder="Username" class="input" name="username" v-validate="'required'">
                  </div>
                  <p v-show="errors.has('username')" class="help is-danger">Required</p>
              </div>
              <div class="field">
                  <label class="label">Password</label>
                  <div class="control">
                      <input type="text" v-model="newPassword" placeholder="New Password (min 8 chars)" class="input" name="password" v-validate="'min:8'">
                  </div>
                  <p v-show="errors.has('password')" class="help is-danger">Must be 8 chars if making a new password</p>
              </div>
              <div class="field">
                  <label class="label">First Name</label>
                  <div class="control">
                      <input type="text" v-model="selectedUser.firstName" placeholder="First Name" class="input" name="firstname" v-validate="'required'">
                  </div>
                  <p v-show="errors.has('firstname')" class="help is-danger">Required</p>
              </div>
              <div class="field">
                  <label class="label">Last Name</label>
                  <div class="control">
                      <input type="text" v-model="selectedUser.lastName" placeholder="Last Name" class="input" name="lastname" v-validate="'required'">
                  </div>
                  <p v-show="errors.has('lastname')" class="help is-danger">Required</p>
              </div>
              <div class="field">
                <label class="label">Age</label>
                <div class="control">
                    <input v-validate="'required|min_value:0|max_value:200'" v-model="selectedUser.age" name="age" class="input" type="text" placeholder="Input Age">
                </div>
                <p v-show="errors.has('age')" class="help is-danger">This is required and must be a number from 0-200</p>
            </div>
              <div class="field">
                  <label class="label">Email</label>
                  <div class="control">
                      <input type="text" v-model="selectedUser.email" placeholder="Email" class="input" name="email" v-validate="'required|email'">
                  </div>
                  <p v-show="errors.has('email')" class="help is-danger">Required</p>
              </div>
              <div class="field">
                <label class="label">Gender</label>
                <div class="select">
                    <select
                        ref="genderSelect"
                        v-model="selectedUser.gender">
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                  <label class="label">Address</label>
              </div>
              <div class="field-body">
                  <div class="field">
                      <p class="control is-expanded">
                          <input class="input" name="street" v-validate="'required'" v-model="selectedUser.address.street" type="text" placeholder="Street Address">
                      </p>
                    <p v-show="errors.has('street')" class="help is-danger">This is required</p>
                  </div>
                  <div class="field">
                      <p class="control is-expanded">
                          <input class="input" name="street2" v-model="selectedUser.address.street2" type="text" placeholder="Street Address 2">
                      </p>
                      <p class="help">Optional</p>
                  </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label"></div>
              <div class="field-body">
                  <div class="field">
                      <p class="control">
                          <input name="city" v-validate="'required'" v-model="selectedUser.address.city" type="text" class="input" placeholder="City">
                      </p>
                      <p v-show="errors.has('city')" class="help is-danger">This is required</p>
                  </div>
                  <div class="field">
                      <div class="control">
                          <div class="select is-fullwidth">
                              <!--put in script state list-->
                              <select
                                ref="stateSelect"
                                v-model="selectedUser.address.state">
                                <option value="">Select State</option>
                                <option v-for="state in states"
                                    :key="state.abbreviation"
                                    :value="state.abbreviation">
                                    {{state.name}}
                                </option>
                              </select>
                          </div>
                      </div>
                  </div>
                  <div class="field">
                      <p class="control">
                          <input name="zip" v-validate="'required|digits:5'" v-model="selectedUser.address.zip" type="text" class="input" placeholder="5 Digit Zip">
                      </p>
                      <p v-show="errors.has('city')" class="help is-danger">This is required and must be 5 digits</p>
                  </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">Delivery Preferences</div>
              <div class="field-body">
                  <div class="field">
                    <p class="help">Meals Per Week</p>
                    <number-counter
                        v-on:increment-meals="selectedUser.deliveryPreferences.mealsPerWeek++"
                        v-on:decrement-meals="selectedUser.deliveryPreferences.mealsPerWeek--"
                        :count="selectedUser.deliveryPreferences.mealsPerWeek" :suffix="'meals'"></number-counter>
                  </div>
                  <div class="field">
                    <p class="help">Min Deliveries Per Week</p>
                    <number-counter
                        v-on:increment-min-del="selectedUser.deliveryPreferences.minDeliveriesPerWeek++"
                        v-on:decrement-min-del="selectedUser.deliveryPreferences.minDeliveriesPerWeek--"
                        :count="selectedUser.deliveryPreferences.minDeliveriesPerWeek" :suffix="'min-del'"></number-counter>
                  </div>
                  <div class="field">
                    <p class="help">Max Deliveries Per Week</p>
                    <number-counter 
                        v-on:increment-max-del="selectedUser.deliveryPreferences.maxDeliveriesPerWeek++"
                        v-on:decrement-max-del="selectedUser.deliveryPreferences.maxDeliveriesPerWeek--"
                        :count="selectedUser.deliveryPreferences.maxDeliveriesPerWeek" :suffix="'max-del'"></number-counter>
                  </div>
                  <div class="field">
                    <p class="help">Servings Per Meal</p>
                    <number-counter 
                        v-on:increment-servings="selectedUser.deliveryPreferences.servingsPerMeal++"
                        v-on:decrement-servings="selectedUser.deliveryPreferences.servingsPerMeal--"
                        :count="selectedUser.deliveryPreferences.servingsPerMeal"
                        :suffix="'servings'"></number-counter>
                  </div>
              </div>
            </div>
            <div class="field is-grouped">
                <div class="control">
                    <button v-on:click="save()" class="button is-info">Save Changes</button>
                </div>
                <div class="control">
                    <button v-on:click="del()" class="button is-danger">Delete Ingredient</button>
                </div>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
import Circle3 from 'vue-loading-spinner/src/components/Circle3';
import states from '../lib/states';
import NumberCounter from '../lib/NumberCounter';

export default {
    components: {
        Circle3,
        NumberCounter
    },
    data: function() {
        return {
            editSuccess: false,
            isError: false,
            selectedUser: null,
            selected: '',
            newPassword: '',
            states: states
        };
    },
    computed: {
        loading() {
            return this.$store.state.Loading.loading;
        },
        users() {
            return this.$store.state.Users.users;
        }
    },
    methods: {
        selectUser() {
            if(!this.selected) {
                this.selectedUser = null;
            } else {
                this.selectedUser = JSON.parse(JSON.stringify(this.selected));
            }
        },
        save() {
            if(this.newPassword) {
                this.selectedUser.password = this.newPassword;
            }
            this.$store.dispatch('editUser', this.selectedUser)
                .then((editedUser) => {
                    this.editSuccess = true;
                    this.editError = false;
                    this.editAction = 'edited';
                    this.editedUser = editedUser;
                })
                .catch(() => {
                    this.editSuccess = false;
                    this.editError = true;
                })
                .then(() => {
                    this.selected = '';
                    this.selectedUser = null;
                    this.$refs["userSelect"].value = '';
                });
        },
        del() {
            this.$store.dispatch('deleteUser', this.selectedUser.id)
                .then((deletedUser) => {
                    this.editSuccess = true;
                    this.editError = false;
                    this.editAction = 'deleted';
                    this.editedUser = deletedUser;
                })
                .catch(() => {
                    this.editSuccess = false;
                    this.editError = true;
                })
                .then(() => {
                    this.selected = '';
                    this.selectedUser = null;
                    this.$refs["userSelect"].value = '';
                });
        }
    }
}
</script>

<style scoped>

</style>
