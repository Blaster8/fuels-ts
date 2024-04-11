import type { IRawAbiFunctionIO } from './IRawAbiFunction.js';

export interface IRawAbiLoggedTypes extends IRawAbiFunctionIO {
  logId: string;
}
