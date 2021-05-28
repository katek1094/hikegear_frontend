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

    onMounted(() => window.addEventListener('keydown', handleCtrlS))
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
    const handleEnter = (event) => { // after Enter on Item name input moves focus to the Item description input
        if (event.keyCode === 13) description_input.value.$el.focus()
    }
    const fillWithZero = (e) => {
        const name = e.target.getAttribute('name')
        if (e.target.value === '') {
            if (name === 'item_quantity') item_quantity.value = 0
            else if (name === 'item_weight') item_weight.value = 0
        }
    }
    const removeLeadingZero = (e) => {
        const value = String(e.target.value)
        if ((value[0] === '0') && (value.length > 1)) e.target.value = value.slice(1)
    }
    const resizeAll = () => {
        name_input.value.resize()
        description_input.value.resize()
    }
    const charControl = (e) => {
        const allowed_codes = [8, 9, 13, 46, 37, 38, 39, 40, // backspace, tab, enter, delete, arrows
            17, 67, 86, 88, // ctrl, c, v, x,
            96, 97, 98, 99, 100, 101, 102, 103, 104, 105, // numeric tab
            48, 49, 50, 51, 52, 53, 54, 55, 56, 57] // 0-9 numbers
        if (!allowed_codes.includes(e.keyCode)) e.preventDefault()
    }

    return {
        weight_limit, max_name_length, max_description_length, name_input, description_input,
        focusName, handleEnter, fillWithZero, removeLeadingZero, resizeAll, charControl
    }
}

export function useInputs() {
    class Input {  // class for creating inputs to the form hooks
        constructor(name, isValid) {
            this.name = name // used for referencing in inputs object and as html element names
            this.value = ''
            this.blurred = false // is true after blur event
            this.activated = false // is true after input event
            this.response_info = false
            this.isValid = isValid  // should be a function that takes value, and returns ValidityInfo object
        }

        get is_valid() { // returns if input field value is valid using isValid function
            return this.isValid(this.value).is_valid
        }

        get info() { // return info from ValidityInfo object form isValid function checks or response info assigned after fetch
            if (!this.is_valid && this.marked) return this.isValid(this.value).info
            else if (this.response_info) return this.response_info
            else return false
        }

        get marked() { // used for 'marked' class binding which gives input red border
            return !this.is_valid && this.blurred && this.activated
        }

        reset() { // resets input, used after successful request
            this.value = ''
            this.blurred = false
            this.activated = false
        }
    }

    class ValidityInfo { // used in isValid functions, for returning inputs validity and info (if not valid)
        constructor(is_valid, info) {
            this.is_valid = is_valid
            this.info = info
        }
    }

    return {Input, ValidityInfo}
}

export function useForm(inputs) {
    const markAsBlurred = (e) => {
        let name = e.target.getAttribute('name')
        if (inputs[name].activated) inputs[name].blurred = true
    }
    const markAsActivated = (e) => {
        let name = e.target.getAttribute('name')
        inputs[name].activated = true
        inputs[name].response_info = false
    }
    const waiting_for_response = ref(false)

    return {waiting_for_response, markAsBlurred, markAsActivated}
}

export function useEmail() {
    const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const {ValidityInfo} = useInputs()
    const isEmailValid = (email_value) => {
        if (email_regex.test(String(email_value).toLowerCase())) return new ValidityInfo(true, '')
        else return new ValidityInfo(false, 'email jest niepoprawny')
    }
    return {isEmailValid}
}

export function usePasswords() {
    const min_password_length = Constants.PASSWORD_MIN_LENGTH
    const max_password_length = Constants.PASSWORD_MAX_LENGTH
    const numeric_regex = /^\d+$/
    const {ValidityInfo} = useInputs()

    const not_long_enough = (password_value) => password_value.length < min_password_length
    const too_long = (password_value) => password_value.length > max_password_length
    const entirely_numeric = (password_value) => numeric_regex.test(password_value)

    const isPasswordValid = (password_value) => { // it is used as isValid function for Input class instances in inputs
        if (not_long_enough(password_value)) return new ValidityInfo(false, 'hasło jest zbyt krótkie')
        else if (too_long(password_value)) return new ValidityInfo(false, 'hasło jest za długie')
        else if (entirely_numeric(password_value)) return new ValidityInfo(false, 'hasło nie może się składać tylko z cyfr')
        else return new ValidityInfo(true, '')
    }
    const arePasswordsEqual = (password_to_compare, password_value) => { // used as isValid function, for second password in form
        if (password_to_compare.is_valid) {
            if (password_to_compare.value === password_value) return new ValidityInfo(true, '')
            else return new ValidityInfo(false, 'hasła nie są takie same')
        } else return new ValidityInfo(false, '')
    }

    return {min_password_length, max_password_length, isPasswordValid, arePasswordsEqual}
}

export function useFilters() {
    const store = useStore()
    const categories = computed(() => store.getters['reviews/categories'])
    const brands = computed(() => store.getters['reviews/brands'])
    const selected_category_id = ref(null)
    const selected_subcategory_id = ref(null)
    const selected_brand_id = ref(null)

    const subcategories = computed(() => {
        if (selected_category_id.value === null) return false
        else {
            const sub = categories.value.find((el) => el.id === selected_category_id.value).subcategories
            if (sub.length === 1) return false
            else return sub
        }
    })

    const setBrandId = (payload) => selected_brand_id.value = payload.id

    return {
        categories, brands, selected_category_id, selected_subcategory_id, selected_brand_id, subcategories,
        setBrandId
    }
}