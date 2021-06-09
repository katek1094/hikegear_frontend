const cat_max_name_len = 30
const item_max_name_len = 60
const item_max_description_len = 400
const item_max_weight = 99999
const item_max_quantity = 99
const backpack_max_name_length = 60
const backpack_max_description_length = 3000
const password_min_length = 8
const password_max_length = 128
const editor_save_timeout = 3000
const categories_max_amount = 16  // it should be the same number as amount of chart colors in Summary
const items_in_category_max_amount = 30
const max_backpacks_amount = 40
const hashids_salt = 'hikegear salt'
const hashids_hash_len = 8
const review_summary_max_length = 120
const review_text_max_length = 4000
const product_name_max_length = 100

export default {
    CATEGORY_MAX_NAME_LENGTH: cat_max_name_len,
    ITEM_MAX_NAME_LENGTH: item_max_name_len,
    ITEM_MAX_DESCRIPTION_LENGTH: item_max_description_len,
    ITEM_MAX_WEIGHT: item_max_weight,
    ITEM_MAX_QUANTITY: item_max_quantity,
    BACKPACK_MAX_NAME_LENGTH: backpack_max_name_length,
    BACKPACK_MAX_DESCRIPTION_LENGTH: backpack_max_description_length,
    PASSWORD_MIN_LENGTH: password_min_length,
    PASSWORD_MAX_LENGTH: password_max_length,
    EDITOR_SAVE_TIMEOUT: editor_save_timeout,
    CATEGORIES_MAX_AMOUNT: categories_max_amount,
    ITEMS_IN_CATEGORY_MAX_AMOUNT: items_in_category_max_amount,
    MAX_BACKPACKS_AMOUNT: max_backpacks_amount,
    HASHIDS_SALT: hashids_salt,
    HASHIDS_HASH_LEN: hashids_hash_len,
    REVIEW_SUMMARY_MAX_LEN: review_summary_max_length,
    REVIEW_TEXT_MAX_LEN: review_text_max_length,
    PRODUCT_NAME_MAX_LEN: product_name_max_length
}
