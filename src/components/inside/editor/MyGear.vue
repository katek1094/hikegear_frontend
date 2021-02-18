<template>
  <div class="frame">
    <div class="header">
      <h2>mój sprzęt</h2>
    </div>
    <draggable v-model="items" class="items" :group="{name: 'items', pull: 'clone', put: false}"
               item-key="id" handle=".item__handle" emptyInsertThreshold="30" animation="700">
      <template #item="{element}">
        <div class="item">
          <span class="item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
          <span class="">{{ element.name }}</span>
          <span class="">{{ element.description }}</span>
          <span class="">{{ element.weight }}</span>
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
    return {
      items_list: [
        {
          type: 'item',
          name: 'karimata',
          description: 'Quechua m100',
          weight: 200,
          quantity: 1,
          worn: false,
          consumable: false,
          index: 0,
          id: 1
        },
        {
          type: 'item',
          name: 'liner',
          description: 'jedwabny decathlon',
          weight: 110,
          quantity: 1,
          worn: false,
          consumable: false,
          index: 0,
          id: 1
        },
      ]
    }
  },
  computed: {
    items: {
      get() {
        return this.items_list
      },
      set(val) {
        this.items_list = val
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.frame {
  margin-left: 50px;
  background: $windows_color;
  width: 400px;
  height: 80vh;
  border-radius: 4px;
  position: -webkit-sticky;
  position: sticky;
  top: 10vh;
  padding: 4px;
}

.header {
  display: flex;
  justify-content: center;
}

.item {
  @include editor-category_grid;
  grid-template-columns: auto 1fr 1fr 3rem;
  padding: 2px 0 ;
}

.items {
  @include editor-items;
  font-size: .8rem;
}

.item:not(:last-child) {
  border-bottom: 1px dotted grey;
}

.item__handle {
  @include sort-handle;
}

.sortable-chosen {
  @include sort-chosen;

}
</style>
