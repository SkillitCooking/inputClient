<template>
  <div>
      <circle9 v-if="loading"></circle9>
      <div v-show="!loading">
          <p v-if="saveSuccess" class="has-text-success">You saved {{savedUser}} successfully!</p>
          <p v-if="isError" class="has-text-danger">There was an error</p>
          <div class="field">
              <label class="label">Username</label>
              <div class="control">
                  <input v-model="inputUsername" v-validate="'required'" name="username" class="input" type="text" placeholder="Input Username">
              </div>
              <p v-show="errors.has('username')" class="help is-danger">This is required</p>
          </div>
          <div class="field">
              <label class="label">Password</label>
              <div class="control">
                  <input v-validate="'required|min:8'" v-model="inputPassword" name="password" class="input" type="text" placeholder="Input Password (8 char min)">
              </div>
              <p v-show="errors.has('password')" class="help is-danger">This is required and must be 8 chars long</p>
          </div>
          <div class="field">
              <label class="label">First Name</label>
              <div class="control">
                  <input v-validate="'required'" v-model="inputFirstName" name="firstname" class="input" type="text" placeholder="Input First Name">
              </div>
              <p v-show="errors.has('firstname')" class="help is-danger">This is required</p>
          </div>
          <div class="field">
              <label class="label">Last Name</label>
              <div class="control">
                  <input v-validate="'required'" v-model="inputLastName" name="lastname" class="input" type="text" placeholder="Input Last Name">
              </div>
              <p v-show="errors.has('lastname')" class="help is-danger">This is required</p>
          </div>
          <div class="field">
              <label class="label">Email</label>
              <div class="control">
                  <input v-validate="'required|email'" v-model="inputEmail" name="email" class="input" type="text" placeholder="Input Email">
              </div>
              <p v-show="errors.has('email')" class="help is-danger">This is required and must be an email</p>
          </div>
          <div class="field">
              <label class="label">Gender</label>
              <div class="select">
                  <select
                    ref="genderSelect"
                    v-model="inputGender">
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
                          <input class="input" name="street" v-validate="'required'" v-model="inputAddress.street" type="text" placeholder="Street Address">
                      </p>
                    <p v-show="errors.has('street')" class="help is-danger">This is required</p>
                  </div>
                  <div class="field">
                      <p class="control is-expanded">
                          <input class="input" name="street2" v-model="inputAddress.street2" type="text" placeholder="Street Address 2">
                      </p>
                      <p class="help">Optional</p>
                  </div>
              </div>
          </div>
          <div class="field is-horizontal">
              <!-- no label, city, state, zip -->
              <div class="field-label"></div>
              <div class="field-body">
                  <div class="field">
                      <p class="control">
                          <input name="city" v-validate="'required'" v-model="inputAddress.city" type="text" class="input" placeholder="City">
                      </p>
                      <p v-show="errors.has('city')" class="help is-danger">This is required</p>
                  </div>
                  <div class="field">
                      <div class="control">
                          <div class="select is-fullwidth">
                              <!--put in script state list-->
                              <select
                                ref="stateSelect"
                                v-model="inputAddress.state">
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
                          <input name="zip" v-validate="'required|digits:5'" v-model="inputAddress.zip" type="text" class="input" placeholder="5 Digit Zip">
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
                    <number-counter :count="inputDeliveryPreferences.mealsPerWeek" :suffix="'meals'"></number-counter>
                  </div>
                  <div class="field">
                    <p class="help">Min Deliveries Per Week</p>
                    <number-counter :count="inputDeliveryPreferences.minDeliveriesPerWeek" :suffix="'min-del'"></number-counter>
                  </div>
                  <div class="field">
                    <p class="help">Max Deliveries Per Week</p>
                    <number-counter :count="inputDeliveryPreferences.maxDeliveriesPerWeek" :suffix="'max-del'"></number-counter>
                  </div>
                  <div class="field">
                    <p class="help">Servings Per Meal</p>
                    <number-counter :count="inputDeliveryPreferences.servingsPerMeal" :suffix="'servings'"></number-counter>
                  </div>
              </div>
          </div>
          <div class="field">
              <div class="control">
                  <button v-on:click="save()" class="button is-primary">Save</button>
              </div>
          </div>
          <h5 class="title is-5">Current Users</h5>
          <div class="tags">
              <span class="tag" v-for="user in users" :key="user.id">{{user.username}}</span>
          </div>
      </div>
  </div>
</template>

<script>
import Circle9 from 'vue-loading-spinner/src/components/Circle9';
import NumberCounter from '../lib/NumberCounter';
import states from '../lib/states';

export default {
    components: {
        Circle9,
        NumberCounter
    },
    data: function() {
        return {
            saveSuccess: false,
            isError: false,
            inputUsername: '',
            inputPassword: '',
            inputFirstName: '',
            inputLastName: '',
            inputEmail: '',
            inputAddress: {
                street: '',
                street2: '',
                city: '',
                state: '',
                zip: ''
            },
            inputAge: '',
            inputGender: '',
            inputDeliveryPreferences: {
                mealsPerWeek: 0,
                minDeliveriesPerWeek: 0,
                maxDeliveriesPerWeek: 0,
                servingsPerMeal: 0
            },
            states: states
        }
    },
    methods: {
        save() {
            let user = {
                username: this.inputUsername,
                email: this.inputEmail,
                firstName: this.inputFirstName,
                lastName: this.inputLastName,
                address: {
                    street: this.inputAddress.street,
                    street2: this.inputAddress.street2,
                    city: this.inputAddress.city,
                    state: this.inputAddress.state,
                    zip: this.inputAddress.zip
                },
                age: this.inputAge,
                gender: this.inputGender,
                deliveryPreferences: {
                    mealsPerWeek: this.inputDeliveryPreferences.mealsPerWeek,
                    minDeliveriesPerWeek: this.inputDeliveryPreferences.minDeliveriesPerWeek,
                    maxDeliveriesPerWeek: this.inputDeliveryPreferences.maxDeliveriesPerWeek,
                    servingsPerMeal: this.inputDeliveryPreferences.servingsPerMeal
                },
                isAdmin: false,
                password: this.inputPassword       
            };
            this.$store.dispatch('saveUser', user).then((savedUser) => {
                this.saveSuccess = true;
                this.isError = false;
                this.savedUser = savedUser;
                this.inputUsername = '';
                this.inputPassword = '';
                this.inputFirstName = '';
                this.inputLastName = '';
                this.inputEmail = '';
                this.inputAge = '';
                this.inputGender = '';
                this.inputAddress = {
                    street: '',
                    street2: '',
                    city: '',
                    state: '',
                    zip: ''
                };
                this.inputDeliveryPreferences = {
                    mealsPerWeek: 0,
                    minDeliveriesPerWeek: 0,
                    maxDeliveriesPerWeek: 0,
                    servingsPerMeal: 0
                };
            })
            .catch(() => {
                this.saveSuccess = false;
                this.isError = true;
                this.savedUser = null;
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
