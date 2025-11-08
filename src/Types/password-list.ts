import { PasswordEntry } from './password';

export interface PasswordListProps {
  items: PasswordEntry[];
  onCopy: (password: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  pendingDeleteId: string | null;
}

export interface PasswordListItemProps {
  entry: PasswordEntry;
  onCopy: (password: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  isDeleting: boolean;
}
