<template>
  <svg-sprite />
  <congratulation-window>
    <audio-wrapper>
      <main-page>
        <main-menu v-if="!page" :item="page" @click="clickMenuItem" />
        <component v-else :is="pageComponent" />
      </main-page>
    </audio-wrapper>
  </congratulation-window>
</template>

<script lang="ts" setup>
import AudioWrapper from '@/components/Audio/AudioWrapper.vue';
import MainPage from '@/components/MainPage.vue';
import { BACK_TO_MENU, MENU_PAGE_FIND_A_COUPLE, PAGE_STORAGE_NAME } from '@/const';
import { MenuItem } from '@/types';
import FindACouple from '@/view/FindACouple/FindACouple.vue';
import MainMenu from '@/view/MainMenu.vue';
import { computed, provide, ref } from 'vue';
import CongratulationWindow from './components/CongratulationWindow.vue';
import SvgSprite from './ui/SvgSprite.vue';

const page = ref<MenuItem | null>(null);
const pageComponent = computed<unknown | null>(() => (page.value === MENU_PAGE_FIND_A_COUPLE ? FindACouple : null));

function clickMenuItem(item: MenuItem | null) {
  page.value = item;
  sessionStorage.setItem(PAGE_STORAGE_NAME, item ?? '');
}

provide(BACK_TO_MENU, () => {
  clickMenuItem(null);
});

(() => {
  const sessionPage = sessionStorage.getItem(PAGE_STORAGE_NAME) as MenuItem;
  if (sessionPage) page.value = sessionPage;
})();
</script>

<style lang="scss" scoped></style>
