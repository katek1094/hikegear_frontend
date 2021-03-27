import {ref, computed, onMounted, onBeforeUnmount, onBeforeUpdate} from 'vue'
import {useStore} from 'vuex'
import Constants from '@/constants'

export function useNoDrag() {
    const no_drag = ref(true)
    const toggleNoDrag = () => no_drag.value = !no_drag.value
    return {no_drag, toggleNoDrag}
}

export function useAutoresizeAll(resizeAll) {
    if (typeof resizeAll !== 'function') throw 'resizeAll must be a function (argument in useAutoresizingAll)'
    const resizes_counter = ref(0) //every time window is resized, it increments, in handleWindowResize()
    const handleWindowResize = () => {
        resizes_counter.value += 1
        const x = resizes_counter.value
        setTimeout(() => {
            if (x === resizes_counter.value) resizeAll()
        }, 300)
    }
    onMounted(() => window.addEventListener('resize', handleWindowResize))
    onBeforeUnmount(() => window.removeEventListener("resize", handleWindowResize));
}

export function useCategories(action, categories) {
    if (typeof action !== 'string') throw 'action must be a string (argument in useCategories)'
    const store = useStore()
    const categories_refs = ref([])  //array of template refs created with setCategoryRef()

    const setCategoryRef = (el) => {
        if (el) categories_refs.value.push(el)
    }
    const addCategory = async () => {
        await store.dispatch(action)
        window.scrollTo(0, document.body.scrollHeight)
        categories_refs.value[categories_refs.value.length - 1].focusName()
    }
    const can_add_category = computed(() => categories.value.length < Constants.CATEGORIES_MAX_AMOUNT)

    return {categories_refs, can_add_category, addCategory, setCategoryRef}
}

export function useEditor(are_changes, save, categories_refs, state_watch_func) {
    if (!(typeof are_changes === 'object' && typeof save === 'function' && typeof categories_refs === 'object' && typeof state_watch_func === 'function')) throw 'bad arguments in useEditor'
    const store = useStore()
    const save_progress = ref(null) //template ref
    const handleCtrlS = (e) => {
        if (e.key === 's' && e.ctrlKey === true) {
            e.preventDefault()
            if (are_changes.value) save_progress.value.handleCtrlS()
            save()
        }
    }
    const handleDataChange = () => {
        if (save_progress.value) { //in case of creating first backpack, then saveprogress is undefined
            categories_refs.value = []
            save_progress.value.handleEdit(are_changes.value)
        }
    }
    store.watch(state_watch_func, handleDataChange, {deep: true});

    onMounted(() => {
        window.addEventListener('keydown', handleCtrlS);
    })
    onBeforeUnmount(() => {
        window.removeEventListener("keydown", handleCtrlS);
        save(false)
    })
    return save_progress
}

export function useConfirmationDialog(confirm_condition_computed = {value: true}, alternative = false) {
    const confirmation_dialog = ref(null) //template ref
    const displayConfirmationDialog = () => {
        if (confirm_condition_computed.value) confirmation_dialog.value.openModal()
        else if (typeof alternative === 'function') alternative()
    }
    return {confirmation_dialog, displayConfirmationDialog}
}

export function useCategory(add_action, add_argument, items) {
    const store = useStore()
    const max_name_length = Constants.CATEGORY_MAX_NAME_LENGTH
    const name_input = ref(null) //template ref
    const items_refs = ref([]) //array of template refs created with setItemRef()
    const setItemRef = (el) => {
        if (el) items_refs.value.push(el)
    }
    const resizeAllItems = () => {
        for (const item_ref of items_refs.value) item_ref.resizeAll()
    }

    const can_add_item = computed(() => items.value.length < Constants.ITEMS_IN_CATEGORY_MAX_AMOUNT)

    const addItem = async () => {
        await store.dispatch(add_action, add_argument)
        // const added_item = items_refs.value[items_refs.value.length - 1].$el
        // window.scrollTo(0, added_item.scrollHeight / 2 + window.scrollY)
        items_refs.value[items_refs.value.length - 1].focusName()
    }

    const focusName = () => name_input.value.focus()
    onBeforeUpdate(() => items_refs.value = [])

    return {max_name_length, name_input, can_add_item, addItem, setItemRef, resizeAllItems, focusName}
}

export function useItem(item_weight, item_quantity) {
    const max_name_length = Constants.ITEM_MAX_NAME_LENGTH
    const max_description_length = Constants.ITEM_MAX_DESCRIPTION_LENGTH
    const weight_limit = Constants.ITEM_MAX_WEIGHT
    const name_input = ref(null)  //template ref
    const description_input = ref(null)  //template ref

    const focusName = () => name_input.value.focusTextarea()
    const handleEnter = (event) => {
        if (event.keyCode === 13) description_input.value.$el.focus()
    }
    const fillWithZero = (e) => {
        if (e.target.value === '') {
            if (e.target.getAttribute('name') === 'item_quantity') item_quantity.value = 0
            else if (e.target.getAttribute('name') === 'item_weight') item_weight.value = 0
        }
    }
    const removeLeadingZero = (e) => {
        if ((String(e.target.value)[0] === '0') && (e.target.value.length > 1)) {
            e.target.value = String(e.target.value).slice(1)
        }
    }
    const resizeAll = () => {
        name_input.value.resize()
        description_input.value.resize()
    }
    const charControl = (e) => {
        const allowed_codes = [8, 9, 13, 46, 37, 38, 39, 40, // backspace, tab, enter, delete, arrows
            48, 49, 50, 51, 52, 53, 54, 55, 56, 57] // 0-9 numbers and
        if (!allowed_codes.includes(e.keyCode)) e.preventDefault()
        if ((e.target.getAttribute('name') === 'item_quantity') && (e.keyCode === 190)) e.preventDefault()
    }

    return {
        weight_limit,
        max_name_length,
        max_description_length,
        name_input,
        description_input,
        focusName,
        handleEnter,
        fillWithZero,
        removeLeadingZero,
        resizeAll,
        charControl
    }
}
