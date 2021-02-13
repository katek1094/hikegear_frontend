<template>
  <LandingPage>
    <div class="wrapper">
      <div>
        <h1>Twoje konto zostało utworzone!</h1>
        <h3>Aby móc z niego korzystać musisz zweryfikować swój adres email klikając w link aktywacyjny wysłany na adres
          mailowy podany przy rejestracji. </h3>
        <h3>Jeżeli nie widzisz wiadomości w skrzynce odbiorczej, należy sprawdzić foldery "Spam", "Oferty" itp. </h3>
        <h3>Uwaga! Nieaktywowane konto w ciągu 15 minut zostanie usunięte, a link aktywacyjny straci ważność, należy wtedy
          ponownie się zarejestrować i aktywować konto. </h3>
        <h4></h4>
      </div>
    </div>
  </LandingPage>
</template>

<script>
import LandingPage from "@/components/LandingPage";

export default {
  name: "VerifyYourEmail",
  components: {LandingPage}
}
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  padding: 0 10px;
}
</style>