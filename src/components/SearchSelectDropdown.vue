<template>
  <div class="wrapper">
    <input class="search" type="text" v-model="query" :placeholder="placeholder" @click="activate"
           @blur="deactivate" @input="search">
    <div v-if="activated" class="hints">
      <span class="hint" v-for="res in results" :key="res.id" @mousedown="select($event, res)">{{ res.name }}</span>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'

export default {
  name: "SearchSelectDropdown",
  props: {values: Array, placeholder: String},
  emits: {selected: ({id}) => (typeof id === 'number')},
  setup(props, context) {
    const query = ref('')
    const activated = ref(false)
    const results = ref([])

    const activate = () => {
      activated.value = true
      search()
    }
    const deactivate = () => activated.value = false

    const search = () => {
      let res = []
      for (let i = 0; i < props.values.length; i++) {
        const s = props.values[i].name.toLowerCase().search(query.value.toLowerCase())
        if (s >= 0) {
          res.push(props.values[i])
          res[res.length - 1].sindex = s
        }
      }
      res.sort((a, b) => {
        return a.sindex - b.sindex
      })
      results.value = res
    }

    const select = (e, x) => {
      if (e.button === 0) {
        query.value = x.name
        search()
        context.emit('selected', {id: x.id})
      }
    }

    const reset = () => {
      query.value = ''
      activated.value = false
    }

    const setValue = (new_val) => query.value = new_val

    return {query, activated, results, activate, deactivate, search, select, reset, setValue}
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  border-radius: 4px;
  overflow: hidden;
  margin: 4px;
  display: inline-block;
}

.search {
  width: 100%;
  border: none;
  outline: none;
  box-shadow: none;
}

.search, .hint {
  padding: 5px;
  box-sizing: border-box;
}

.hints {
  position: absolute;
  max-height: 16rem;
  width: 14rem;
  overflow-y: auto;
  box-sizing: content-box;
  z-index: 10;
}

.hint {
  display: block;
  background-color: white;

  &:hover {
    background-color: cornflowerblue;
    color: white;
    cursor: pointer;
  }
}

</style>