<template>
  <div class="my-gear_frame">
    <div class="header">
      <h2>mój sprzęt</h2>
    </div>
    <draggable v-model="elements" :clone="deepCopy" :group="{name: 'items', pull: 'clone', put: ['items']}"
               :sort="false" animation="700" class="my-gear_items" emptyInsertThreshold="30" handle=".item__handle"
               item-key="id">
      <template #item="{element}">
        <div v-if="!element.is_item" class="my-category">
          <span class="item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
          <span class="category_name">{{ element.name }}</span>
        </div>
        <div v-else class="my-item">
          <span class="item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
          <span class="name">{{ element.name }}</span>
          <span class="description">{{ element.description }}</span>
          <span class="weight">{{ element.weight }}</span>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: "MyGear",
  components: {draggable},
  data() {
    return {}
  },
  computed: {
    elements() {
      const categories = this.$store.getters['my_gear/dynamic_list']
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
    }
  },
  methods: {
    deepCopy(original) {
      let deep_copy = JSON.parse(JSON.stringify(original))
      return {
        type: 'item', name: deep_copy.name, description: deep_copy.description,
        weight: deep_copy.weight, id: this.$store.getters['editor/new_item_id'],
        worn: false, consumable: false, quantity: 1
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.my-gear_frame {
  width: 100%;
  background: $windows_color;
  max-width: $my_gear_max_width;
  min-width: $my_gear_min_width;
  max-height: 90vh;
  border-radius: 4px;
  position: -webkit-sticky;
  position: sticky;
  top: 5vh;
  padding: 8px;
  box-sizing: border-box;
  @include flex-column-center;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: center;
  height: 8vh;
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
  @include editor-category_grid;
  grid-template-columns: auto 3fr 4fr 2.8rem;
  column-gap: 2px;
  padding: 2px 0;
  border-bottom: 1px dotted grey;
}

.my-gear_items {
  font-size: .7rem;
  background-color: $background;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding: 0 3px;
  box-sizing: border-box;
}

.item__handle {
  @include sort-handle;
}

@media (hover: hover) and (pointer: fine) {
  .my-item:hover .item__handle {
    visibility: visible;
  }
}

.sortable-chosen {
  @include sort-chosen;
}

.categories .sortable-chosen {
  font-size: .8rem;
}

.my-item .name, .my-item .description {
  word-wrap: anywhere;
}

.description {
  margin-right: 3px;
}


</style>
