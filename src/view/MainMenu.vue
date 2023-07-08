<template>
  <nav class="main-menu__nav">
    <transition-group tag="ul" name="list" class="main-menu__list" appear>
      <li v-for="gameItem in gameList" :key="gameItem.value" class="main-menu__item" @click="emit('click', gameItem.value)">{{ gameItem.title }}</li>
    </transition-group>
  </nav>
</template>

<script lang="ts" setup>
import { MENU_PAGE_FIND_A_COUPLE } from '@/const';
import { computed, defineEmits } from 'vue';
import { MenuItem } from '@/types';

const emit = defineEmits<{
  (e: 'click', item: MenuItem): void;
}>();

const gameList = computed<{ value: MenuItem; title: string }[]>(() => [{ value: MENU_PAGE_FIND_A_COUPLE, title: 'Найди пару' }]);
</script>

<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.8s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.main-menu {
  &__nav {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
  }

  &__list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  &__item {
    font-size: 1.5em;
    position: relative;
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 0;

      transition: width 0.1s ease;
      width: 0;
      height: 5px;
      background-color: currentColor;
    }

    &:hover {
      color: #fff;
      text-shadow: #fff 0 0 1px;
    }

    &:hover::after {
      width: 100%;
    }
  }
}
</style>
