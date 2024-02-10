import 'reflect-metadata';
import { PaymentsError, errorMessages } from './payment-error';
import * as Sentry from '@sentry/node';

export const CustomCatch = () => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof PaymentsError) {
          const errorMessage = errorMessages[error.type] || 'Unknown error';
          Sentry.captureException(errorMessage);
        } else {
          Sentry.captureException(error);
        }
      }
    };

    return descriptor;
  };
};
