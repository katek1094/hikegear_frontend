import {createApp} from 'vue'

import router from "./router";
import store from './store/index.js'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faTrash, faChild, faSyncAlt, faPlus, faGripLines, faCopy} from '@fortawesome/free-solid-svg-icons'

library.add(faTrash)
library.add(faChild)
library.add(faSyncAlt)
library.add(faPlus)
library.add(faGripLines)
library.add(faCopy)

import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(store)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
