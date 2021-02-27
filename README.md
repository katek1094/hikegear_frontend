# hikegear.pl frontend

### web app for hikers and tourists which helps to manage their gear and optimize backpack weight

#### <ins>you can see it</ins> on <https://hikegear.pl/> using prepared account for guests or register new account

#### frontend is written in Vue 3 as a Single Page Application, for backend repository [click here](https://github.com/katek1094/hikegear_backend)

frontend app currently has following features:
- mobile friendly and responsive SCSS styles
- account registration form
- login form
- password reset form
- backpacks editor (main feature) :
    - creating and deleting backpacks (gear lists)
    - changing name and description of backpacks
    - adding, deleting and editing items
    - grouping items into categories, and sorting both categories and items with drag&drop option 
      (implemented with [vue.draggable.next](https://github.com/SortableJS/vue.draggable.next))
    - adding items from my_gear list, which is available from all backpacks
    - summary weight table and pie chart with weights of all categories
- my_gear editor, which is simpler version of backpacks editor, only for gear which later can be used across components
- backpack share view, for sharing backpacks

#### tech stack: Vue 3, Vuex, Vue Router, vue.draggable.next (SortableJS for Vue), chart.js
#### app uses django sessions cookies and CSRF-Token cookie for csrf protection
#### app is deployed using DigitalOcean App Platform
