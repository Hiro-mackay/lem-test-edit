import React, { memo } from 'react';

import { LemProvider } from '../context/Lem';
import { SequenceProvider } from '../context/Sequence';
import { Studio } from '../components/Studio';

export const Canvas = memo(() => {
  return (
    <LemProvider>
      <SequenceProvider>
        <Studio />
      </SequenceProvider>
    </LemProvider>
  );
});

export default Canvas;
