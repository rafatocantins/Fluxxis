/**
 * Network Status Hook
 * 
 * Detects online/offline status and network quality
 */

import { useState, useEffect } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
  connectionType?: NetworkConnectionType;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

type NetworkConnectionType = 'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi' | 'wimax';

/**
 * Get current network status
 */
function getNetworkStatus(): NetworkStatus {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isOnline: true,
      isOffline: false,
    };
  }

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  return {
    isOnline: navigator.onLine,
    isOffline: !navigator.onLine,
    connectionType: connection?.type as NetworkConnectionType,
    effectiveType: connection?.effectiveType as NetworkStatus['effectiveType'],
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
  };
}

/**
 * Hook to monitor network status
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(getNetworkStatus());

  useEffect(() => {
    const updateStatus = () => {
      setStatus(getNetworkStatus());
    };

    // Listen for online/offline events
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Listen for connection change (Chrome/Edge)
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return status;
}

/**
 * Check if connection is slow
 */
export function isSlowConnection(status: NetworkStatus): boolean {
  return (
    status.effectiveType === 'slow-2g' ||
    status.effectiveType === '2g' ||
    (status.downlink !== undefined && status.downlink < 1.5) ||
    (status.rtt !== undefined && status.rtt > 600)
  );
}

/**
 * Check if we should use data-saving mode
 */
export function shouldSaveData(status: NetworkStatus): boolean {
  return status.saveData === true || isSlowConnection(status) || status.isOffline;
}
