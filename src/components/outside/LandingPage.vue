<template>
  <OutsideBaseApp>
    <div class="hg-flx_col_ctr">
      <h1 class="header">{{ text }}</h1>
      <div class="slider">
        <img class="hidden_image" src="@/assets/hg1.png" alt="coś się popsuło">
        <img class="image active" src="@/assets/hg1.png" alt="coś się popsuło">
        <img class="image next" src="@/assets/hg3.png" alt="coś się popsuło">
        <img class="image" src="@/assets/hg2.png" alt="coś się popsuło">
      </div>
      <div class="buttons_wrapper">
        <button class="button" @click="loginRedirect">zaloguj się</button>
        <button class="button" @click="registerRedirect">zarejestruj się</button>
      </div>
    </div>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";

export default {
  name: "LandingPage",
  components: {OutsideBaseApp},
  data() {
    return {
      images_refs: [],
      active_number: 0,
      interval_id: undefined,
      timeout_id: undefined,
      texts: [
        'Twórz listy sprzętu',
        'Dziel się nimi',
        'Zorganizuj swój sprzęt',
        // 'Zorganizuj swój sprzęt',
        // 'Zorganizuj swój sprzęt',
      ],
      chosen_text: 0
    }
  },
  computed: {
    text() {
      return this.texts[this.chosen_text]
    }
  },
  methods: {
    loginRedirect() {
      this.$router.push({name: 'login'})
    },
    registerRedirect() {
      this.$router.push({name: 'register'})
    },
    switchSlider() {
      const last_number = this.images_refs.length - 1

      this.images_refs[this.active_number].classList.remove('active')
      this.images_refs[this.active_number].classList.add('previous')
      let old_next_number
      if (this.active_number < last_number) old_next_number = this.active_number + 1
      else old_next_number = 0
      this.images_refs[old_next_number].classList.remove('next')
      this.images_refs[old_next_number].classList.add('active')
      let previous_number
      if (this.active_number > 0) previous_number = this.active_number - 1
      else previous_number = last_number
      this.images_refs[previous_number].classList.remove('previous')
      if (this.active_number < last_number) this.active_number++
      else this.active_number = 0
      this.timeout_id = setTimeout(() => {
        if (this.active_number !== last_number) this.images_refs[this.active_number + 1].classList.add('next')
        else this.images_refs[0].classList.add('next')
      }, 2000)

      if (this.chosen_text < last_number) this.chosen_text++
      else this.chosen_text = 0
    }
  },
  mounted() {
    this.images_refs = document.getElementsByClassName('image')
    this.interval_id = setInterval(this.switchSlider, 3000)
  },
  beforeUnmount() {
    clearInterval(this.interval_id)
    clearTimeout(this.timeout_id)
  }
}
</script>

<style lang="scss" scoped>
.hg-flx_col_ctr {
  padding: 0 10px 10px;
}

.buttons_wrapper {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  max-width: 700px;
  margin-top: 20px;
}

.button {
  @include form-submit;
  font-weight: bold;
}

@import url('https://fonts.googleapis.com/css?family=Bungee');

.header {
  font-family: "Bungee", Arial, sans-serif;
  font-weight: 400;
  text-align: center;
  font-size: 1.4rem;
}

.hidden_image {
  visibility: hidden;
  width: 100%;
  object-fit: scale-down;
}

.slider {
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  position: relative;
  height: 39vw; // its for bugs on mobile browsers
  width: 85vw;
  max-width: 1200px;
  max-height: calc(100vh - 240px);
}

.image {
  height: 100%;
  width: 100%;
  object-fit: scale-down;
  display: none;
  transition: left 1s ease-in-out;
  top: 0;
}

.active {
  display: inline;
  position: absolute;
  left: 0;
  z-index: 3;
}

.next {
  z-index: 2;
  display: inline;
  position: absolute;
  left: 100%;
}

.previous {
  z-index: 0;
  display: inline;
  position: absolute;
  left: -100%;
}

@media (min-width: 480px) {
  /* smartphones, Android phones, landscape iPhone */
  .header {
    font-size: 1.6rem;
  }
}

@media (min-width: 600px) {
  /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */
  .header {
    font-size: 1.7rem;
  }
}

@media (min-width: 801px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */
  .header {
    font-size: 1.8rem;
  }
}

@media (min-width: 1025px) {
  /* big landscape tablets, laptops, and desktops */
  .header {
    font-size: 1.9rem;
  }
  .button {
    font-size: 1.4rem;
  }
}

@media (min-width: 1281px) {
  /* hi-res laptops and desktops */
  .header {
    font-size: 2rem;
    margin-top: 2px;
  }
}
</style>
