<template>
  <div class="my-gear_window" :class="{no_drag_my_item: no_drag, drag_my_item: !no_drag, minimized: minimized}">
    <h3>mój sprzęt</h3>
    <button class="minimize" @click="toggleMinimized">
      <font-awesome-icon v-if="minimized" class="fa-sm minimize_icon" icon="window-maximize"/>
      <font-awesome-icon v-else class="fa-sm minimize_icon" icon="window-minimize"/>
    </button>
    <draggable v-if="!is_empty" v-model="elements" :clone="deepCopy"
               :group="{name: 'items', pull: 'clone', put: ['items']}"
               :sort="false" animation="700" class="my-gear_items" emptyInsertThreshold="30" handle=".my-item__handle"
               item-key="id" @choose="toggleNoDrag" @unchoose="toggleNoDrag">
      <template #item="{element}">
        <div v-if="!element.is_item" class="my-category">
          <span class="my-item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
          <span class="category_name">{{ element.name }}</span>
        </div>
        <div v-else class="my-item">
          <Tooltip text="naciśnij i przeciągnij w lewo aby dodać do listy sprzętu" direction="right" size="large">
            <span class="my-item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
          </Tooltip>
          <span class="my-item__name">{{ element.name }}</span>
          <span class="my-item__description">{{ element.description }}</span>
          <span class="weight">{{ element.weight }}</span>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Tooltip from "@/components/Tooltip";
import {useNoDrag} from "@/hooks";
import {computed, onMounted} from 'vue'
import {useStore} from 'vuex'

export default {
  name: "MyGear",
  components: {Tooltip, draggable},
  setup() {
    const store = useStore()

    const is_empty = computed(() => (elements.value.length === 1) && (elements.value[0].name === ''))
    const minimized = computed(() => store.getters['is_my_gear_minimized'])
    const toggleMinimized = () => store.dispatch('toggleMyGearMinimized')

    onMounted(() => {
      if (is_empty.value && !minimized.value) toggleMinimized()
    })

    const elements = computed(() => {
      const categories = JSON.parse(JSON.stringify(store.getters['my_gear/dynamic_list']))
      const result = []
      for (const cat of categories) {
        result.push(cat)
        result[result.length - 1].is_item = false
        for (const item of cat.items) {
          result.push(item)
          result[result.length - 1].is_item = true
        }
      }
      return result
    })

    const deepCopy = (original) => {
      let deep_copy = JSON.parse(JSON.stringify(original))
      return {
        name: deep_copy.name, description: deep_copy.description,
        weight: deep_copy.weight, id: store.getters['editor/new_item_id'],
        worn: false, consumable: false, quantity: 1
      }
    }


    const {no_drag, toggleNoDrag} = useNoDrag()

    return {
      minimized, elements, deepCopy, toggleMinimized,
      no_drag, toggleNoDrag, is_empty
    }
  },

}
</script>

<style lang="scss" scoped>
.my-gear_window {
  //width: 92%;
  width: 100%;
  background: $windows_color;
  max-width: $my_gear_max_width;
  max-height: 90vh;
  border-radius: 4px;
  position: -webkit-sticky;
  position: sticky;
  top: 4vh;
  padding: 8px;
  box-sizing: border-box;
  //@include flex-column-center;
  display: none;
  overflow: hidden;
  //overflow-x: hidden;
  justify-self: end;

  &.minimized {
    min-width: 0;
    padding-bottom: 0;
    width: $my_gear_minimized_width;
  }
}

.minimize {
  outline: none;
  background-color: transparent;
  border: none;
  box-shadow: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 5px;
  box-sizing: border-box;
  position: absolute;
  top: 6px;
  right: 14px;

  &:hover {
    background-color: $color_a;
    cursor: pointer;
  }
}

.my-category {
  display: flex;
  justify-items: center;
  align-items: center;
  padding: 2px 0;
  border-bottom: 1px dotted grey;
  font-size: .85rem;
  font-weight: bold;
  background-color: $color_a;
}

.my-item {
  @include category-item_grid;
  grid-template-columns: auto 3fr 4fr $category-item_grid_weight_width - .2rem;
  column-gap: 2px;
  padding: 1px 0;
  border-bottom: 1px dotted grey;

  &__name, &__description {
    word-wrap: anywhere;
  }

  &__description {
    margin-right: 3px;
  }

}

.my-gear_items {
  font-size: .7rem;
  background-color: $background;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding: 0 3px;
  box-sizing: border-box;

  .minimized & {
    display: none;
  }
}

.my-item__handle {
  @include sort-handle;
}

@media (hover: hover) and (pointer: fine) {
  .sortable-chosen.my-item:hover .my-item__handle, .no_drag_my_item .my-item:hover .my-item__handle, {
    visibility: visible;
  }
}

.categories .sortable-chosen {
  font-size: $category-item_font_size;
}

</style>
