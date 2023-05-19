import type { CategoryProp } from "./category";
import type { UserProp } from "./user";

export interface ExpenseProp {
  id: number;
  name: string;
  amount: number;
  user: UserProp;
  category: CategoryProp;
};

export interface FormExpenseProp extends Pick<
  ExpenseProp,
  | "amount"
  | "name"
> {
  category: number;
};
