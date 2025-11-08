import React, { useEffect } from 'react';
import styles from './Notification.module.css';
import { NotificationProps } from '../../Types/notification';

const Notification: React.FC<NotificationProps> = ({
  type = 'info',
  message,
  isVisible,
  autoHideDelay = 4000,
  onClose,
}) => {
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = setTimeout(onClose, autoHideDelay);
    return () => clearTimeout(timer);
  }, [isVisible, autoHideDelay, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.wrapper} ${styles[type]}`} role="status">
      <span>{message}</span>
      <button type="button" onClick={onClose} className={styles.closeButton}>
        ×
      </button>
    </div>
  );
};

export default Notification;
