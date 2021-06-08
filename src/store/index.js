import {createStore} from "vuex";
import editor from './editor/index.js'
import auth from "./auth.js";
import my_gear from './my_gear.js'
import reviews from './reviews.js'
import {apiFetch} from '@/functions'

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
        },
        getInitialData({commit}) {
            return apiFetch('initial', {
                method: 'GET'
            }, [403])
                .then(response => {
                    if (response.ok) {
                        return response.json().then(data => {
                            if (data.backpacks.length > 0) {
                                commit('editor/copy_and_set_dynamic_backpack', data.backpacks[0], {root: true})
                                commit('editor/copy_and_set_static_backpack', data.backpacks[0], {root: true})
                                commit('editor/set_backpacks', data.backpacks, {root: true})
                            } else {
                                commit('editor/copy_and_set_dynamic_backpack', [], {root: true})
                                commit('editor/copy_and_set_static_backpack', [], {root: true})
                                commit('editor/set_backpacks', [], {root: true})
                            }
                            if (data['private_gear'].length === 0) {
                                data['private_gear'] = [{name: "", description: '', id: 0, items: []}]
                            }
                            commit('my_gear/copy_and_set_static', data['private_gear'], {root: true})
                            commit('my_gear/copy_and_set_dynamic', data['private_gear'], {root: true})
                            commit('reviews/set_categories', data['categories'], {root: true})
                            commit('reviews/set_brands', data['brands'], {root: true})
                            commit('auth/set_user_id', data['user_id'], {root: true})

                            return response
                        })
                    } else if (response.status === 403) return response // 403
                })
        }
    },
    getters: {
        is_my_gear_minimized(state) {
            return state.my_gear_minimized
        }
    }
})

export default store;
