<template>
  <OutsideBaseApp>
    <div class="hg-flx_col_ctr hg-text-wrapper">
      <div>
        <h1>Twoje konto zostało utworzone!</h1>
        <p>Aby móc z niego korzystać musisz kliknąć w link aktywacyjny wysłany na adres mailowy podany przy rejestracji. </p>
        <p>Jeżeli nie widzisz wiadomości w skrzynce odbiorczej, należy sprawdzić foldery "Spam", "Oferty" itp. </p>
        <p>Uwaga! Konto należy aktywować w ciągu 15 minut.</p>
        <p>Jeżeli nie aktywowałeś konta w ciągu 15 minut, nadal musisz kliknąć w link aktywacyjny, który usunie założone
          konto i umożliwi rozpoczęcie procesu rejestracji od nowa. </p>
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
