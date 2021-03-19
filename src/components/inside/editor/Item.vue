<template>
  <div class="item">
    <Tooltip text="naciśnij i przeciągnij w inne miejsce" direction="right">
      <span class="item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
    </Tooltip>
    <AutoResizable ref="name_input" v-model.trim="item_name" :maxlength="max_name_length" :prevent-enter="true"
                   class="item__name" placeholder="nazwa" @keydown="handleEnter"/>
    <AutoResizable ref="description_input" v-model="item_description" :maxlength="max_description_length"
                   class="item__description" placeholder="opis"/>
    <Tooltip text="oznacz jako noszony na sobie" direction="top" size="small">
      <button :class="{ checked: item.worn }" :disabled="item.consumable" class="item__worn" @click="switchWorn">
        <font-awesome-icon class="fa-md" icon="child"/>
      </button>
    </Tooltip>
    <Tooltip text="oznacz jako konsumpcyjny" direction="top" size="small">
      <button :class="{ checked: item.consumable }" :disabled="item.worn" class="item__consumable"
              @click="switchConsumable">
        <font-awesome-icon class="fa-md" icon="sync-alt"/>
      </button>
    </Tooltip>
    <input ref='weight_input' v-model.number="item_weight" :max="weight_limit" class="item__weight" min="0"
           name="item_weight" type="number" @blur="fillWithZero" @input="removeLeadingZero"
           @keydown="preventNumericChars">
    <input ref="quantity_input" v-model.number="item_quantity" :max="quantity_limit" class="item__quantity" min="0"
           name="item_quantity" type="number" @blur="fillWithZero" @input="removeLeadingZero"
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
import {ref, computed} from 'vue';
import {useStore} from 'vuex';
import Tooltip from "@/components/Tooltip";

export default {
  name: "Item",
  components: {
    Tooltip,
    AutoResizable
  },
  props: {
    item: Object,
    category_id: Number
  },
  setup(props) {
    const store = useStore()

    const weight_limit = 99999
    const quantity_limit = 99
    const max_name_length = 60
    const max_description_length = 700
    const name_input = ref(null)  //template ref
    const description_input = ref(null)  //template ref
    const weight_input = ref(null)  //template ref
    const quantity_input = ref(null)  //template ref

    const item_name = computed({
      get: () => props.item.name,
      set: (val) => store.dispatch('editor/changeItemProperty', {
        category_id: props.category_id,
        id: props.item.id,
        property: 'name',
        new_value: val
      })
    })
    const item_description = computed({
      get: () => props.item.description,
      set: (val) => store.dispatch('editor/changeItemProperty', {
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
          store.dispatch('editor/changeItemProperty', {
            category_id: props.category_id,
            id: props.item.id,
            property: 'weight',
            new_value: val
          })
        } else weight_input.value.value = props.item.weight
      }
    })
    const item_quantity = computed({
      get: () => props.item.quantity,
      set: (val) => {
        if ((val <= quantity_limit) && (val >= 0)) {
          store.dispatch('editor/changeItemProperty', {
            category_id: props.category_id,
            id: props.item.id,
            property: 'quantity',
            new_value: val
          })
        } else quantity_input.value.value = props.item.quantity
      }
    })
    const switchWorn = () => store.dispatch('editor/switchWorn', {
      category_id: props.category_id,
      id: props.item.id
    })
    const switchConsumable = () => store.dispatch('editor/switchConsumable', {
      category_id: props.category_id,
      id: props.item.id
    })
    const deleteItem = () => store.dispatch('editor/deleteItem', {
      item_id: props.item.id, category_id: props.category_id
    })
    const preventNumericChars = (e) => {
      if ((e.keyCode === 69) || (e.keyCode === 189)) e.preventDefault()
      if ((e.target.className === 'item__quantity') && (e.keyCode === 190)) e.preventDefault()
    }
    const resizeAll = () => {
      name_input.value.resize()
      description_input.value.resize()
    }
    const removeLeadingZero = (e) => {
      if ((String(e.target.value)[0] === '0') && (e.target.value.length > 1)) {
        e.target.value = String(e.target.value).slice(1)
      }
    }
    const fillWithZero = (e) => {
      if (e.target.value === '') {
        if (e.target.getAttribute('name') === 'item_quantity') item_quantity.value = 0
        else if (e.target.getAttribute('name') === 'item_weight') item_weight.value = 0
      }
    }
    const handleEnter = (event) => {
      if (event.keyCode === 13) description_input.value.$el.focus()
    }
    const focusName = () => name_input.value.$el.focus()

    return {
      weight_limit, quantity_limit, max_name_length, max_description_length, //data
      name_input, description_input, weight_input, quantity_input,  //refs
      item_name, item_description, item_weight, item_quantity, //computed
      switchWorn, switchConsumable, deleteItem, preventNumericChars, resizeAll, removeLeadingZero, fillWithZero,
      handleEnter, focusName  //methods
    }
  },
}
</script>

<style lang="scss" scoped>
.item:not(:last-child) {
  border-bottom: 1px dotted grey;
}

.item__worn, .item__consumable {
  border-radius: 50%;
  border: none;
  background-color: transparent;
  outline: none;
  color: grey;
  padding: 4px;
  font-size: 1.15em;
  margin: 0 3px;
}

.checked {
  color: blue;
}

@media (hover: hover) and (pointer: fine) {
  .item__worn, .item__consumable {
    visibility: hidden;
  }
  .no_drag .item:hover .item__worn, .no_drag .item:hover .item__consumable {
    visibility: visible;
  }
  .item__worn:hover:enabled, .item__consumable:hover:enabled {
    color: black;
  }
  .checked {
    visibility: visible;
  }
}

.item__worn:enabled, .item__consumable:enabled {
  cursor: pointer;
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

