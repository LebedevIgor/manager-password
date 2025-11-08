import { PasswordFormValues, ServerResponse } from './password';

export interface PasswordModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    values: PasswordFormValues
  ) => Promise<ServerResponse | ServerResponse<unknown>>;
}
