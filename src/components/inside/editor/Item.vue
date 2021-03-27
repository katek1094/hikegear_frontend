<template>
  <div class="item">
    <Tooltip text="naciśnij i przeciągnij w inne miejsce" direction="right">
      <span class="item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
    </Tooltip>
    <AutoResizable ref="name_input" v-model.trim="item_name" :maxlength="max_name_length" :prevent-enter="true"
                   class="item__name" placeholder="nazwa" @keydown="handleEnter"/>
    <AutoResizable ref="description_input" v-model="item_description" :maxlength="max_description_length"
                   class="item__description" placeholder="opis"/>
    <Tooltip :text=worn_tooltip_text direction="top" size="small">
      <button :class="{ checked: item.worn }" :disabled="item.consumable" class="item__worn" @click="switchWorn">
        <font-awesome-icon class="fa-md" icon="child"/>
      </button>
    </Tooltip>
    <Tooltip :text=consumable_tooltip_text direction="top" size="small">
      <button :class="{ checked: item.consumable }" :disabled="item.worn" class="item__consumable"
              @click="switchConsumable">
        <font-awesome-icon class="fa-md" icon="sync-alt"/>
      </button>
    </Tooltip>
    <input ref='weight_input' v-model.number="item_weight" :max="weight_limit" class="item__weight" min="0"
           name="item_weight" type="number" @blur="fillWithZero" @input="removeLeadingZero"
           @keydown="charControl" inputmode="decimal">
    <input ref="quantity_input" v-model.number="item_quantity" :max="quantity_limit" class="item__quantity" min="0"
           name="item_quantity" type="number" @blur="fillWithZero" @input="removeLeadingZero"
           @keydown="charControl" inputmode="decimal">
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
import {useItem} from "@/hooks";
import Constants from '@/constants'

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

    const quantity_limit = Constants.ITEM_MAX_QUANTITY
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

    const {
      weight_limit, max_name_length, max_description_length, name_input, description_input,
      focusName, handleEnter, fillWithZero, removeLeadingZero, resizeAll, charControl
    } = useItem(item_weight, item_quantity)

    const worn_tooltip_text = computed(() => {
      if (props.item.worn) return 'oznaczony jako noszony na sobie'
      else if (!props.item.consumable) return 'oznacz jako noszony na sobie'
      else return 'przedmiot nie może być oznaczony jako konsumpcyjny i noszony na sobie na raz!'
    })
    const consumable_tooltip_text = computed(() => {
      if (props.item.consumable) return 'oznaczony jako konsumpcyjny'
      else if (!props.item.worn) return 'oznacz jako konsumpcyjny'
      else return 'przedmiot nie może być oznaczony jako noszony na sobie i konsumpcyjny na raz!'
    })

    return {
      weight_limit, quantity_limit, max_name_length, max_description_length, //data
      name_input, description_input, weight_input, quantity_input,  //refs
      item_name, item_description, item_weight, item_quantity, worn_tooltip_text, consumable_tooltip_text, //computed
      switchWorn, switchConsumable, deleteItem, charControl, resizeAll, removeLeadingZero, fillWithZero,
      handleEnter, focusName  //methods
    }
  },
}
</script>

<style lang="scss" scoped>
.item {
  @include editor-item;

  &__quantity {
    @include editor-input__field;
  }

  &__worn, &__consumable {
    border-radius: 50%;
    border: none;
    background-color: transparent;
    outline: none;
    color: grey;
    padding: 4px;
    //font-size: 1.15em;
    font-size: 1rem;
    margin: 0 3px;
  }
}

.checked {
  color: blue;
}

@media (hover: hover) and (pointer: fine) {
  .item__worn, .item__consumable {
    visibility: hidden;
  }
  .no_drag_item .item:hover .item__worn, .no_drag_item .item:hover .item__consumable {
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

</style>

