import { createContext, useContext, FC, memo, useState, Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { Lem as LemEngine, CanvasEntity, Lem } from '../../lem';

export function createCtx<T extends {} | null>() {
  const ctx = createContext<T | undefined>(undefined);

  function useCtx() {
    const c = useContext(ctx);
    if (c === undefined) throw new Error('useCtx must be inside a Provider with a value');
    return c;
  }

  return [useCtx, ctx] as const;
}

export interface IContext {
  Lem: LemEngine;
  canvas: CanvasEntity;
  setCanvas: Dispatch<SetStateAction<CanvasEntity>>;
}

export const [useLemContext, LemContext] = createCtx<IContext>();

export const LemProvider: FC = memo(({ children }) => {
  const [Lem, setLem] = useState<Lem>(null);
  const [canvas, setCanvas] = useState<CanvasEntity>();

  useEffect(() => {
    const _Lem = new LemEngine();
    setLem(_Lem);
  }, []);

  useEffect(() => {
    if (!Lem) return;
    Lem.attachDispatch((data) => {
      setCanvas({
        ...data
      });
    });

    const data = Lem.canvas.json();
    setCanvas(data);
  }, [Lem]);

  if (!canvas) {
    return <p>Loading...</p>;
  }

  return (
    <LemContext.Provider
      value={{
        Lem,
        canvas,
        setCanvas
      }}
    >
      {children}
    </LemContext.Provider>
  );
});
