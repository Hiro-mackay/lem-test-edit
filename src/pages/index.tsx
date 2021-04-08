import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const Canvas = dynamic(() => import('../container/Canvas'), { ssr: false });

const Page = () => {
  return <Canvas />;
};

export default Page;
