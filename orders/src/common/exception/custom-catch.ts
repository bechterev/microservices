import 'reflect-metadata';
import { UsersError, userMessagesRecord } from './user.exception';
import { OrderError, orderMessagesRecord } from './order.exception';

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
        let errorMessage = error.message;
        switch (true) {
          case error instanceof UsersError:
            errorMessage = userMessagesRecord[error.type];
            break;

          case error instanceof OrderError:
            errorMessage = orderMessagesRecord[error.type];
            break;

          default:
            break;
        }

        console.error(errorMessage);
      }
    };

    return descriptor;
  };
};
