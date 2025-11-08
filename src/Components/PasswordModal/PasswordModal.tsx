import React, { useEffect, useState } from 'react';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';

import { PasswordModalProps } from '../../Types/passwordModal';
import { PasswordFormValues } from '../../Types/password';

import styles from './PasswordModal.module.css';

const initialValues: PasswordFormValues = {
  service: '',
  password: '',
};

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<PasswordFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setValues(initialValues);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange =
    (field: keyof PasswordFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!values.service.trim()) {
      setError('Укажите название сервиса.');
      return;
    }

    if (!values.password) {
      setError('Введите или сгенерируйте пароль.');
      return;
    }

    const response = await onSubmit({
      service: values.service.trim(),
      password: values.password,
    });

    if (response.success) {
      setValues(initialValues);
      onClose();
    } else {
      setError(response.error ?? 'Не удалось сохранить запись.');
    }
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Добавить сервис</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Название сервиса</span>
            <input
              type="text"
              placeholder="Например, GitHub"
              value={values.service}
              onChange={handleChange('service')}
            />
          </label>

          <label className={styles.field}>
            <span>Пароль</span>
            <input
              type="text"
              placeholder="Введите или сгенерируйте пароль"
              value={values.password}
              onChange={handleChange('password')}
            />
          </label>

          <PasswordGenerator
            onGenerate={(password) =>
              setValues((prev) => ({ ...prev, password }))
            }
          />

          {error && <p className={styles.error}>{error}</p>}

          <footer className={styles.footer}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение…' : 'Сохранить'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
