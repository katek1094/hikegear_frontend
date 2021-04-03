import {summarize_elements_list} from "@/functions";
import Constants from '@/constants'

export default {
    backpacks(state) {
        return state.backpacks
    },
    are_any_changes(state) {
        if (state.static.name !== state.dynamic.name) return true
        if (state.static.description !== state.dynamic.description) return true
        if (!state.dynamic.list) return false
        if (state.dynamic.list.length !== state.static.list.length) return true
        for (let c = 0; c < state.dynamic.list.length; c++) {
            if (state.dynamic.list[c].name !== state.static.list[c].name) return true
            if (state.dynamic.list[c].items.length !== state.static.list[c].items.length) return true
            for (let i = 0; i < state.dynamic.list[c].items.length; i++) {
                for (const [key, value] of Object.entries(state.static.list[c].items[i])) {
                    if (value !== state.dynamic.list[c].items[i][key]) return true
                }
            }
        }
        return false
    },
    isEditorDataReady(state) {
        return Boolean(state.dynamic.list)
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
    new_item_id(state) {
        let ids = []
        for (const category of state.dynamic.list) {
            for (const item of category.items) ids.push(item.id)
        }
        const max_items_amount = Constants.CATEGORIES_MAX_AMOUNT * Constants.ITEMS_IN_CATEGORY_MAX_AMOUNT
        for (const integer of [...Array(max_items_amount).keys()]) {
            if (!ids.includes(integer)) return integer
        }
        throw 'new_item_id bug, cant find free id'
    },
    new_category_id(state) {
        let ids = []
        for (const category of state.dynamic.list) ids.push(category.id)
        for (const integer of [...Array(Constants.CATEGORIES_MAX_AMOUNT).keys()]) {
            if (!ids.includes(integer)) return integer
        }
        throw 'new_category_id bug, cant find free id'
    },
    bodyBackpackData(state) {
        let data = {}
        data.name = state.dynamic.name
        data.description = state.dynamic.description
        data.list = state.dynamic.list
        return JSON.stringify(data)
    },
    dynamic_backpack_data(state) {
        return state.dynamic
    },
    dynamic_list(state) {
        return state.dynamic.list
    },
}
