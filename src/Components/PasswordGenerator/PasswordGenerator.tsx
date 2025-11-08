import React, { useState } from 'react';

import styles from './PasswordGenerator.module.css';

import {
  AlphabetOptions,
  CaseMode,
  PasswordGeneratorProps,
} from '../../Types/pasword-generate';

const LETTERS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const LETTERS_UPPER = LETTERS_LOWER.toUpperCase();
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>/?';

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  onGenerate,
}) => {
  const [length, setLength] = useState(12);
  const [useLetters, setUseLetters] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [caseMode, setCaseMode] = useState<CaseMode>('mixed');
  const [customCharacters, setCustomCharacters] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const hasCustomCharacters = customCharacters.trim().length > 0;

  const buildAlphabet = ({
    useLetters,
    useNumbers,
    useSymbols,
    caseMode,
    customCharacters,
  }: AlphabetOptions) => {
    const trimmedCustom = customCharacters.trim();
    if (trimmedCustom) {
      return trimmedCustom;
    }

    let alphabet = '';

    if (useLetters) {
      if (caseMode === 'lower') {
        alphabet += LETTERS_LOWER;
      } else if (caseMode === 'upper') {
        alphabet += LETTERS_UPPER;
      } else {
        alphabet += LETTERS_LOWER + LETTERS_UPPER;
      }
    }

    if (useNumbers) {
      alphabet += NUMBERS;
    }

    if (useSymbols) {
      alphabet += SYMBOLS;
    }

    return alphabet;
  };

  const handleGenerate = () => {
    const pool = buildAlphabet({
      useLetters,
      useNumbers,
      useSymbols,
      caseMode,
      customCharacters,
    });

    if (!pool) {
      setError('Выберите хотя бы один набор символов.');
      setGeneratedPassword('');
      return;
    }

    setError(null);
    const password = Array.from(
      { length },
      () => pool[Math.floor(Math.random() * pool.length)]
    ).join('');

    setGeneratedPassword(password);
    onGenerate?.(password);
  };

  const handleCopy = async () => {
    if (!generatedPassword) {
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(generatedPassword);
    } catch (copyError) {
      console.error('Не удалось скопировать пароль', copyError);
    }
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h3 className={styles.title}>Генератор паролей</h3>
        <p className={styles.subtitle}>
          Настройте параметры и автоматически подставьте пароль в форму.
        </p>
      </header>

      <div className={styles.controls}>
        <label className={styles.control}>
          <span>Длина пароля</span>
          <input
            type="number"
            min={4}
            max={64}
            value={length}
            onChange={(event) =>
              setLength(Math.min(64, Math.max(4, Number(event.target.value))))
            }
          />
        </label>

        <fieldset className={styles.fieldset}>
          <legend>Символы</legend>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={useLetters}
              onChange={(event) => setUseLetters(event.target.checked)}
              disabled={hasCustomCharacters}
            />
            Буквы
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(event) => setUseNumbers(event.target.checked)}
              disabled={hasCustomCharacters}
            />
            Цифры
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(event) => setUseSymbols(event.target.checked)}
              disabled={hasCustomCharacters}
            />
            Спецсимволы
          </label>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Регистр букв</legend>
          <label className={styles.checkbox}>
            <input
              type="radio"
              name="case-mode"
              value="lower"
              checked={caseMode === 'lower'}
              onChange={() => setCaseMode('lower')}
              disabled={hasCustomCharacters || !useLetters}
            />
            Нижний регистр
          </label>
          <label className={styles.checkbox}>
            <input
              type="radio"
              name="case-mode"
              value="upper"
              checked={caseMode === 'upper'}
              onChange={() => setCaseMode('upper')}
              disabled={hasCustomCharacters || !useLetters}
            />
            Верхний регистр
          </label>
          <label className={styles.checkbox}>
            <input
              type="radio"
              name="case-mode"
              value="mixed"
              checked={caseMode === 'mixed'}
              onChange={() => setCaseMode('mixed')}
              disabled={hasCustomCharacters || !useLetters}
            />
            Случайный регистр
          </label>
        </fieldset>

        <label className={styles.control}>
          <span>Пользовательский набор символов</span>
          <textarea
            placeholder="Введите любые символы"
            value={customCharacters}
            onChange={(event) => setCustomCharacters(event.target.value)}
            rows={2}
          />
          <span className={styles.hint}>
            При заполнении этого поля переключатели выше отключаются и не влияют
            на генерацию.
          </span>
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.generateButton}
          onClick={handleGenerate}
        >
          Сгенерировать
        </button>
        <div className={styles.result}>
          <input
            type="text"
            readOnly
            value={generatedPassword}
            placeholder="Пароль появится здесь"
          />
          <button
            type="button"
            className={styles.copyButton}
            onClick={handleCopy}
            disabled={!generatedPassword}
          >
            Копировать
          </button>
        </div>
      </div>
    </section>
  );
};

export default PasswordGenerator;
