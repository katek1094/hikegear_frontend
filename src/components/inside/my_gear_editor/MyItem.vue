<template>
  <div class="my_item">
    <Tooltip text="naciśnij i przeciągnij w inne miejsce" direction="right">
      <span class="my_item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
    </Tooltip>
    <AutoResizable ref="name_input" v-model.trim="item_name" :maxlength="max_name_length" :prevent-enter="true"
                   class="item__name" placeholder="nazwa" @keydown="handleEnter"/>
    <AutoResizable ref="description_input" v-model="item_description" :maxlength="max_description_length"
                   class="item__description" placeholder="opis"/>
    <input ref='weight_input' v-model.number="item_weight" :max="weight_limit" class="item__weight" min="0"
           name="item_weight" type="number" @blur="fillWithZero" @input="removeLeadingZero"
           @keydown="preventNumericChars">
    <Tooltip text="usuń przedmiot" direction="left" size="small">
      <button class="item__delete" type="button" @click="deleteItem">
        <font-awesome-icon class="fa-sm" icon="trash"/>
      </button>
    </Tooltip>
  </div>
</template>

<script>
import AutoResizable from "@/components/AutoResizable";
import {useStore} from "vuex";
import {computed, ref} from "vue";
import Tooltip from "@/components/Tooltip";
import {useItem} from "@/hooks";

export default {
  name: "MyItem",
  components: {Tooltip, AutoResizable},
  props: {item: Object, category_id: Number},
  setup(props) {
    const store = useStore()

    const weight_input = ref(null)  //template ref

    const item_name = computed({
      get: () => props.item.name,
      set: (val) => store.dispatch('my_gear/changeItemProperty', {
        category_id: props.category_id,
        id: props.item.id,
        property: 'name',
        new_value: val
      })
    })
    const item_description = computed({
      get: () => props.item.description,
      set: (val) => store.dispatch('my_gear/changeItemProperty', {
        category_id: props.category_id,
        id: props.item.id,
        property: 'description',
        new_value: val
      })
    })
    const item_weight = computed({
      get: () => props.item.weight,
      set: (val) => {
        if ((val <= weight_limit) && (val >= 0) && (String(val).length <= String(weight_limit).length)) {
          store.dispatch('my_gear/changeItemProperty', {
            category_id: props.category_id,
            id: props.item.id,
            property: 'weight',
            new_value: val
          })
        } else weight_input.value.value = props.item.weight
      }
    })
    const deleteItem = () => store.dispatch('my_gear/deleteItem', {
      item_id: props.item.id, category_id: props.category_id
    })

    const {
      weight_limit, max_name_length, max_description_length, name_input, description_input,
      focusName, handleEnter, fillWithZero, removeLeadingZero, resizeAll, preventNumericChars
    } = useItem(item_weight)

    return {
      weight_limit, max_name_length, max_description_length, //data
      name_input, description_input, weight_input,  //refs
      item_name, item_description, item_weight, //computed
      deleteItem, preventNumericChars, resizeAll, removeLeadingZero, fillWithZero,
      handleEnter, focusName  //methods
    }

  }
}
</script>

<style scoped lang="scss">
.my_item:not(:last-child) {
  border-bottom: 1px dotted grey;
}

/*code below removes arrows from weight input*/
.item__weight::-webkit-outer-spin-button,
.item__weight::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.item__weight[type=number] {
  -moz-appearance: textfield;
}

</style>
