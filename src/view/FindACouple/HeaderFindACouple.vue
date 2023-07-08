<template>
  <header-page class="header-page__wrapper">
    <section class="header-page">
      <custom-btn value="назад" class="header-page__btn" @click="backToMenu" />

      <section class="header-page__record">
        <template v-if="record">
          <span>Количество пар: {{ record.quantity }}</span>
          <span>Количество перестановок: {{ record.countShuffle }}</span>
          <span>Время: <custom-time :seconds="record.time" /></span>
        </template>
      </section>

      <custom-btn value="Новая игра" class="header-page__btn" @click="emit('clear-settings')" />
    </section>
  </header-page>
</template>

<script lang="ts" setup>
import HeaderPage from '@/components/HeaderPage.vue';
import { BACK_TO_MENU } from '@/const';
import { SettingsFindACouple } from '@/types';
import CustomBtn from '@/ui/CustomBtn.vue';
import CustomTime from '@/ui/CustomTime.vue';
import { defineEmits, inject } from 'vue';

const emit = defineEmits<{
  (e: 'clear-settings'): void;
}>();

const props = defineProps<{
  record: (SettingsFindACouple & { time: number }) | null;
}>();

const backToMenu = inject(BACK_TO_MENU) as () => void;
</script>

<style lang="scss" scoped>
.header-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  &__record {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.7em;
    gap: 0px;
  }

  &__wrapper {
    margin-bottom: 15px;
  }
}
</style>
