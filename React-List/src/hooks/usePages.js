import {useMemo} from 'react';

export const usePagination = (array, count) => {
  const pagesArray =  useMemo(() => {
    if(array.length < count) {
      for (let i = 0; i < count; i++) {
        array.push(i + 1);
      }
    }
    return array;
  }, [array, count])

  return pagesArray;
}
