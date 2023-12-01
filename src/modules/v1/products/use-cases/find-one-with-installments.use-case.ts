import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../products.interface';

type Installment = {
  number: number;
  value: string;
};
type CalculateInstallmentsResult = {
  installments: Installment[];
  totalAmount: string;
};

@Injectable()
export class FindOneWithInstallmentsUseCase {
  constructor(
    @Inject('IProductRepository')
    private repository: IProductRepository,
  ) {}

  async execute(id: number, quantity: number) {
    const product = await this.repository.findOne(id);
    const { price, category } = product;
    const { interest } = category;

    const { installments, totalAmount } = this.calculateInstallments(
      price,
      interest,
      quantity,
    );

    return { ...product, installments, totalAmount };
  }

  private calculateInstallments(
    price: number,
    interestRate: number,
    quantity: number,
  ): CalculateInstallmentsResult {
    const monthlyInterestRate = interestRate / 100;

    const installmentAmount = this.calculateInstallmentAmount(
      price,
      monthlyInterestRate,
      quantity,
    );

    const installments: Installment[] = Array.from(
      { length: quantity },
      (_, index) =>
        this.generateInstallment(index, monthlyInterestRate, installmentAmount),
    );

    const totalAmount = this.calculateTotalAmount(installments);

    return {
      installments,
      totalAmount: this.formatCurrency(totalAmount),
    };
  }

  private calculateInstallmentAmount(
    price: number,
    monthlyInterestRate: number,
    quantity: number,
  ): number {
    return (
      (price * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -quantity))
    );
  }

  private generateInstallment(
    index: number,
    monthlyInterestRate: number,
    installmentAmount: number,
  ): Installment {
    const installmentNumber = index + 1;
    const installmentValue = Math.round(
      installmentAmount * (1 + monthlyInterestRate) ** index,
    );
    const formattedValue = this.formatCurrency(installmentValue);

    return {
      number: installmentNumber,
      value: formattedValue,
    };
  }

  private calculateTotalAmount(installments: Installment[]): number {
    return installments.reduce(
      (total, installment) =>
        total + Number(installment.value.replace('R$', '').replace(',', '')),
      0,
    );
  }

  private formatCurrency(amount: number): string {
    return `R$ ${amount.toFixed(2)}`;
  }
}
