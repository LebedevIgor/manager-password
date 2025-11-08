export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationProps {
  type?: NotificationType;
  message: string;
  isVisible: boolean;
  autoHideDelay?: number;
  onClose: () => void;
}

export type NotificationState = {
  type: NotificationType;
  message: string;
  visible: boolean;
};
