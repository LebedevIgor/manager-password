export type CaseMode = 'lower' | 'upper' | 'mixed';

export interface PasswordGeneratorProps {
  onGenerate?: (password: string) => void;
}

export interface AlphabetOptions {
  useLetters: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  caseMode: CaseMode;
  customCharacters: string;
}
