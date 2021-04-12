import React, { FC, memo, useCallback, useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { useSequenceContext } from '../../context/Sequence';
import { Timeline } from './Timeline';
import { useLemContext } from '../../context/Lem';

export const Sequence: FC = memo(() => {
  const { Lem, canvas } = useLemContext();
  const { sequenceScale } = useSequenceContext();

  const list = useMemo(() => Lem.canvas.resources, [Lem.canvas.resources]);

  const reload = useCallback((state) => {
    Lem.canvas.reloadResources(state);
  }, []);

  return (
    <ReactSortable
      className="flex flex-nowrap w-min"
      list={list}
      setList={(state) => {
        reload(state);
      }}
      swapThreshold={0.8}
      ghostClass="bg-green-300"
      animation={300}
      delay={1}
    >
      {list.map((item) => (
        <Timeline key={item.id} title={`${item.file.name}`} length={item.outFrame} sequenceScale={sequenceScale} />
      ))}
    </ReactSortable>
  );
});
