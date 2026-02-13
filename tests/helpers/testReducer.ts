import { appReducer, initialState } from '../../src/context/AppContext';
import type { AppAction, AppState } from '../../src/types';

export function reduceActions(actions: AppAction[], initial: AppState = initialState): AppState {
  return actions.reduce((state, action) => appReducer(state, action), initial);
}
