import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import VueResource from "vue-resource"
import VModal from 'vue-js-modal'
import router from './router'
import {HnHMaxZoom} from "./utils/LeafletCustomTypes";
import {Server} from "miragejs";
import vuetify from './plugins/vuetify';

export const API_ENDPOINT = `api`;

export function getTileUrl(x, y, zoom) {
    return `grids/${HnHMaxZoom - zoom}/${x}_${y}.png`
}

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'development') {
new Server({
    routes() {
        this.namespace = 'map/' + API_ENDPOINT;
        this.get("v1/characters", () => {
                return []
            }
        );
        this.get("v1/markers", () => {
                return [{
                    "name": "test",
                    "id": 150,
                    "map": 2,
                    "position": {"x": 100, "y": -100},
                    "image": "gfx/terobjs/mm/custom",
                    "hidden": false
                }]
            }
        );
        this.get("maps/", () => {
                return {
                    "2": {"ID": 2, "Name": "MAIN", "Hidden": false, "Priority": true},
                    "5": {"ID": 5, "Name": "LEVEL 2", "Hidden": false, "Priority": true}
                }
            }
        );
        this.get("config/", () => {
                return {"title": "map", "auths": ["map", "markers", "upload", "admin"]}
            }
        );
    }
});
}

Vue.use(VueResource);
Vue.use(VModal)

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');
