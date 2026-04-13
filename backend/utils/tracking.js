import { v4 as uuidv4 } from 'uuid';

export const generateTrackingCode = () => {
  return `AST-${uuidv4().split('-')[0].toUpperCase()}`;
};