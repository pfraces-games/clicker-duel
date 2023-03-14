import { useAppState } from './appState';

export const useUser = () => {
  const { state, setState } = useAppState();

  const user = state.user;

  const setUser = (func) => {
    setState((prevState) => ({ ...prevState, user: func(prevState.user) }));
  };

  return { user, setUser };
};
