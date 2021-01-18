import { createStore } from "vuex";
// import createPersistedState from "vuex-persistedstate";
import editor from './editor/index.js'

const store = createStore({
    modules: {
        editor: editor
    },
    // plugins: [createPersistedState({
    //     storage: window.sessionStorage,
    // })],
})

export default store;