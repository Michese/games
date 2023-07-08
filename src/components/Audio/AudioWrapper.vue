<template>
  <slot />
  <section v-if="!!availableTracks.length" class="audio-wrapper" :class="classWrapper" @click.stop>
    <div class="audio-wrapper__arrow" @click="arrowClick">
		<custom-icon icon="arrow-right" :size="40" class="arrow-icon" />
    </div>
    <div class="audio-wrapper__content">
      <audio-player :tracks="availableTracks" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import AudioPlayer from './AudioPlayer.vue';
import CustomIcon from '@/ui/CustomIcon.vue';
import { ref, computed, provide } from 'vue';
import { AUDIO_LIST, ADD_TRACK_FUNCTION, AVAILABLE_TRACKS, AVAILABLE_TRACKS_LOCAL_NAME, SHOW_TRACKS_SESSION_NAME } from '@/const';

const availableTracks = ref<(keyof typeof AUDIO_LIST)[]>([]);
const isOpen = ref<boolean>(true);

const classWrapper = computed<unknown>(() => ({
  open: isOpen.value,
}));

function changeIsOpen(newIsOpen: boolean) {
  isOpen.value = newIsOpen;
  sessionStorage.setItem(SHOW_TRACKS_SESSION_NAME, isOpen.value.toString());
}

function addToAvailableTrack(trackName: keyof typeof AUDIO_LIST): boolean {
  if (trackName in AUDIO_LIST && !(trackName in availableTracks.value)) {
    availableTracks.value.push(trackName);
    localStorage.setItem(AVAILABLE_TRACKS_LOCAL_NAME, JSON.stringify(availableTracks.value));
    return true;
  }

  return false;
}

function arrowClick() {
  changeIsOpen(!isOpen.value);
}

provide(AVAILABLE_TRACKS, availableTracks.value);
provide(ADD_TRACK_FUNCTION, addToAvailableTrack);

(() => {
  const availableTracksJson = localStorage.getItem(AVAILABLE_TRACKS_LOCAL_NAME);
  isOpen.value = sessionStorage.getItem(SHOW_TRACKS_SESSION_NAME) !== 'false';
  if (availableTracksJson) availableTracks.value = JSON.parse(availableTracksJson);
})();
</script>

<style lang="scss" scoped>
@keyframes arrow-move {
  from {
    transform: translateX(5px);
  }
  50% {
    transform: translateX(0);
  }
  to {
    transform: translateX(5px);
  }
}
.audio-wrapper {
  display: flex;
  z-index: 10;

  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: #242424;
  width: 400px;
  transition: transform 0.3s ease-in-out;
  transform: translateX(360px);

  &.open {
    transform: translateX(0);
  }

  &__arrow {
    display: flex;
	align-items: center;
	justify-content: flex-start;
    width: 40px;
	fill: #484848;
	height: 100%;
    cursor: pointer;
    transform: rotateY(180deg);

    &:hover > .arrow-icon {
      animation: arrow-move 0.7s linear infinite;
      transform: rotateY(180deg);
    }
  }

  &.open > &__arrow {
    transform: rotateY(0);
  }
  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    width: calc(400px - 40px);
  }
}
</style>
