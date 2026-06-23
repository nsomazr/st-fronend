import { useEffect, useState } from 'react';
import { servicesApi } from '../services/api';
import { FALLBACK_SERVICES } from '../utils/constants';

const FETCH_TIMEOUT_MS = 8000;

function normalizeServices(data) {
  const list = data?.results ?? data;
  return Array.isArray(list) ? list : [];
}

function fetchWithTimeout() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return servicesApi
    .list({ signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

export function useServices() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchWithTimeout();
        if (!active) return;
        const list = normalizeServices(data);
        if (list.length > 0) {
          setServices(list);
        } else {
          setServices(FALLBACK_SERVICES);
          setError('No services returned from server.');
        }
      } catch (err) {
        if (!active) return;
        setServices(FALLBACK_SERVICES);
        const message =
          err.name === 'CanceledError' || err.code === 'ERR_CANCELED'
            ? 'Request timed out.'
            : err.message || 'Failed to load services';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchWithTimeout();
      const list = normalizeServices(data);
      setServices(list.length > 0 ? list : FALLBACK_SERVICES);
      if (list.length === 0) setError('No services returned from server.');
    } catch (err) {
      setServices(FALLBACK_SERVICES);
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, error, refetch };
}
