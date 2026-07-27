import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { ref, remove, set } from "firebase/database";
import type { AppData, DayLog, Settings } from "../types";
import { clearStorage, loadFromStorage, saveToStorage } from "../utils/storage";
import { database } from "../firebase";

type Action =
  | { type: "SET_SETTINGS"; settings: Settings }
  | { type: "UPSERT_LOG"; log: DayLog }
  | { type: "RESET" };

const initialState: AppData = { settings: null, logs: {} };

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case "SET_SETTINGS":
      return { ...state, settings: action.settings };
    case "UPSERT_LOG":
      return { ...state, logs: { ...state.logs, [action.log.date]: action.log } };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface AppDataContextValue {
  data: AppData;
  saveSettings: (settings: Settings) => void;
  upsertLog: (log: DayLog) => void;
  getLog: (dateKey: string) => DayLog | undefined;
  resetAllData: () => void;
  stopSharing: (shareCode: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, initialState, () => loadFromStorage(initialState));

  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const sharing = data.settings?.partnerSharing;
  useEffect(() => {
    if (!database || !sharing?.enabled || !sharing.shareCode) return;
    set(ref(database, `shares/${sharing.shareCode}`), data).catch(() => {
      // Broadcast is best-effort — local storage remains the source of truth either way.
    });
  }, [data, sharing?.enabled, sharing?.shareCode]);

  const value: AppDataContextValue = {
    data,
    saveSettings: (settings) => dispatch({ type: "SET_SETTINGS", settings }),
    upsertLog: (log) => dispatch({ type: "UPSERT_LOG", log }),
    getLog: (dateKey) => data.logs[dateKey],
    resetAllData: () => {
      clearStorage();
      dispatch({ type: "RESET" });
    },
    stopSharing: (shareCode) => {
      if (!database || !shareCode) return;
      remove(ref(database, `shares/${shareCode}`)).catch(() => {
        // Best-effort cleanup — the code will simply be regenerated if re-enabled later.
      });
    },
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within an AppDataProvider");
  return ctx;
}
