import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

export default {
    namespaced: true,
    state() {
        return {
            static: {},
            dynamic: {},
            backpacks: [],
            // id: 1,
            // name: '',
            // profile: {
            //     user_id: 1
            // },
            // description: '',
            // created: '',
            // updated
            // list: []
        }
    },
    mutations,
    getters,
    actions
}
