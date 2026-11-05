import { useCallback, useEffect, useState } from 'react';

// Runs an async service call and gives { data, loading, reload }.
export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fn();
    setData(res.data);
    setLoading(false);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);
  return { data, loading, reload: load };
}
