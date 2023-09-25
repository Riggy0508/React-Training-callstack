// export const appState = {
//   lotteries: new Map(),
// };

import { Lottery } from "../types"

interface AppState {
  lotteries: Map<string, Lottery>;
}

export const appState: AppState = {
  lotteries: new Map(),
};