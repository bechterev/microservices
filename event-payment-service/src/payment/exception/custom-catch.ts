import 'reflect-metadata';
import { PaymentsError, errorMessages } from './payment-error';

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
          console.error(errorMessage);
        } else {
          console.error(`Command execution error: ${error.message}`);
        }
      }
    };

    return descriptor;
  };
};
