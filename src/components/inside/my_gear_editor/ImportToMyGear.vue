<template>
  <modal ref="modal" @close-modal="reset" :hide_on_outside_click="false">
    <template v-slot:header>
      <h2 class="header">dodaj sprzęt</h2>
    </template>
    <template v-slot:body>
      <div class="outer_div">
        <div class="inner_div">
          <label for="plecak">wybierz plecak, z którego chcesz importować sprzęt: </label>
          <select id="plecak" v-model="selected_backpack_id">
            <option disabled hidden selected value=""></option>
            <option v-for="backpack in backpacks" :key="backpack.id" :value="backpack.id">{{ backpack.name }}</option>
          </select>
          <div v-if="selected_backpack_id !== ''" class="items_picker" ref="checks">
            <button class="select_button" type="button" @click="checkEverything">zaznacz wszystko</button>
            <button class="select_button" type="button" @click="uncheckEverything">odznacz wszystko</button>
            <div v-for="category in backpack_list" :key="category.id" class="category_div">
              <input :id="'category' + category.id" v-model="selected_categories" :value="category.id" type="checkbox"
                     @click="handleCategoryClick(category.id)">
              <label :for="'category' + category.id">{{ category.name }}</label>
              <div v-for="item in category.items" :key="item.id" class="item_div">
                <input :id="'item' + item.id" v-model="selected_items" :value="item.id" type="checkbox"
                       @click="handleItemClick(category.id, item.id)">
                <label :for="'item' + item.id" class="item_label">
                  <span>{{ item.name }}</span><span>{{ item.description }}</span><span>{{ item.weight }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

  </modal>
</template>

<script>
import Modal from "@/components/Modal";

export default {
  name: "ImportToMyGear",
  components: {Modal},
  data() {
    return {
      selected_backpack_id: '',
      selected_categories: [],
      selected_items: [],
    }
  },
  computed: {
    backpacks() {
      return this.$store.getters['editor/backpacks']
    },
    backpack_list() {
      return this.backpacks.find(backpack => backpack.id === this.selected_backpack_id).list
    },
  },
  methods: {
    openModal() {
      this.$refs.modal.openModal()
    },
    reset() {
      this.selected_backpack_id = ''
      this.selected_categories = []
      this.selected_items = []
    },
    handleCategoryClick(category_id) {
      // if (this.selected_items === []) this.$forceUpdate()
      if (this.selected_items === []) console.log('xd')
      // this.$forceUpdate()
      console.log(this.selected_items)
      const items = this.backpack_list.find(category => category.id === category_id).items
      if (this.selected_categories.includes(category_id)) {
        for (const item of items) {
          const index = this.selected_items.findIndex(id => id === item.id)
          if (index !== -1) this.selected_items.splice(index, 1)
        }
        this.selected_categories.splice(this.selected_categories.findIndex(id => id === category_id), 1)
      } else {
        this.selected_categories.push(category_id)
        for (const item of items) {
          const index = this.selected_items.findIndex(id => id === item.id)
          if (index === -1) this.selected_items.push(item.id)
        }
      }
    },
    handleItemClick(category_id, item_id) {
      if (this.selected_items.includes(item_id) && this.selected_categories.includes(category_id)) {
        this.selected_categories.splice(this.selected_categories.findIndex(id => id === category_id), 1)
        this.selected_items.splice(this.selected_items.findIndex(id => id === item_id), 1)
      }
    },
    checkEverything() {
      for (const category of this.backpack_list) {
        if (!this.selected_categories.includes(category.id)) this.selected_categories.push(category.id)
        for (const item of category.items) {
          if (!this.selected_items.includes(item.id)) this.selected_items.push(item.id)
        }
      }
    },
    uncheckEverything() {
      this.selected_categories = []
      this.selected_items = []
    },
  }
}
</script>

<style scoped lang="scss">
.items_picker {
  font-size: .9rem;
}

.category_div {
  //margin-left: 10px;
}

.item_div {
  margin-left: 30px;
  display: flex;
}

.item_label {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 4rem;
  column-gap: 8px;
}
</style>
