import moment from "moment";
import * as z from "zod";

export const schema = z.object({
  name: z.string().trim().min(1, "Installment cannot be blank"),
  amount: z
    .number({
      required_error: "Amount cannot be blank",
      invalid_type_error: "Amount must be number",
    })
    .positive()
    .min(0),
});

const updateSchema = z.object({
  name: z.string().trim().min(1, "Installment cannot be blank"),
  amount: z
    .number({
      required_error: "Amount cannot be blank",
      invalid_type_error: "Amount must be number",
    })
    .positive()
    .min(0),
});
