<template>
  <BaseApp>
    <div class="my-gear">
      <draggable v-model="items" class="my-gear_items" group="my-items" item-key="id"
                 handle=".item__handle" emptyInsertThreshold="30" animation="700">
        <template #item="{element}">
          <div class="my-item">
            {{element}}
          </div>

        </template>
      </draggable>
    </div>
  </BaseApp>
</template>

<script>
import BaseApp from "@/components/inside/BaseApp";
import draggable from 'vuedraggable'
import {apiFetch} from "@/store/functions";

export default {
  name: "MyGearEditor",
  components: {BaseApp, draggable},
  data() {
    return {}
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
    updatePrivateGear(data) {
      apiFetch('private_gear', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
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

<style scoped>

</style>
