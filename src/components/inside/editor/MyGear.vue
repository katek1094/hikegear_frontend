<template>
  <div class="my-gear_frame">
    <div class="header">
      <h2>mój sprzęt</h2>
    </div>
    <draggable v-model="items" class="my-gear_items" :group="{name: 'items', pull: 'clone', put: true}"
               item-key="id" handle=".item__handle" emptyInsertThreshold="30" animation="700"
    :clone="deepCopy">
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
import {getCookie} from "@/store/functions";

export default {
  name: "MyGear",
  components: {draggable},
  data() {
    return {
      items_list: [
        {
          id: 1,
          name: 'XD',
          type: 'item',
          description: 'Quechua m100',
          weight: 11,
          quantity: 1,
          worn: false,
          consumable: false,
        },
        {
          id: 1,
          name: 'liner',
          type: 'item',
          description: 'jedwabny decathlon',
          weight: 69,
          quantity: 1,
          worn: false,
          consumable: false,
        },
      ]
    }
  },
  computed: {
    items: {
      get() {
        return this.$store.getters['my_gear/get_my_gear']
      },
      set(val) {
        this.$store.dispatch('my_gear/changeMyGear', val)
        this.updatePrivateGear(val)
      }
    }
  },
  methods: {
    deepCopy(original) {
      let deep_copy = JSON.parse(JSON.stringify(original))
      deep_copy.id = this.$store.getters['editor/new_element_id']
      return deep_copy
    },
    updatePrivateGear(data) {
      fetch(process.env.VUE_APP_API_URL + '/api/private_gear', {
        method: 'PATCH',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({'private_gear': data})
      })
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            this.$store.dispatch('my_gear/changeMyGear', data['private_gear'])
          })
        } else console.log(response)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-gear_frame {
  margin-left: 50px;
  background: $windows_color;
  width: 300px;
  height: 80vh;
  border-radius: 4px;
  position: -webkit-sticky;
  position: sticky;
  top: 10vh;
  padding: 8px;
  box-sizing: border-box;
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

.my-gear_items {
  @include editor-items;
  font-size: .8rem;
  background-color: $background;
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
