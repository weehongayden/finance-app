export interface CardProp {
  id: number;
  userId: number;
  name: string;
  statementDate: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface CardOptionProp {
  label: string;
  value: number;
  statementDate: number;
};
