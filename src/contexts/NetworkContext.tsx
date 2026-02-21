// src/contexts/NetworkContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  isInternetReachable: true,
});

export const useNetwork = (): NetworkContextType => {
  return useContext(NetworkContext);
};

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? true);
      setIsInternetReachable(state.isInternetReachable);
    });

    NetInfo.fetch()
      .then(state => {
        setIsConnected(state.isConnected ?? true);
        setIsInternetReachable(state.isInternetReachable);
      })
      .catch(() => {
        // Assume connected if initial check fails
      });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, isInternetReachable }}>
      {children}
    </NetworkContext.Provider>
  );
};
