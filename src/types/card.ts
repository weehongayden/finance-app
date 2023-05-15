export type CardProp = {
  id: number;
  userId: number;
  name: string;
  statementDate: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CardOptionProp = {
  label: string;
  value: number;
  statementDate: number;
};
