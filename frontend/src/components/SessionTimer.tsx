import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SessionTimer() {
  const { expiresAt, isAuthenticated } = useAuth();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated || !expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt, isAuthenticated]);

  if (!isAuthenticated || !expiresAt) return null;

  const now = Date.now();
  const remaining = expiresAt - now;
  const isExpiringSoon = remaining <= 5 * 60 * 1000; // Less than 5 minutes

  return (
    <div
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        fontSize: '0.875rem',
        fontWeight: 500,
        background: isExpiringSoon ? '#fef3c7' : '#e0e7ff',
        color: isExpiringSoon ? '#92400e' : '#3730a3',
        border: `1px solid ${isExpiringSoon ? '#fbbf24' : '#818cf8'}`,
      }}
    >
      ⏱️ Session: {timeLeft}
    </div>
  );
}
