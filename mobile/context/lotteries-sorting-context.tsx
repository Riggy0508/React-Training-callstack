import { DispatchWithoutAction, createContext, useContext, useReducer } from "react";

export enum LotteryListSortingOptions {
    Ascending,
    Descending,
  }
  
  interface LotteriesSortingContextValue {
    selectedSorting: LotteryListSortingOptions;
    switchSorting: DispatchWithoutAction;
  }

  interface LotteriesSortingContextProviderProps {
    children: JSX.Element;
  }

  const LotteriesSortingContext = createContext<
  LotteriesSortingContextValue | undefined
>(undefined);
  const sortingReducer = (state: LotteryListSortingOptions) => {
    return state === LotteryListSortingOptions.Ascending
      ? LotteryListSortingOptions.Descending
      : LotteryListSortingOptions.Ascending;
  };

  
  export const LotteriesSortingContextProvider = ({
    children,
  }: LotteriesSortingContextProviderProps) => {
    const [selectedSorting, switchSorting] = useReducer(
      sortingReducer,
      LotteryListSortingOptions.Ascending,
    );
  
    const value: LotteriesSortingContextValue = {
      selectedSorting,
      switchSorting,
    };
  
    return (
      <LotteriesSortingContext.Provider value={value}>
        {children}
      </LotteriesSortingContext.Provider>
    );
  };

  export const useLotteriesSortingContext = () => {
    const context = useContext(LotteriesSortingContext);
  
    if (context === undefined) {
      throw new Error(
        'useLotteriesSortingContext must be used within a LotteriesSortingContextProvider',
      );
    }
  
    return context;
  };