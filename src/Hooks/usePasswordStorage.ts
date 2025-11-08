import { useCallback, useEffect, useState } from 'react';

import { simulateServerRequest } from '../Services/fakeServer';

import {
  PasswordEntry,
  PasswordFormValues,
  ServerResponse,
} from '../Types/password';

const STORAGE_KEY = 'password-manager-entries';

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const readStoredEntries = (): PasswordEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is PasswordEntry =>
      Boolean(
        item && item.id && item.service && item.password && item.createdAt
      )
    );
  } catch (error) {
    console.error('Ошибка чтения localStorage', error);
    return [];
  }
};

const persistEntries = (entries: PasswordEntry[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Ошибка записи в localStorage', error);
  }
};

export function usePasswordStorage() {
  const [entries, setEntries] = useState<PasswordEntry[]>(() =>
    readStoredEntries()
  );
  const [isAdding, setIsAdding] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    persistEntries(entries);
  }, [entries]);

  const addPassword = useCallback(
    async (
      values: PasswordFormValues
    ): Promise<ServerResponse<PasswordEntry>> => {
      setIsAdding(true);
      const response = await simulateServerRequest<PasswordFormValues>({
        payload: values,
      });
      setIsAdding(false);

      if (!response.success) {
        return {
          success: false,
          error: response.error,
        };
      }

      const newEntry: PasswordEntry = {
        id: createId(),
        service: values.service.trim(),
        password: values.password,
        createdAt: new Date().toISOString(),
      };

      setEntries((prev) => [newEntry, ...prev]);

      return {
        success: true,
        data: newEntry,
      };
    },
    []
  );

  const deletePassword = useCallback(
    async (id: string): Promise<ServerResponse<string>> => {
      setPendingDeleteId(id);
      const response = await simulateServerRequest<string>({ payload: id });
      setPendingDeleteId(null);

      if (!response.success) {
        return {
          success: false,
          error: response.error,
        };
      }

      setEntries((prev) => prev.filter((entry) => entry.id !== id));

      return { success: true, data: id };
    },
    []
  );

  const resetAll = useCallback(() => {
    setEntries([]);
  }, []);

  return {
    entries,
    isAdding,
    pendingDeleteId,
    addPassword,
    deletePassword,
    resetAll,
  };
}
