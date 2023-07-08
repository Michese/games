<template>
  <section class="settings">
    <custom-input type="number" label="Количество пар" :value="quantity" @input="inputQuantity(($event.target as any).value!)" class="settings__input" title="Не больше 25" />
    <custom-input type="number" label="Количество перестановок" :value="countShuffle" @input="inputCountShuffle(($event.target as any).value!)" class="settings__input" title="Не больше 3" />
    <custom-btn value="Начать" class="settings__btn" @click="saveSettings" />
  </section>
</template>

<script lang="ts" setup>
import { SettingsFindACouple } from '@/types';
import CustomBtn from '@/ui/CustomBtn.vue';
import CustomInput from '@/ui/CustomInput.vue';
import { defineEmits, ref } from 'vue';

const emit = defineEmits<{
  (e: 'save-settings', item: SettingsFindACouple): void;
}>();
const quantity = ref<number>(2);
const countShuffle = ref<number>(0);

function inputQuantity(newQuantity: string) {
  const numQuantity = +newQuantity;
  if (!Number.isNaN(numQuantity) && numQuantity > 0 && numQuantity <= 25) {
    quantity.value = numQuantity;
  }
}

function inputCountShuffle(newCountShuffle: string) {
  const numCountShuffle = +newCountShuffle;
  if (!Number.isNaN(numCountShuffle) && numCountShuffle >= 0 && numCountShuffle <= 3) {
    countShuffle.value = numCountShuffle;
  }
}

function saveSettings() {
  emit('save-settings', { quantity: quantity.value, countShuffle: countShuffle.value });
}
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;

  &__btn {
    align-self: flex-end;
  }
}
</style>
