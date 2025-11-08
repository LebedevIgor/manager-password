import React from 'react';

import styles from './PasswordList.module.css';

import { PasswordListProps } from '../../Types/password-list';

import PasswordListItem from './components/PasswordListItem/PasswordListItem';

const PasswordList: React.FC<PasswordListProps> = ({
  items,
  onCopy,
  onDelete,
  pendingDeleteId,
}) => {
  if (items.length === 0) {
    return <p className={styles.empty}>Нет добавленных паролей</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <PasswordListItem
          key={item.id}
          entry={item}
          onCopy={onCopy}
          onDelete={onDelete}
          isDeleting={pendingDeleteId === item.id}
        />
      ))}
    </ul>
  );
};

export default PasswordList;
