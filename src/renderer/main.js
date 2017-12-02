import Vue from 'vue'
import VeeValidate from 'vee-validate'
import axios from 'axios'
import {remote} from 'electron';

import App from './App'
import router from './router'
import store from './store'
import helpers from './lib/electronHelpers'

import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.min.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

//set axios defaults
axios.defaults.baseURL = 'https://skillicookingprodapi.info/api';
axios.defaults.headers.post['client-password'] = 'tTptcVawXzzbDTNygO9Mc';
axios.defaults.headers.get['client-password'] = 'tTptcVawXzzbDTNygO9Mc';
axios.defaults.headers.put['client-password'] = 'tTptcVawXzzbDTNygO9Mc';
axios.defaults.headers.delete['client-password'] = 'tTptcVawXzzbDTNygO9Mc';
axios.interceptors.request.use(function(config) {
  return config;
})

//add context menu
const menu = helpers.createContextMenu();
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
}, false);

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VeeValidate)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
