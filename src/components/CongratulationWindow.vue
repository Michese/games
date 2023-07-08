<template>
  <slot />
  <teleport to="body">
    <transition name="slide-fade">
      <section v-if="isShowing" class="congratulation-window" @click.stop="hideCongratulationWindow">
        <div class="congratulation-window__content">
          <span>Поздравляю!</span>
          <span>Вы выйграли новый трэк!</span>
          <span>{{ trackName }}</span>
        </div>
      </section>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, provide } from 'vue';
import { SHOW_CONGRATULATION_WINDOW, AUDIO_LIST } from '@/const';

const isShowing = ref<boolean>(false);
const trackName = ref<string>('');

function showCongratulationWindow(trackItem: keyof typeof AUDIO_LIST) {
  if (trackItem in AUDIO_LIST) {
    trackName.value = AUDIO_LIST[trackItem].title;
    isShowing.value = true;
  }
}

function hideCongratulationWindow() {
  isShowing.value = false;
}

provide(SHOW_CONGRATULATION_WINDOW, showCongratulationWindow);
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.congratulation-window {
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: rgba(201, 1, 59, 0.9);
  background: radial-gradient(circle, rgba(201, 1, 59, 0.9) 0%, rgba(163, 24, 118, 0.9) 35%, rgba(0, 0, 0, 0.9) 100%);

  &__content {
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 3em;
    line-height: 1.5em;
  }
}
</style>
