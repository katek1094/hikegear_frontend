import { createApp } from 'vue'

import router from "./router";
import store from './store/index.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronUp, faChevronDown, faTrash, faChild, faSyncAlt, faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faChevronUp)
library.add(faChevronDown)
library.add(faTrash)
library.add(faChild)
library.add(faSyncAlt)
library.add(faPlus)

import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(store)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')