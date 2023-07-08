<template>
  <article class="card" :class="cardClass">
    <div v-if="!!props.activeColor" class="card__background">
		<custom-icon icon="card-pattern" class="card-pattern" />
	</div>
  </article>
</template>

<script lang="ts" setup>
import { computed, defineProps, withDefaults } from 'vue';
import CustomIcon from '@/ui/CustomIcon.vue';

const props = withDefaults(
  defineProps<{
    activeColor: string | null;
    onActive?: boolean;
  }>(),
  {
    onActive: false,
  },
);

const color = computed(() => (props.onActive && props.activeColor ? props.activeColor : '#484848'));
const cardClass = computed(() => ({
  active: props.onActive,
}));
</script>

<style lang="scss" scoped>
.card {
  --time-animation: 0.5s;
  height: 200px;
  width: 150px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  transition: transform var(--time-animation) linear, opacity var(--time-animation) linear;
  background-color: #323232;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: scale(1.05);
    box-shadow: #fff 0 0 5px;
  }

  &.active {
    transform: scale(1.1) rotateY(180deg);
  }

  &__background {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-color: #484848;
    transition: background-color 0s calc(var(--time-animation) / 2) linear;
  }

  &.active > &__background {
    background-color: v-bind(color);
  }

  &:empty {
    opacity: 0;
    cursor: default;
  }
}

.card-pattern {
	fill: #fff;
	height: 100%;
	width: 100%;
}
</style>
