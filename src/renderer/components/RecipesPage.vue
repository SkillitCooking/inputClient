<template>
    <div>
        <h1 class="title">Recipes</h1>
        <action-nav :is-edit.sync="isEdit" :is-create.sync="isCreate"></action-nav>
        <edit v-if="isEdit"></edit>
        <create v-if="isCreate"></create>
    </div>
</template>

<script>
import ActionNav from './lib/ActionNav.vue'
import Create from './RecipesPage/Create';
import Edit from './RecipesPage/Edit';
import store from '../store';
import mutation from '../store/mutation-types';

export default {
  components: {
      ActionNav,
      Create,
      Edit
  },
  data: function() {
    return {
      isEdit: false,
      isCreate: true
    }
  },
  beforeRouteEnter(to, from, next) {
    if(from.name === 'login-page') {
        if(!store.state.Loading.loading) {
          store.commit(mutation.LOADING.START);
        }
        setTimeout(() => {
          next();
          store.commit(mutation.LOADING.STOP);
        }, 300);
    } else {
      next();
    }
  }
}
</script>
<style scoped>

</style>