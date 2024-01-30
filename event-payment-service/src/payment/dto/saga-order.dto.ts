export class SagaOrderDto {
  sagaId: string;
  userId: number;

  constructor(sagaId: string, userId: number) {
    this.sagaId = sagaId;
    this.userId = userId;
  }
}
