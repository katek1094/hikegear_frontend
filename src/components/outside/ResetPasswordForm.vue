<template>
  <OutsideBaseApp>
    <div class="hg-flx_col_ctr">
      <h1>password reset form</h1>
      <p>{{ uidb64 }}</p>
      <p>{{ token }}</p>
      <input class="hg-input" v-model="password">
      <button type="button" class="hg-button" @click="submit">zatwierdź</button>
    </div>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";

export default {
  name: "ResetPasswordForm",
  components: {OutsideBaseApp},
  props: ['uidb64', 'token'],
  data() {
    return {
      password: ''
    }
  },
  methods: {
    submit() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
