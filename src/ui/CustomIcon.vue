<template>
  <svg class="icon" :style="iconStyle">
    <use class="icon__inner" :xlink:href="`#${icon}`"></use>
  </svg>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults, computed, CSSProperties } from 'vue';

const props = withDefaults(
  defineProps<{
    icon: string;
    size?: number;
    unitSize?: string;
  }>(),
  {
    size: 20,
    unitSize: 'px',
  },
);

const iconStyle = computed<CSSProperties>(() => ({
  fontSize: `${props.size}${props.unitSize}`,
}));
</script>

<style lang="scss" scoped>
.icon {
  display: inline-flex;
  width: 1em;
  height: 1em;
}
</style>
