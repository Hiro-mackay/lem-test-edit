import { memo } from 'react';
import { Sequence } from './Sequnce/Sequence';
import { SequenceTimetick } from './Sequnce/SequenceTimetick';
import { Viewer } from './Viewer';

export const Studio = memo(() => {
  return (
    <div className="w-full min-h-screen bg-gray-700">
      <div className="grid grid-cols-1">
        <div
          className="p-24 box-border w-full max-w-6xl"
          style={{
            height: 900
          }}
        >
          <Viewer />
        </div>
      </div>

      <div className="h-96 bg-gray-800 ">
        <div className="w-full overflow-x-scroll p-10 box-border">
          <div className="mb-10">
            <SequenceTimetick />
          </div>
          <Sequence />
        </div>
      </div>
    </div>
  );
});
