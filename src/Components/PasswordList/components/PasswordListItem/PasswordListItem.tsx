import React, { useState } from 'react';

import { PasswordListItemProps } from '../../../../Types/password-list';

import styles from './PasswordListItem.module.css';

const PasswordListItem: React.FC<PasswordListItemProps> = ({
  entry,
  onCopy,
  onDelete,
  isDeleting,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <li className={styles.item}>
      <div className={styles.header}>
        <div>
          <p className={styles.service}>{entry.service}</p>
          <p className={styles.date}>
            {new Date(entry.createdAt).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            {isPasswordVisible ? 'Скрыть' : 'Показать'}
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => onCopy(entry.password)}
          >
            Копировать
          </button>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={() => onDelete(entry.id)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Удаление…' : 'Удалить'}
          </button>
        </div>
      </div>
      <p className={styles.password}>
        {isPasswordVisible
          ? entry.password
          : '•'.repeat(Math.max(entry.password.length, 8))}
      </p>
    </li>
  );
};

export default PasswordListItem;
