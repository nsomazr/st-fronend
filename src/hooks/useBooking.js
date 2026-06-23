import { useState, useCallback } from 'react';
import { bookingsApi } from '../services/api';

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  const createBooking = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { data: result } = await bookingsApi.create(data);
      setBooking(result);
      return result;
    } catch (err) {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(', ')
        : err.message;
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createBooking, booking, loading, error };
}
