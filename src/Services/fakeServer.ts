import { ServerResponse } from '../Types/password';

const MIN_DELAY = 400;
const MAX_DELAY = 1200;

type SimulateOptions<T> = {
  payload: T;
  successProbability?: number;
};

export function simulateServerRequest<T>({
  payload,
  successProbability = 0.5,
}: SimulateOptions<T>): Promise<ServerResponse<T>> {
  return new Promise((resolve) => {
    const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
    setTimeout(() => {
      const success = Math.random() < successProbability;
      if (success) {
        resolve({ success: true, data: payload });
      } else {
        resolve({
          success: false,
          error: 'Сервер отклонил запрос. Попробуйте ещё раз.',
        });
      }
    }, delay);
  });
}
