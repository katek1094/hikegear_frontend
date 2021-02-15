<template>
  <nav class="navbar" :class="{'navbar--active': active}">
    <router-link to="/editor"><img class="brand" alt="logo" src="@/assets/logo.png"></router-link>
    <button class="hamburger" :class="{'hamburger--active': active}" @click="handleClick">
                <span class="hamburger__box">
                    <span class="hamburger__inner"></span>
                </span>
    </button>
    <div class="menu">
      <router-link v-for="(item, index) in items" :key="index" :to="item.route" class="link">{{ item.name }}
      </router-link>
    </div>
    <div class="dropdown-menu">
      <router-link v-for="(item, index) in items" :key="index" :to="item.route" class="link">{{ item.name }}
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      active: false,
      items: [
        {name: 'edytor', route: '/editor'},
        {name: 'ustawienia', route: '/settings'},
      ]
    }
  },
  methods: {
    handleClick() {
      this.active = !this.active
    },
    onWindowResize() {
      if (window.innerWidth > 800) {
        this.active = false
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.onWindowResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  },
}
</script>

<style lang="scss" scoped>
$hamburger_height: 33px;
$hamburger_width: 36px;
$hamburger-padding: 7px 16px;

nav {
  background-color: $nav_color;
  height: $nav_height;
  line-height: $nav_height;
  padding: 0;
  text-align: right;
  overflow: hidden;
  transition: height .3s;
}

.brand {
  float: left;
  cursor: pointer;
}

.link {
  font-size: 1.3rem;
  line-height: $nav_height;
  padding: 0 14px;
  display: inline-block;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  color: black;
  margin: 0 1px;
}

.menu .link:hover, .dropdown-menu .link:hover, .brand:hover {
  background-color: $nav_hover_color;
  border-radius: 2px;
}

.router-link-active {
  background-color: $background;
}

.menu {

}

.dropdown-menu {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.9s linear;
  text-align: center;
}

.dropdown-menu .link {
  display: block;
}

.navbar--active .dropdown-menu {
  visibility: visible;
  opacity: 1;
  transition: opacity .5s ease-in;
}

.navbar--active {
  height: $nav_height * 3;
  line-height: initial;
}


/*HAMBURGER STYLES*/
.hamburger {
  padding: $hamburger-padding;
  display: none;
  cursor: pointer;
  background-color: transparent;
  margin: 0;
  outline: none;
  border: none;
}

.hamburger:focus {
  outline: none;
}

.hamburger {
  transition: transform .3s .1s ease-in-out;
}

.hamburger__box {
  width: $hamburger_width;
  height: $hamburger_height;
  display: inline-block;
  position: relative;
}

.hamburger__inner {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  transition: background-color .1s .2s ease-in-out;
}

.hamburger__inner::before,
.hamburger__inner::after,
.hamburger__inner {
  width: 100%;
  height: 3px;
  background-color: black;
  position: absolute;
}

.hamburger__inner::before,
.hamburger__inner::after {
  content: '';
  left: 0;
  transition: transform .2s .2s ease-in-out;
}

.hamburger__inner::before {
  top: -10px;
}

.hamburger__inner::after {
  top: 10px;
}

.hamburger--active .hamburger__inner {
  background-color: transparent;
}

.hamburger--active .hamburger__inner:before {
  transform: translateY(10px) rotate(45deg);
}

.hamburger--active .hamburger__inner:after {
  transform: translateY(-10px) rotate(-45deg);
}


@media (max-width: 800px) {
  .hamburger {
    display: inline-block;
  }

  .menu {
    display: none;
  }
}

</style>
