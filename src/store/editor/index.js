import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

export default {
    namespaced: true,
    state() {
        return {
            static: {},
            dynamic: {}
            // id: 1,
            // name: '',
            // profile: {
            //     id: 1
            // },
            // created: '',
            // list: []
            // TODO: change name of consumable for changeable
        }
    },
    mutations,
    getters,
    actions
}