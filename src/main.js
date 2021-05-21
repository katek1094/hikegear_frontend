import {createApp} from 'vue'
import router from "./router";
import store from './store/index.js'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {
    faTrash,
    faChild,
    faSyncAlt,
    faPlus,
    faGripLines,
    faCopy,
    faCloudDownloadAlt,
    faTimes,
    faShare,
    faCheckCircle,
    faArrowAltCircleDown,
    faQuestion,
    faWindowMinimize,
    faWindowMaximize,
    faFileExcel,
    faShareAlt
} from '@fortawesome/free-solid-svg-icons'
// TODO: add better icon for handles

library.add(faTrash)
library.add(faChild)
library.add(faSyncAlt)
library.add(faPlus)
library.add(faGripLines)
library.add(faCopy)
library.add(faCloudDownloadAlt)
library.add(faTimes)
library.add(faShare)
library.add(faCheckCircle)
library.add(faArrowAltCircleDown)
library.add(faQuestion)
library.add(faWindowMinimize)
library.add(faWindowMaximize)
library.add(faFileExcel)
library.add(faShareAlt)

import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(store)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
