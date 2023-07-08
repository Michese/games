<template>
  <span class="custom-time">{{ minutes }}:{{ seconds }}</span>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';

const props = defineProps<{
  seconds: number;
}>();

const minutes = computed<string>(() =>
  Math.floor(props.seconds / 60)
    .toString()
    .padStart(2, '0'),
);
const seconds = computed<string>(() => (props.seconds % 60).toString().padStart(2, '0'));
</script>

<style lang="scss" scoped>
.custom-time {
  font-family: 'Share Tech Mono', monospace;
}
</style>
