import {format_elements_list, summarize_elements_list} from "@/store/functions";

export default {
    backpacks(state) {
        return state.backpacks
    },
    are_any_changes(state) {
        if (state.static.name !== state.dynamic.name) return true
        if (state.static.description !== state.dynamic.description) return true
        if (state.dynamic.list === []) return false
        if (state.dynamic.list.length !== state.static.list.length) return true
        const len = (state.dynamic.list.length >= state.static.list.length) ? state.dynamic.list.length : state.static.list.length
        for (let i = 0; i < len; i++) {
            for (const [key, value] of Object.entries(state.static.list[i])) {
                if (value !== state.dynamic.list[i][key]) return true
            }
        }
        return false
    },
    isEditorDataReady(state) {
        return state.dynamic.list
    },
    backpack_name(state) {
        return state.dynamic.name
    },
    backpack_description(state) {
      return state.dynamic.description
    },
    backpack_id(state) {
        return state.dynamic.id
    },
    summary_data(state) {
        return summarize_elements_list(state.dynamic.list)
    },
    organized_list: state => {
        return format_elements_list(JSON.parse(JSON.stringify(state.dynamic.list)))
    },
    new_element_id(state) {
        let ids = []
        for (let i = 0; i < state.dynamic.list.length; i++) {
            ids.push(state.dynamic.list[i].id)
        }
        for (let i = 0; i < 1000 + ids.length; i++) {
            if (!ids.includes(i)) return i
        }
        throw 'loop iterated 1000 times in searching for new, free id, something is wrong!'
    },
    bodyBackpackData(state) {
        let data = {}
        data.name = state.dynamic.name
        data.description = state.dynamic.description
        data.list = state.dynamic.list
        for (let i = 0; i < data.list.length; i++) {
            data.list[i].id = i
        }
        return JSON.stringify(data)
    },
    dynamic_list(state) {
        return JSON.parse(JSON.stringify(state.dynamic.list))
    },
    static_list(state) {
        return JSON.parse(JSON.stringify(state.static.list))
    },
    dynamic_data(state) {
        return state.dynamic
    }


}
