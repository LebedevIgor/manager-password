import React, { useState } from 'react';

import { NotificationState, NotificationType } from '../../Types/notification';

import Notification from '../../Components/Notification/Notification';

import styles from './MainPage.module.css';
import { usePasswordStorage } from '../../Hooks/usePasswordStorage';
import SearchBar from '../../Components/SearchBar/SearchBar';
import PasswordList from '../../Components/PasswordList/PasswordList';
import PasswordModal from '../../Components/PasswordModal/PasswordModal';
import {
  PasswordEntry,
  PasswordFormValues,
  ServerResponse,
} from '../../Types/password';

const defaultNotify: NotificationState = {
  type: 'info',
  message: '',
  visible: false,
};

const MainPage: React.FC = () => {
  const { entries, isAdding, pendingDeleteId, addPassword, deletePassword } =
    usePasswordStorage();

  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notify, setNotify] = useState<NotificationState>(defaultNotify);

  const showNotify = (payload: {
    type: NotificationType;
    message: string;
    visible?: boolean;
  }) => {
    setNotify({
      type: payload.type,
      message: payload.message,
      visible: payload.visible ?? true,
    });
  };

  const filterEntries = (entries: PasswordEntry[], term: string) => {
    const normalized = term.trim().toLowerCase();
    if (!normalized) {
      return entries;
    }
    return entries.filter((entry) =>
      entry.service.toLowerCase().includes(normalized)
    );
  };

  const hasCustomCharacters = filterEntries(entries, searchTerm);

  const handleAdd = async (
    values: PasswordFormValues
  ): Promise<ServerResponse<PasswordEntry>> => {
    const response = await addPassword(values);

    if (response.success) {
      showNotify({ type: 'success', message: 'Пароль сохранён' });
    } else {
      showNotify({
        type: 'error',
        message: response.error ?? 'Не удалось сохранить пароль',
      });
    }

    return response;
  };

  const handleDelete = async (id: string) => {
    const response = await deletePassword(id);

    if (response.success) {
      showNotify({ type: 'success', message: 'Пароль удалён' });
    } else {
      showNotify({
        type: 'error',
        message: response.error ?? 'Не удалось удалить пароль',
      });
    }
  };

  const handleCopy = async (password: string) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      showNotify({
        type: 'error',
        message: 'Буфер обмена недоступен в этом окружении',
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(password);
      showNotify({
        type: 'success',
        message: 'Пароль скопирован в буфер обмена',
      });
    } catch (error) {
      console.error('Не удалось скопировать пароль', error);
      showNotify({ type: 'error', message: 'Не удалось скопировать пароль' });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Менеджер паролей</h1>
          <p className={styles.subtitle}>
            Добавляйте сервисы, генерируйте надёжные пароли и управляйте ими в
            одном месте. Все данные сохраняются локально в вашем браузере.
          </p>
          <div className={styles.toolbar}>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => setModalOpen(true)}
            >
              + Добавить пароль
            </button>
            <div className={styles.searchWrapper}>
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
          </div>
        </section>

        <section className={styles.listSection}>
          <header className={styles.listHeader}>
            <h2 className={styles.listTitle}>Сохранённые сервисы</h2>
          </header>
          <PasswordList
            items={hasCustomCharacters}
            onCopy={handleCopy}
            onDelete={handleDelete}
            pendingDeleteId={pendingDeleteId}
          />
        </section>
      </div>

      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
        isSubmitting={isAdding}
      />

      <Notification
        type={notify.type}
        message={notify.message}
        isVisible={notify.visible && Boolean(notify.message)}
        onClose={() => setNotify(defaultNotify)}
      />
    </div>
  );
};

export default MainPage;
