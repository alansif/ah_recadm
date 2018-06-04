import promise from 'es6-promise';
promise.polyfill();

import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import routes from './routes'
import axios from 'axios'
import * as Influx from "influx"
import cfg from "./config";
import App from './App.vue'

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$influx = new Influx.InfluxDB(cfg.dbcfg);

const router = new VueRouter({
    mode: 'history',
    scrollBehavior: function (to, from, savedPosition) {
        if (to.hash) {
            return {selector: to.hash}
        } else {
            return {x: 0, y: 0}
        }
    },
    routes
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
