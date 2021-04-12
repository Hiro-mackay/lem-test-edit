import React, { FC, memo, useMemo } from 'react';
import { useSequenceContext } from '../../context/Sequence';

interface SequenceTimetickProps {
  timeScale: number;
  durationTime: number;
  timeTicks: Array<number>;
}

interface TimetickProps {
  tick: number;
}

export const SequenceTimetick: FC = memo(() => {
  const { timeDuration, sequenceScale, timeTicks } = useSequenceContext();

  const timeDurationM = useMemo(() => timeDuration, [timeDuration]);
  const sequenceScaleM = useMemo(() => sequenceScale, [sequenceScale]);
  const timeTicksM = useMemo(() => timeTicks, [timeTicks]);
  return (
    <div className="relative border-b-2 border-gray-400" style={{ width: timeDurationM / sequenceScaleM }}>
      {timeTicksM.map((tick) => (
        <Timetick key={tick} tick={tick} timeScale={sequenceScaleM} />
      ))}
    </div>
  );
});

const Timetick: FC<Pick<SequenceTimetickProps, 'timeScale'> & TimetickProps> = memo(({ tick, timeScale }) => {
  return (
    <div className="absolute h-2 w-0.5 bg-gray-400 z-0" style={{ left: tick / timeScale }}>
      <div
        className="absolute text-sm w-10 text-gray-100 text-center"
        style={{ top: 10, left: '50%', transform: 'translateX(-50%)' }}
      >
        {`${tick / 1000} s`}
      </div>
    </div>
  );
});
