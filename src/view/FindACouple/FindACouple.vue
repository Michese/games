<template>
  <section class="find-a-couple">
    <header-find-a-couple :record="record" @clear-settings="clearSettings" />
    <settings v-if="showSettings" @save-settings="saveSettings" />
    <template v-else-if="!isEndGame">
      <custom-time :seconds="gameTime" class="find-a-couple__clock" />
      <transition-group v-if="!isEndGame && !!showingCardElements.length" name="list" tag="section" class="find-a-couple__main">
        <card-find-a-couple
          v-for="(card, index) in showingCardElements"
          :key="`card_${card.id}`"
          :active-color="card.founded ? null : card.color"
          :on-active="card.founded && !card.onActive ? false : card.onActive"
          @click="addSelectionCard(card.founded ? null : index)"
        />
      </transition-group>
    </template>
    <section v-else class="find-a-couple__end-game">
      <span class="find-a-couple__game-over">Игра окончена!</span>
    </section>
  </section>
</template>

<script lang="ts" setup>
import {
ADD_TRACK_FUNCTION,
ALL_CARDS_SESSION_NAME,
AUDIO_LIST,
AVAILABLE_TRACKS,
DELAY_DEFAULT_SELECTION,
FOUNDED_CARDS_SESSION_NAME,
RECORD_FOUND_A_COUPLE_LOCAL_NAME,
SELECTIONS_CARDS_SESSION_NAME,
SETTINGS_SESSION_NAME,
SHOW_CONGRATULATION_WINDOW,
START_TIME_SESSION_NAME,
} from '@/const';
import { CardElement, SettingsFindACouple, ShowingCardElement } from '@/types';
import CustomTime from '@/ui/CustomTime.vue';
import _ from 'lodash';
import { computed, inject, ref } from 'vue';
import { uuid } from 'vue-uuid';
import CardFindACouple from './CardFindACouple.vue';
import HeaderFindACouple from './HeaderFindACouple.vue';
import Settings from './Settings.vue';

const countColors = 256;
const numberColorCombinations = 25;

const showCongratulationWindow = inject(SHOW_CONGRATULATION_WINDOW) as (trackName: keyof typeof AUDIO_LIST) => void;
const addToAvailableTrack = inject(ADD_TRACK_FUNCTION) as (trackName: keyof typeof AUDIO_LIST) => void;
const availableTracks = inject(AVAILABLE_TRACKS) as (keyof typeof AUDIO_LIST)[];

const settings = ref<SettingsFindACouple | null>(null);
const record = ref<(SettingsFindACouple & { time: number }) | null>(null);
const startTime = ref<Date | null>(null);
const gameTime = ref<number>(0);
const delaySelection = ref<number>(DELAY_DEFAULT_SELECTION);
const indexInterval = ref<ReturnType<typeof setInterval> | null>(null);
const allCards = ref<CardElement[]>();
const foundedCards = ref<Set<number>>(new Set());
const selectedCards = ref<Set<number>>(new Set());
const activatedAllCards = ref<boolean>(false);

const isEndGame = computed<boolean>(() => foundedCards.value.size === allCards.value?.length);
const showSettings = computed<boolean>(() => !settings.value);

const showingCardElements = computed<ShowingCardElement[]>(() => {
  const iterations = countColors / ((numberColorCombinations + (numberColorCombinations % 3 > 0 ? 3 - (numberColorCombinations % 3) : 0)) / 3 - 1);

  return (
    allCards.value?.map((card, ind) => {
      const overallColor = Math.floor(card.color / 6);
      const red = Math.floor((overallColor + (card.color % 6 > 2 ? 1 : 0)) * iterations);
      const green = Math.floor((overallColor + ([1, 2, 5].includes(card.color % 6) ? 1 : 0)) * iterations);
      const blue = Math.floor((overallColor + ((card.color + 1) % 2)) * iterations);

      return {
        id: card.id,
        color: `rgb(${red}, ${green}, ${blue})`,
        onActive: activatedAllCards.value || selectedCards.value.has(ind),
        founded: foundedCards.value.has(ind),
      };
    }) ?? []
  );
});

function addSelectionCard(cardIndex: number | null) {
  if (cardIndex !== null && selectedCards.value.size < 2 && !activatedAllCards.value) {
    if (selectedCards.value.has(cardIndex)) {
      selectedCards.value.delete(cardIndex);
    } else {
      selectedCards.value.add(cardIndex);
    }
    sessionStorage.setItem(SELECTIONS_CARDS_SESSION_NAME, JSON.stringify([...selectedCards.value.values()]));
  }
}

function saveSettings(newSettings: SettingsFindACouple | null) {
  settings.value = newSettings;
  sessionStorage.setItem(SETTINGS_SESSION_NAME, JSON.stringify(settings.value));

  if (newSettings) {
    changeGameTime(0);
    selectedCards.value.clear();
    foundedCards.value.clear();
    sessionStorage.removeItem(SELECTIONS_CARDS_SESSION_NAME);
    sessionStorage.removeItem(FOUNDED_CARDS_SESSION_NAME);
    const createdAllCards = _.shuffle([...generateCards(newSettings.quantity)]);
    allCards.value = createdAllCards;
    allCards.value = _.shuffle(allCards.value);
    allCards.value = createdAllCards;
    activatedAllCards.value = true;

    const iterTime = 1000;
    for (let iter = 0; iter < newSettings.countShuffle; iter++) {
      setTimeout(() => (allCards.value = _.shuffle(allCards.value!)), iterTime * (iter + 2));
    }

    setTimeout(() => {
      startTime.value = new Date();
      sessionStorage.setItem(START_TIME_SESSION_NAME, startTime.value.toString());
      sessionStorage.setItem(ALL_CARDS_SESSION_NAME, JSON.stringify(allCards.value));
      indexInterval.value = setInterval(tickTime, 500);
      activatedAllCards.value = false;
    }, iterTime * (newSettings.countShuffle + 2));
  } else if (indexInterval.value) {
    startTime.value = null;
    clearInterval(indexInterval.value);
    indexInterval.value = null;
  }
}

