import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type DeviceContextValue = {
  isMobile: boolean | undefined;
  isReady: boolean;
};

const DeviceContext = createContext<DeviceContextValue>({ isMobile: undefined, isReady: false });

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const detectMobile = () => {
      const ua = navigator.userAgent;
      const byUA = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Opera Mini/i.test(ua);
      const byWidth = window.innerWidth <= 768;
      return byUA || byWidth;
    };

    setIsMobile(detectMobile());
    setIsReady(true);

    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <DeviceContext.Provider value={{ isMobile, isReady }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice(): DeviceContextValue {
  return useContext(DeviceContext);
}


