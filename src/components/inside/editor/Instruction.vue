<template>
  <Modal ref="modal">
    <template v-slot:header>jak korzystać z aplikacji?</template>
    <template v-slot:body>
      <h3 class="header__first">Kategorie</h3>
      <span>Nie ma zalecanego użycia podziału na kategorię, możesz dzielić sprzęt ze względu na funkcje (do spania,
        biwakowania, gotowania, ubrania), miejsce w plecaku, podział na worki/drybagi...</span>

      <h3 class="header">Przedmioty</h3>
      <span>Założenia odnośnie poszczegołnych pól są następujące:</span><br><br>
      <span><strong>nazwa</strong> - nazwa/rodzaj przedmiotu (np. śpiwór, skarpety, czapka) + ewentualnie cecha/podrodzaj przedmiotów
        (np. śpiwór puchowy, skarpety wysokie merino, czapka z daszkiem)</span><br><br>
      <span><strong>opis</strong> - producent i model przedmiotu (np. Cumulus Lite Line 200, Forclaz 60) lub jakiekolwiek inne opisanie
        przedmiotu (np. kolor, materiał, pojemność) lub lista przedmiotów wewnątrz jeśli przedmiotem jest na przykład
        apteczka i chcemy wypisać jej zawartość (w polu opisu można używać klawisza Enter do tworzenia nowej linii).
        W przypadku zważenia przedmiotu warto dodać czy jest to waga z pokrowcem czy bez itp.
      </span><br><br>
      <span><font-awesome-icon class="fa-md" icon="child"/> - <strong>przedmiot noszony na sobie</strong> -
      rzeczy noszone cały czas na sobie w trakcie wędrówki przy najkorzystniejszej pogodzie, czyli
       bielizna, buty, kije trekkingowe, nakrycie głowy, spodnie, koszulka itp. Tylko jedna sztuka jest liczona jako noszona na sobie</span><br><br>
      <span><font-awesome-icon class="fa-md" icon="sync-alt"/> - <strong>przedmiot konsumpcyjny</strong> - rzeczy, których waga jest
        zmienna w trakcie wyprawy, uzupełniane lub nie, takie jak gaz do kuchenki, jedzenie, mydło itp.</span><br><br>
      <span><strong>waga</strong> - podawana w gramach</span>

      <h3 class="header">Edytor</h3>
      <span>Zmiany zapisywane są automatycznie po {{ timeout }} sekundach od wprowadzenia ostaniej zmiany lub po
        wciśnięciu klawiszy Ctrl + S</span><br><br>
      <span>Importowanie listy sprzętu z lighterpack.com - możesz zrobić to klikając "importuj" i wpisując tam link do
        swojej listy z lighterpack.com</span>

      <h3>Udostępnianie</h3>
      <span>Aby udostępnić listę sprzętu musisz ustawić kliknąć przycisk "udostępnij" w lewym górnym rogu edytora. </span>
      <span>Wtedy obok przycisku pojawi się link do twojej listy sprzętu, pod którym będzie ona dostępna dla każdego. </span>

      <h3 class="header">Mój sprzęt</h3>
      <span>Osobna lista twojego sprzętu, którego możesz używać przy planowaniu wypraw. </span><br><br>
      <span>Aby dodać przedmioty do edytowanej listy sprzętu przeciągaj je z okna "mój sprzęt" po prawej stronie (na małych urządzeniach jest ono niewidoczne). </span><br><br>
      <span>Aby edytować listę swojego sprzętu wejdź w zakładkę "mój sprzęt" w głównym menu gdzie możesz edytować
        listę w sposób analogiczny do głównego edytora. </span><br><br>
      <span>Jeżeli chcesz dodać do swojego sprzętu rzeczy, które są już na którejś z list, użyj opcji "dodaj sprzęt z
      listy" gdzie możesz dodać wszystkie lub wybrane przedmioty z każdej twojej listy sprzętu. </span>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal";
import Constants from '@/constants'

export default {
  name: "Instruction",
  components: {Modal},
  computed: {
    timeout: () => Constants.EDITOR_SAVE_TIMEOUT / 1000
  },
  methods: {
    openModal() {
      this.$refs.modal.openModal()
    },
  }
}
</script>

<style lang="scss" scoped>
.header__first {
  margin-top: 0;
}
</style>
