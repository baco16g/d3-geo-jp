import * as React from 'react';
import shuffle from '../utils/shuffle';
import getPowOfArray from '../utils/getPowOfArray';

interface CoordinatesData {
  code: number;
  name: string;
  coordinates: [number, number];
}

interface PopulationData {
  code: number;
  name: string;
  population: number;
}

export interface InfoData extends CoordinatesData, PopulationData {}

async function getListData<T>(src: string): Promise<T> {
  const response = await fetch(src);
  if (response.status !== 200) throw new Error(`There was a problem: ${response.status}`);
  const {list} = await response.json();
  return list;
}

export default function useJpInfo() {
  const [data, setData] = React.useState<InfoData[]>([]);
  const [updater, setUpdater] = React.useState<number>(0);

  React.useEffect(() => {
    mergeInfoData().then(value => {
      const populationsOfDummy = shuffle(getPowOfArray(1.15, value.length));
      setData(
        value.map((v, i) => ({
          ...v,
          population: populationsOfDummy[i],
        }))
      );
    });
  }, [updater]);

  const mergeInfoData = React.useCallback(async () => {
    const [/* populations, */ coordinates] = await Promise.all([
      // getListData<PopulationData[]>('/static/json/population.json'),
      getListData<CoordinatesData[]>('/static/json/coordinates.json'),
    ]);
    return coordinates.map(cs => {
      // const data = populations.find(p => p.code === cs.code);
      // if (!data) throw new Error('No match prefecture!');
      return {
        ...cs,
        coordinates: cs.coordinates.reverse() as [number, number],
        // population: data.population,
      };
    });
  }, []);

  const update = React.useCallback(() => {
    setUpdater(prev => {
      console.log(prev);
      return prev + 1;
    });
  }, [updater]);

  return {data, update};
}
