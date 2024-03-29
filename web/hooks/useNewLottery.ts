import {useState} from 'react';
import {Lottery} from '../types'
import *as LotteryService from  "../service/lottery";

export function useNewLottery(){
    const [lottery,setLottery]=useState<Lottery>();
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState<string>();

    const createNewLottery=(lotteryData:{name:string;prize:string})=>{
        setError(undefined);
        setLoading(true);

        return LotteryService.createNewLottery(lotteryData).then((lottery)=>{
            setLoading(false);
            setLottery(lottery);
        })
        .catch((e:Error)=>{
            setLoading(false);
            setError(e.message);

            throw e;
        });
    };

        const resetLottery=()=>{
            setError(undefined);
            setLoading(false);
        };
        return {
            lottery,
            loading,
            error,
            createNewLottery,
            resetLottery,
        };
}