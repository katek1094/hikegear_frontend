<template>
  <Modal ref="modal">
    <template v-slot:header>
      <h2 class="header">jak korzystać z aplikacji?</h2>
    </template>
    <template v-slot:body>
      <h3>Kategorie</h3>
      <span>nie ma zalecanego użycia podziału na kategorię, możesz dzielić sprzęt ze względuna funkcje (do spania,
        ubrania, do gotowania), miejsce w plecaku lub podział na worki/drybagi</span>
      <h3>Przedmioty</h3>
      <span>założenia odnośnie poszczegołnych pól są następujące:</span>
      <span>nazwa - nazwa/rodzaj przedmiotu (śpiwór, skarpety, czapka) + ewentualnie cecha/podrodzaj przedmiotów
        (śpiwór puchowy, skarpety wysokie merino, czapka z daszkiem)</span>
      <span>opis - producent i model przedmiotu (Cumulus Lite Line 200, Forclaz 60),jakiekolwiek inne opisanie
        przedmiotu (kolor, materiał, pojemność) lub lista przedmiotów wewnątrz jeśli przedmiotem jest na przykład
        apteczka i chcemy wypisać jej zawartość (w polu opisu można używać klawisza Enter do tworzenia nowej linii)</span>
      <span><font-awesome-icon class="fa-md" icon="child"/>przedmiot noszony na sobie -
      rzeczy noszone cały czas na sobie w trakcie wędrówki przy nakorzystniejszej pogodzie, czyli
       bielizna, buty, kije trekkingowe, nakrycie głowy, spodnie, koszulka itp.
      tylko jedna sztuka jest liczona na jako noszona na sobie</span>
      <span><font-awesome-icon class="fa-md" icon="sync-alt"/>przedmiot konsumpcyjny - rzeczy, których waga jest
        zmienna w trakcie wyprawy, uzupełniane lub nie, takie jak gaz do kuchenki, jedzenie, papier toaletowy,
        mydło itp.</span>
      <span>waga - podawana w gramach</span>
      <h3>edytor</h3>
      <span>zmiany zapisywane są automatycznie po {{timeout}} sekundach od wprowadzenia ostaniej zmiany lub po
        wciśnięciu klawiszy Ctrl + S</span>
      <span>udostępnianie plecaka - aby udostępnić plecak innym skopiuj link ze strony swojego plecaka, w który możesz
        wejść klikając "link do plecaka"</span>
      <span>importowanie plecaka z lighterpack.com - możesz zrobić to klikając "importuj" i wpisując tam link do
        swojego plecaka na lighterpack.com</span>
      <h3>mój sprzęt</h3>
      <span>osobna lista twojego sprzętu, którego chcesz używać przy planowaniu wypraw</span>
      <span>aby dodać przedmioty do edytowanego plecaka przeciągaj je z okna "mój sprzęt" po prawej stronie</span>
      <span>aby edytować listę swojego sprzętu wejdź w zakładkę "mój sprzęt" gdzie możesz edytować listę analogicznie
      do głównego edytora plecaków</span>
      <span>jeżeli chcesz dodać do swojego sprzętu rzeczy, które są już na którejś liście, użyj opcji "dodaj sprzęt z
      plecaka" gdzie możesz wszystkie lub wybrane przedmioty z każdego twojego plecaka</span>



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

<style scoped>

</style>
