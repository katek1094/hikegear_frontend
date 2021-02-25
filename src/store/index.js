import {createStore} from "vuex";
import editor from './editor/index.js'
import auth from "./auth.js";
import my_gear from './my_gear.js'

const store = createStore({
    modules: {
        editor: editor,
        auth: auth,
        my_gear: my_gear
    },
})

export default store;
