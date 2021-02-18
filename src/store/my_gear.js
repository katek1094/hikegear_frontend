// import {getCookie} from '@/store/functions'

export default {
    namespaced: true,
    state() {
        return {
            my_gear: {}
        }
    },
    mutations: {
        set_my_gear(state, my_gear_list) {
            state.my_gear = my_gear_list
        }
    },
    actions: {
        changeMyGear({commit}, new_data) {
            commit('set_my_gear', new_data)
        }
    },
    getters: {
        get_my_gear(state) {
            return state.my_gear
        }
    }
}
