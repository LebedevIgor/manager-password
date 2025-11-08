import React from 'react';
import styles from './SearchBar.module.css';
import { SearchBarProps } from '../../Types/search-bar';

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        type="search"
        placeholder="Поиск по сервису"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default SearchBar;
