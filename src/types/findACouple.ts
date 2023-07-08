export type SettingsFindACouple = {
  quantity: number;
  countShuffle: number;
};

export type CardElement = {
  color: number;
  id: string;
};

export type ShowingCardElement = {
  id: string;
  color: string;
  onActive: boolean;
  founded: boolean;
};
