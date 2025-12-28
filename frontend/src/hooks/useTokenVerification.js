import { useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Backendurl } from '../App';

/**
 * Custom hook to poll backend and check if token is still valid
 * Automatically logs out user if token is blacklisted (cross-app logout sync)
 * 
 * @param {Function} onLogout - Callback function to execute when token is invalid
 * @param {number} intervalMs - Polling interval in milliseconds (default: 30000 = 30 seconds)
 */
const useTokenVerification = (onLogout, intervalMs = 1000) => {
    const intervalRef = useRef(null);
    const isCheckingRef = useRef(false);

    const verifyToken = useCallback(async () => {
        // Prevent multiple simultaneous checks
        if (isCheckingRef.current) return;

        const token = localStorage.getItem('token');
        if (!token) {
            return; // No token to verify
        }

        try {
            isCheckingRef.current = true;

            const response = await axios.get(`${Backendurl}/api/users/verify-token`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.data.valid) {
                console.log('[TokenVerification] Token invalidated, logging out...');
                onLogout();
            }
        } catch (error) {
            // Token is invalid or blacklisted
            if (error.response && error.response.status === 401) {
                console.log('[TokenVerification] Token verification failed, logging out...');
                onLogout();
            }
            // Don't logout on network errors, only on 401
        } finally {
            isCheckingRef.current = false;
        }
    }, [onLogout]);

    useEffect(() => {
        // Start polling
        intervalRef.current = setInterval(verifyToken, intervalMs);

        // Initial check
        verifyToken();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [verifyToken, intervalMs]);

    return { verifyToken };
};

export default useTokenVerification;
