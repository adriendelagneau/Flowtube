import { useState, useCallback } from "react";

export function useAuthState() {
  const [error, setErrorState] = useState<string | null>(null);
  const [loading, setLoadingState] = useState(false);

  const setError = useCallback((message: string | null) => {
    setErrorState(message);
  }, []);

  const setLoading = useCallback((state: boolean) => {
    setLoadingState(state);
  }, []);

  const resetState = useCallback(() => {
    setErrorState(null);
    setLoadingState(false);
  }, []);

  return {
    error,
    loading,
    setError,
    setLoading,
    resetState,
  };
}
