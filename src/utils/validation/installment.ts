import moment from "moment";
import * as z from "zod";

export const schema = z.object({
  name: z.string().trim().min(1, "Installment cannot be blank"),
  tenure: z
    .number({
      required_error: "Tenure period cannot be blank",
      invalid_type_error: "Tenure period must be number",
    })
    .gte(0, "Tenure period must be a greater than 0"),
  startDate: z
    .date({
      required_error: "Start Date name cannot be blank",
      invalid_type_error: "The date format is incorrect",
    })
    .refine(
      (value) => {
        const currentDate = moment();
        const selectedDate = moment(value);
        return selectedDate.isSameOrBefore(currentDate, "day");
      },
      {
        message: "Start date cannot be later than the current date",
      }
    ),
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
  tenure: z
    .number({
      required_error: "Tenure period cannot be blank",
      invalid_type_error: "Tenure period must be number",
    })
    .gte(0, "Tenure period must be a greater than 0"),
  startDate: z
    .date({
      required_error: "Start Date name cannot be blank",
      invalid_type_error: "The date format is incorrect",
    })
    .refine(
      (value) => {
        const currentDate = moment();
        const selectedDate = moment(value);
        return selectedDate.isSameOrBefore(currentDate, "day");
      },
      {
        message: "Start date cannot be later than the current date",
      }
    ),
  amount: z
    .number({
      required_error: "Amount cannot be blank",
      invalid_type_error: "Amount must be number",
    })
    .positive()
    .min(0),
});
