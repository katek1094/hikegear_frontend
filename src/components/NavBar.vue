<template>
  <nav class="navbar" :class="{'navbar--active': active}">
    <a class="brand">HikeGear</a>
    <button class="hamburger" :class="{'hamburger--active': active}" @click="handleClick">
                <span class="hamburger__box">
                    <span class="hamburger__inner"></span>
                </span>
    </button>
    <div class="menu">
      <a>Strona Główna</a>
      <a>Edytor</a>
      <a>Page 2</a>
      <a>Page 3</a>
      <a>Konto</a>
    </div>
    <div class="dropdown-menu">
      <a>Strona Główna</a>
      <a>Edytor</a>
      <a>Page 2</a>
      <a>Page 3</a>
      <a>Konto</a>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      active: false
    }
  },
  computed: {
    mediaQuery() {
      return window.outerWidth < 800
    },
    activeClass() {
      return this.mediaQuery && this.active
    }

  },
  methods: {
    handleClick() {
      this.active = !this.active
    },
  }
}
</script>

<style scoped>
.navbar {
  --nav_height: 70px;
}

nav {
  background-color: white;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, .1);
  height: var(--nav_height);
  line-height: var(--nav_height);
  padding: 0 10px;
  text-align: right;
  overflow: hidden;
  transition: height .3s;
}

.brand {
  font-size: 2rem;
  float: left;
  font-family: "Times", sans-serif;
  font-weight: 600;
  font-style: italic;
  color: grey;
}

nav a {
  font-size: 1.3rem;
  line-height: var(--nav_height);
  padding: 0 14px;
  display: inline-block;
  white-space: nowrap;
}

.menu a:hover, .dropdown-menu a:hover {
  background-color: #eae9e9;
}

.menu {

}

.dropdown-menu {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.9s linear;
  text-align: center;
}

.dropdown-menu a {
  display: block;
}

.navbar--active .dropdown-menu {
  visibility: visible;
  opacity: 1;
  transition: opacity .5s ease-in;
}

.navbar--active {
  height: calc(var(--nav_height) * 6);
  line-height: initial;
}


/*HAMBURGER STYLES*/
.hamburger {
  padding: 17px;
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
  width: 35px;
  height: 33px;
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