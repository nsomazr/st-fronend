export function getLoginErrorMessage(error) {
  if (!error?.response) {
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      return 'Request timed out. The API server may be down or unreachable.';
    }
    return 'Cannot reach the API server. Check that the backend is running and VITE_API_URL is correct.';
  }

  const data = error.response.data;
  if (typeof data?.detail === 'string') return data.detail;
  if (Array.isArray(data?.non_field_errors)) return data.non_field_errors.join(', ');
  if (data && typeof data === 'object') {
    const flat = Object.values(data).flat().filter(Boolean);
    if (flat.length) return flat.join(', ');
  }

  return 'Invalid username or password.';
}
