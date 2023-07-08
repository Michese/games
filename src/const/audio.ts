import trackSrc1 from '@/assets/mp3/Papich - tututu.mp3';
import trackSrc2 from '@/assets/mp3/Korol_i_SHut_-_Kukla_kolduna.mp3';

export const AVAILABLE_TRACKS_LOCAL_NAME = 'availableTracks';
export const ADD_TRACK_FUNCTION = 'addToAvailableTrack';
export const AVAILABLE_TRACKS = 'availableTracks';
export const SHOW_TRACKS_SESSION_NAME = 'isShowingTracks';

export const AUDIO_TRACK_1 = 'Papich - tututu.mp3';
export const AUDIO_TRACK_2 = 'Korol_i_SHut_-_Kukla_kolduna.mp3';

export const AUDIO_LIST = {
  [AUDIO_TRACK_1]: {
    title: 'Папич - тутуту',
    src: trackSrc1,
    isPlaying: false,
  },
  [AUDIO_TRACK_2]: {
    title: 'Король и Шут - Кукла колдуна',
    src: trackSrc2,
    isPlaying: false,
  },
};
