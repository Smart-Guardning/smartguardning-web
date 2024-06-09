import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        sideBarOpen: false
    },
    getters: {
        sideBarOpen: state => state.sideBarOpen
    },
    mutations: {
        toggleSidebar(state) {
            state.sideBarOpen = !state.sideBarOpen;
        }
    },
    actions: {
        toggleSidebar({ commit }) {
            commit('toggleSidebar');
        }
    }
});
