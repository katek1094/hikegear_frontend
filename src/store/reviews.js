export default  {
    namespaced: true,
    state() {
        return {
            categories: [],
            brands: []
        }
    },
    mutations: {
        set_categories(state, categories) {
            state.categories = categories
        },
        set_brands(state, brands) {
            state.brands = brands
        }
    },
    actions: {

    },
    getters: {
        categories(state) {
            return state.categories
        },
        brands(state) {
            return state.brands
        }
    }
}