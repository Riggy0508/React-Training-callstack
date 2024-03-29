import { useState } from 'react';
import { Lottery } from '../types';
import * as LotteryService from '../services/lottery';

export function useNewLottery() {
  const [lottery, setLottery] = useState<Lottery>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const createNewLottery = async (lotteryData: {
    name: string;
    prize: string;
  }) => {
    setError(undefined);
    setLoading(true);

    try {
      const lottery = await LotteryService.createNewLottery(lotteryData);
      setLoading(false);
      setLottery(lottery);
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
      throw e;
    }
  };

  return {
    data: lottery,
    loading,
    error,
    createNewLottery,
  };
}