function* generateCards(quantity: number): Generator<CardElement> {
  for (let iter = 0; iter < quantity; iter++) {
    const color = iter + Math.floor(iter / 6) + 1;
    yield {
      id: uuid.v1(),
      color,
    };
    yield {
      id: uuid.v1(),
      color,
    };
  }
}

function clearSettings() {
  saveSettings(null);
}

function changeGameTime(newGameTime: number) {
  gameTime.value = newGameTime;
}

function setRecord(newRecord: SettingsFindACouple & { time: number }) {
  record.value = newRecord;
  localStorage.setItem(RECORD_FOUND_A_COUPLE_LOCAL_NAME, JSON.stringify(record.value));
}

function tickTime() {
  const nowDate = new Date();
  const differenceTime = nowDate.valueOf() - startTime.value!.valueOf();
  const newGameTime = Math.floor(differenceTime / 1000);
  changeGameTime(newGameTime);

  if (selectedCards.value.size >= 2) {
    if (delaySelection.value > 0) {
      delaySelection.value--;
    } else {
      const selectedArr = [...selectedCards.value.values()];
      const firstIndexElement = selectedArr.pop()!;
      const firstElement = allCards.value![firstIndexElement]!;

      if (selectedArr.every((elInd) => firstElement.color === allCards.value![elInd]!.color)) {
        foundedCards.value.add(firstIndexElement);
        for (const selectedItem of selectedArr) {
          foundedCards.value.add(selectedItem);
        }

        sessionStorage.setItem(FOUNDED_CARDS_SESSION_NAME, JSON.stringify([...foundedCards.value.values()]));
      }

      selectedCards.value.clear();
      sessionStorage.removeItem(SELECTIONS_CARDS_SESSION_NAME);
      delaySelection.value = DELAY_DEFAULT_SELECTION;

      if (foundedCards.value.size === allCards.value?.length) {
        clearInterval(indexInterval.value!);
        indexInterval.value = null;

        if (record.value) {
          if (
            settings.value!.quantity > record.value.quantity ||
            (settings.value!.quantity >= record.value.quantity && settings.value!.countShuffle > record.value.countShuffle) ||
            (settings.value!.quantity >= record.value.quantity && settings.value!.countShuffle >= record.value.countShuffle && newGameTime > record.value.time)
          ) {
            setRecord({
              quantity: settings.value!.quantity,
              countShuffle: settings.value!.countShuffle,
              time: newGameTime,
            });
          }
        } else {
          setRecord({
            quantity: settings.value!.quantity,
            countShuffle: settings.value!.countShuffle,
            time: newGameTime,
          });
        }

        if (Math.random() < settings.value!.quantity * 0.1 + settings.value!.countShuffle * 0.01) {
          const tracks = (Object.keys(AUDIO_LIST) as (keyof typeof AUDIO_LIST)[]).filter((track) => !availableTracks.includes(track));
          if (tracks.length > 0) {
            const trackIndex = Math.floor(Math.random() * tracks.length);
            const randomTrack = tracks[trackIndex];
            addToAvailableTrack(randomTrack);
            showCongratulationWindow(randomTrack);
          }
        }
      }
    }
  }
}

(() => {
  const startTimeSession = sessionStorage.getItem(START_TIME_SESSION_NAME);
  const settingsSession = sessionStorage.getItem(SETTINGS_SESSION_NAME);
  const allCardsSession = sessionStorage.getItem(ALL_CARDS_SESSION_NAME);
  const recordLocal = localStorage.getItem(RECORD_FOUND_A_COUPLE_LOCAL_NAME);
  const selectedCardSession = sessionStorage.getItem(SELECTIONS_CARDS_SESSION_NAME);
  const foundedCardsSession = sessionStorage.getItem(FOUNDED_CARDS_SESSION_NAME);
  if (settingsSession) settings.value = JSON.parse(settingsSession);
  if (startTimeSession) startTime.value = new Date(startTimeSession);
  if (allCardsSession) allCards.value = JSON.parse(allCardsSession);
  if (foundedCardsSession) {
    const parsedFoundedCards = JSON.parse(foundedCardsSession) as number[];
    if (parsedFoundedCards?.length) parsedFoundedCards.forEach((card) => foundedCards.value.add(card));
  }
  if (selectedCardSession) {
    const parsedSelectedCardSession = JSON.parse(selectedCardSession) as number[];
    if (parsedSelectedCardSession?.length) parsedSelectedCardSession.forEach((card) => selectedCards.value.add(card));
  }
  if (settings.value && startTime.value && allCards.value && foundedCards.value.size < allCards.value.length) {
    indexInterval.value = setInterval(tickTime, 1000);
  }
  if (recordLocal) record.value = JSON.parse(recordLocal);
})();
</script>

<style lang="scss" scoped>
.find-a-couple {
  &__end-game {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &__game-over {
    font-size: 2em;
  }

  &__main {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(7, auto);
    justify-items: center;
  }

  &__clock {
    position: fixed;
    bottom: 10px;
    left: 10px;
    font-size: 1.7em;
    font-family: 'Share Tech Mono', monospace;
  }
}

.list-move {
  transition: transform 0.8s ease;
}
</style>
