import { useEffect, useState, type DependencyList } from 'react';

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useAsync<T>(factory: () => Promise<T>, deps: DependencyList): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    setState((old) => ({ ...old, loading: true, error: null }));
    factory()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error: unknown) => alive && setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Có lỗi xảy ra' }));
    return () => {
      alive = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
