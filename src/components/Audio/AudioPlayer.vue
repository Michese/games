<template>
  <ul class="play-list">
    <li v-for="track in trackList" :key="track.src" class="play-list__item">
      <div class="play-list__icon" @click="clickIcon(track)">
        <custom-icon :icon="track.icon" />
      </div>
      <span class="play-list__text">
        <p class="marquee" :class="track.icon">{{ track.title }}</p>
      </span>
    </li>
  </ul>
  <audio v-if="activeAudio" class="audio-player" ref="audio" @play="play" @pause="pause" controls>
    <source :src="activeAudio.src" type="audio/mpeg" />
  </audio>
</template>

<script lang="ts" setup>
import './mp3.d';
import CustomIcon from '@/ui/CustomIcon.vue';
import { ref, computed, nextTick } from 'vue';
import { TrackItem } from '@/types';
import { AUDIO_LIST } from '@/const';

const props = defineProps<{
  tracks: string[];
}>();
const audioList = ref<Record<string, { title: string; src: string; isPlaying: boolean }>>(AUDIO_LIST);

const audio = ref<HTMLAudioElement>();
const isPlaying = ref<boolean>(false);
const activeAudio = ref<TrackItem>();

const trackList = computed<TrackItem[]>(() =>
  props.tracks.map((track) => ({ title: audioList.value[track].title!, src: audioList.value[track].src, name: track, icon: isPlaying.value && activeAudio.value?.name === track ? 'pause' : 'play' })),
);

function clickIcon(track: TrackItem) {
  if (track.name === activeAudio.value?.name) {
    if (isPlaying.value) audio.value?.pause();
    else audio.value?.play();
  } else {
    audio.value?.pause();
    activeAudio.value = undefined;

    nextTick(() => {
      activeAudio.value = track;
      nextTick(() => {
        audio.value?.play();
      });
    });
  }
}

function play() {
  isPlaying.value = true;
}

function pause() {
  isPlaying.value = false;
}

(() => {
  activeAudio.value = trackList.value[0];
})();
</script>

<style lang="scss" scoped>
@keyframes marquee {
  0% {
    transform: translateX(311px);
  }
  100% {
    transform: translateX(-100%);
  }
}

.play-list {
  &__item {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px;
    max-width: 100%;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
    color: rgba(255, 255, 255, 0.87);
    cursor: pointer;

    & > svg {
      padding: 5px;
      fill: currentColor;
      border-radius: 50%;
      border: currentColor solid 2px;
    }

    &:hover > svg {
      box-shadow: #fff 0 0 5px;
    }
  }

  &__text {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;

    & > .marquee {
      width: fit-content;

      &.pause {
        animation: marquee 5s linear infinite;
      }
    }

    &:hover {
      & > .marquee {
        animation: marquee 5s linear infinite;
      }
    }
  }
}
.audio-player {
  background-color: transparent;
  width: 100%;
}
</style>
