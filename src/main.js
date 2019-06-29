// @ts-ignore
import Vue from "vue";
import './plugins/vuetify';
// @ts-ignore
import App from "./App.vue";
import Vuetify from 'vuetify';
// import router from './router/index';

Vue.config.productionTip = false;

Vue.use(Vuetify);

new Vue({
  render: h => h(App)
}).$mount("#app");
