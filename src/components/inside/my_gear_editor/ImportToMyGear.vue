<template>
  <modal ref="modal" @close-modal="reset" :hide_on_outside_click="false">
    <template v-slot:header>dodaj przedmioty do mojego sprzętu</template>
    <template v-slot:body>
      <div class="outer_div">
        <div class="inner_div">
          <label for="select_backpack">wybierz listę, z której chcesz dodać sprzęt: </label>
          <select id="select_backpack" v-model="selected_backpack_id" class="hg-select">
            <option disabled hidden selected value=""></option>
            <option v-for="backpack in backpacks" :key="backpack.id" :value="backpack.id">{{ backpack.name }}</option>
          </select>
          <div v-if="selected_backpack_id !== ''" class="items_picker" ref="checks">
            <p class="info">zaznacz przedmioty i kategorie, które chcesz dodać</p>
            <div class="options">
              <button class="hg-button" type="button" @click="checkEverything">zaznacz wszystko</button>
              <button class="hg-button" type="button" @click="uncheckEverything">odznacz wszystko</button>
            </div>
            <div v-for="category in filtered_categories" :key="category.id" class="category">
              <div class="category_header">
                <input :id="'category' + category.id" v-model="selected_categories" :value="category.id"
                       class="category_header__checkbox" type="checkbox" @click="handleCategoryClick(category.id)">
                <span :for="'category' + category.id" class="category_header__name">{{ category.name }}</span>
              </div>

              <div class="items">
                <div v-for="item in category.items" :key="item.id" class="item">
                  <input :id="'item' + item.id" v-model="selected_items" :value="item.id" class="item__checkbox"
                         type="checkbox" @click="handleItemClick(category.id, item.id)">
                  <div class="item__data">
                    <span class="item__property">{{ item.name }}</span>
                    <span class="item__property">{{ item.description }}</span>
                    <span class="item__property">{{ item.weight }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="footer" v-if="selected_items.length !== 0">
        <p class="info">{{ summary_text }}</p>
        <button class="hg-button submit" @click="addToMyGear">dodaj</button>
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
    filtered_categories() {
      return this.backpack_list.filter(category => category.items.length !== 0)
    },
    summary_text() {
      let items, will, add
      const len = this.selected_items.length
      const str_len = len.toString()
      if (len === 1) {
        items = 'przedmiot'
        will = 'zostanie'
        add = 'dodany'
        // } else if (len > 1 && len < 5) {
      } else if ((len > 20 || len < 5) && (str_len.slice(-1) === '2' || str_len.slice(-1) === '3' || str_len.slice(-1) === '4')) {
        items = 'przedmioty'
        will = 'zostaną'
        add = 'dodane'
      } else if (len > 4) {
        items = 'przedmiotów'
        will = 'zostanie'
        add = 'dodanych'
      }
      return len + ' ' + items + " " + will + " " + add + " do twojego sprzętu"
    }
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
      if (this.selected_items.length === 0) this.$forceUpdate()
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
    new_category_id(categories_ids) {
      for (const integer of [...Array(1000).keys()]) {
        if (!categories_ids.includes(integer)) return integer
      }
    },
    new_item_id(items_ids) {
      for (const integer of [...Array(3000).keys()]) {
        if (!items_ids.includes(integer)) return integer
      }
    },
    addToMyGear() {
      // checked categories are added as separate categories
      // checked items in not checked categories are added all together in new category 'dodane z  $backpack_name'
      let new_my_categories = []
      let selected_items_ids = this.selected_items
      let category_ids = []
      let items_ids = []
      for (const cat of this.backpack_list) {
        category_ids.push(cat.id)
        for (const item of cat.items) items_ids.push(item.id)
      }
      for (const category_id of this.selected_categories) {
        const category_data = this.backpack_list.find(cat => cat.id === category_id)
        if (category_data.items.length !== 0) {
          let my_category = {
            id: this.new_category_id(category_ids),
            name: category_data.name,
            items: []
          }
          category_ids.push(my_category.id)
          for (const item of category_data.items) {
            my_category.items.push({
              id: this.new_item_id(items_ids),
              name: item.name,
              weight: item.weight,
              description: item.description
            })
            items_ids.push(my_category.items[my_category.items.length - 1].id)
            selected_items_ids.splice(selected_items_ids.findIndex(item_id => item.id === item_id), 1)
          }
          new_my_categories.push(my_category)
        }
      }
      if (selected_items_ids.length !== 0) {
        let new_category = {
          id: this.new_category_id(category_ids),
          name: 'dodane z ' + this.backpacks.find(backpack => backpack.id === this.selected_backpack_id).name,
          items: []
        }
        category_ids.push(new_category.id)
        let all_items_data = []
        for (const cat of this.backpack_list) {
          all_items_data = all_items_data.concat(cat.items)
        }
        for (const item_id of selected_items_ids) {
          const item_data = all_items_data.find(item => item.id === item_id)
          new_category.items.push({
            id: this.new_item_id(items_ids),
            name: item_data.name,
            weight: item_data.weight,
            description: item_data.description
          })
          items_ids.push(new_category.items[new_category.items.length - 1].id)
        }
        new_my_categories.push(new_category)
      }
      this.$store.dispatch('my_gear/changeMyGear', this.$store.getters['my_gear/dynamic_list'].concat(new_my_categories))
      this.$store.dispatch('my_gear/updateMyGear')
      this.$refs.modal.closeModal()
    }
  }
}
</script>

<style scoped lang="scss">
.info {
  font-size: 1rem;
}

.options {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  padding: 4px 8px;
  margin-bottom: 6px;
}

.hg-button {
  font-size: .9rem;
  padding: 8px 10px; // add as a hg-button-sm?
}

.items_picker {
  font-size: .9rem;
}

.category {
  //margin-left: 10px;
}

.category_header {
  display: flex;
  align-items: center;
  font-size: 1rem;

  &__name {
    margin-left: 4px;
  }
}

.items {

}

.category_header__checkbox, .item__checkbox {
  min-height: 18px;
  min-width: 18px;
}

.item {
  margin-left: 20px;
  display: flex;
  align-items: center;
  padding: 5px 0;
  width: 100%;

  &__property {
    overflow-wrap: anywhere;
    word-break: break-all;
  }

  &:not(:last-child) {
    border-bottom: 1px dotted grey;
  }
}

.item__data {
  margin-left: 4px;
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 3fr 4rem;
  column-gap: 8px;
  align-items: center;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.hg-button.submit {
  font-size: 1rem;
  padding: 8px 12px;
}

</style>
