import React, { FC, memo, useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { useSequenceContext } from '../../context/Sequence';
import { Timeline } from './Timeline';
import { useLemContext } from '../../context/Lem';

export const Sequence: FC = memo(() => {
  const { Lem, canvas } = useLemContext();
  const { sequenceScale } = useSequenceContext();

  return (
    <ReactSortable
      className="flex flex-nowrap w-min"
      list={canvas.resources}
      setList={(state) => {
        Lem.canvas.setResources(state);
      }}
      swapThreshold={0.8}
      ghostClass="bg-green-300"
      animation={300}
      delay={1}
    >
      {canvas.resources.map((item) => (
        <Timeline key={item.id} title={`${item.id}`} length={item.outFrame} sequenceScale={sequenceScale} />
      ))}
    </ReactSortable>
  );
});
