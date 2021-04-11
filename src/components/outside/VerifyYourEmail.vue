<template>
  <OutsideBaseApp>
    <div class="hg-flx_col_ctr hg-text-wrapper">
      <div>
        <h1>Twoje konto zostało utworzone!</h1>
        <p>Aby móc z niego korzystać musisz kliknąć w link aktywacyjny wysłany na adres mailowy podany przy
          rejestracji. </p>
        <p>Jeżeli nie widzisz wiadomości w skrzynce odbiorczej, należy sprawdzić foldery "Spam", "Oferty" itp. </p>
        <p>Na niektóre skrzynki mailowe wiadomość może przyjść nawet po 10-15 minutach. </p>
        <p>Uwaga! Konto należy aktywować w ciągu 30 minut od jego utworzenia.</p>
      </div>
    </div>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";

export default {
  name: "VerifyYourEmail",
  components: {OutsideBaseApp}
}
</script>

<style lang="scss" scoped>

</style>
