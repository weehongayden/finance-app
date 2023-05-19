import type { CardProp } from "./card";
import type { UserProp } from "./user";

export interface InstallmentProp {
  id: number;
  name: string;
  statementDate: number;
  tenure: number;
  leftoverTenure: number;
  startDate: Date | string;
  endDate: Date;
  amount: number;
  payPerMonth: number;
  user: UserProp;
  card: CardProp;
};

export interface FormInstallmentProp extends Pick<
  InstallmentProp,
  | "tenure"
  | "startDate"
  | "amount"
  | "name"
  | "leftoverTenure"
  | "endDate"
  | "payPerMonth"
> {
  card: number;
};
