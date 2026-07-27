import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database, isPartnerSharingConfigured } from "../firebase";
import type { AppData } from "../types";

interface UsePartnerDataResult {
  data: AppData | null;
  loading: boolean;
  error: string | null;
}

export function usePartnerData(shareCode: string | null): UsePartnerDataResult {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(Boolean(shareCode));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareCode) {
      setData(null);
      setLoading(false);
      return;
    }
    if (!database) {
      setError("Partner sharing isn't configured for this deployment.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const dbRef = ref(database, `shares/${shareCode}`);
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const value = snapshot.val() as AppData | null;
        setData(value);
        setLoading(false);
        setError(value ? null : "No data found for this code yet — ask your partner to enable sharing.");
      },
      () => {
        setError("Couldn't connect. Double check the code and try again.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [shareCode]);

  return { data, loading, error: isPartnerSharingConfigured ? error : "Partner sharing isn't configured for this deployment." };
}
