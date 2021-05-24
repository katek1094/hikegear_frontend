import {createStore} from "vuex";
import editor from './editor/index.js'
import auth from "./auth.js";
import my_gear from './my_gear.js'
import reviews from './reviews.js'

const store = createStore({
    modules: {
        editor: editor,
        auth: auth,
        my_gear: my_gear,
        reviews: reviews
    },
    state() {
        return {
            my_gear_minimized: false
        }
    },
    mutations: {
        set_my_gear_minimized(state, new_value) {
            if (typeof new_value !== 'boolean') throw 'minimzed must be a boolean!'
            state.my_gear_minimized = new_value
        }
    },
    actions: {
        toggleMyGearMinimized({commit, getters}) {
            commit('set_my_gear_minimized', !getters['is_my_gear_minimized'])
        }
    },
    getters: {
        is_my_gear_minimized(state) {
            return state.my_gear_minimized
        }
    }
})

export default store;
