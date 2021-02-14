<template>
  <BaseApp>
    <div class="settings">
      <button class="logout" @click="logout">wyloguj</button>
      <ChangePassword/>
    </div>
  </BaseApp>
</template>

<script>
import BaseApp from "@/components/inside/BaseApp";
import ChangePassword from "@/components/inside/ChangePassword";

export default {
  name: "Settings",
  components: {ChangePassword, BaseApp},
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
          .then(() => this.$router.push('/'))
    }
  }
}
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  align-items: center;
}


button {
  outline: none;
  border-radius: 5px;
  font-size: 1.2rem;
  border: 1px solid grey;
  padding: 8px 12px;
  margin: 4px;
  background-color: white;
  transition: all .25s;
}

button:hover {
  cursor: pointer;
  transform: translate(0, -1px);
  box-shadow: grey 0 1px;
}

button:active {
  transition: all .1s;
  transform: none;
  box-shadow: none;
}


</style>