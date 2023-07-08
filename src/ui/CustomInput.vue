<template>
  <div class="custom-input">
    <input :type="props.type" v-model="value" :max="props.max" :min="props.min" :id="id" :class="inputClass" class="custom-input__input" @change="change" @input="input" />
    <label v-if="props.label" :for="id" class="custom-input__label">{{ props.label }}</label>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, withDefaults, computed, watch } from 'vue';
import { uuid } from 'vue-uuid';

const emit = defineEmits<{
  (e: 'input', event: Event): void;
  (e: 'change', event: Event): void;
}>();

const props = withDefaults(
  defineProps<{
    label?: string;
    type?: 'text' | 'number';
    max?: number;
    min?: number;
    value: string | number | null;
  }>(),
  {
    type: 'text',
  },
);

const id = ref<string>(uuid.v1());
const value = ref<string>('');

const hasValue = computed<boolean>(() => value.value !== '' && value.value !== null);
const inputClass = computed<unknown>(() => ({
  fill: hasValue.value,
}));

function change(event: Event) {
  emit('change', event);
  value.value = props.value?.toString() ?? '';
}

function input(event: Event) {
  emit('input', event);
}

(() => {
  value.value = props.value?.toString() ?? '';
})();
</script>

<style lang="scss" scoped>
.custom-input {
  display: flex;
  align-items: center;
  position: relative;
  height: 60px;
  background-color: #484848;
  border-radius: 10px;
  text-overflow: ellipsis;
  overflow-x: hidden;
  cursor: text;

  &__input {
    font-size: 0.9em;
    padding: 0 10px 0;
    background-color: transparent;
    border: none;
    outline: none;
    width: 100%;
    transition: padding 0.1s linear;
  }

  &__label {
    position: absolute;
    font-size: 1em;
    text-overflow: ellipsis;
    overflow-x: hidden;
    text-wrap: nowrap;
    max-width: 100%;
    padding: 10px;
    box-sizing: border-box;
    transition: padding 0.1s linear, opacity 0.3s linear;
    cursor: text;
  }

  &:hover {
    box-shadow: inset #ccc 0 0 15px;
  }

  &__input:focus,
  .fill {
    padding: 25px 10px 0;
  }

  &__input:focus + &__label,
  .fill + &__label {
    font-size: 0.6em;
    opacity: 0.9;
    padding: 0px 10px 10px;
    top: 0;
  }
}
</style>
