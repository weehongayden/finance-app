import { CardProp } from "./card";
import { UserProp } from "./user";

export type InstallmentProp = {
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

export type FormInstallmentProp = Pick<
  InstallmentProp,
  | "tenure"
  | "startDate"
  | "amount"
  | "name"
  | "leftoverTenure"
  | "endDate"
  | "payPerMonth"
> & {
  card: number;
};
