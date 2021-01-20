import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import editor from './editor/index.js'
import auth from "./auth.js";


const store = createStore({
    modules: {
        editor: editor,
        auth: auth
    },
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
})

export default store;