"use client";

import { CardProp } from "@/app/cards/create/page";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as z from "zod";
import { CardOptionProp } from "../../create/page";
import { InstallmentProp } from "../../page";

const zodSchema = z.object({
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

const getCardData = async () => {
  const res = await fetch("/api/cards");

  if (res.ok) {
    return await res.json();
  }
};

const getInstallmentData = async () => {
  const res = await fetch("/api/installments");

  if (res.ok) {
    return await res.json();
  }
};

export default function Update({ params }: { params: { id: number } }) {
  const [statementDate, setStatementDate] = useState<number>(1);
  const [cardOptions, setCardOptions] = useState<CardOptionProp[]>();
  const [selectedCardOptions, setSelectedCardOptions] =
    useState<CardOptionProp>();
  const router = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<
    Pick<
      InstallmentProp,
      | "name"
      | "tenure"
      | "startDate"
      | "endDate"
      | "amount"
      | "leftoverTenure"
      | "payPerMonth"
      | "endDate"
      | "payPerMonth"
    > & { card: number }
  >({
    resolver: zodResolver(zodSchema),
    mode: "onChange",
  });
  const watchStartDate = watch("startDate");
  const watchTenure = watch("tenure");
  const watchAmount = watch("amount");
  const startDateField = getValues("startDate");
  const startDate = moment(startDateField);

  let calculateEndDate: moment.Moment | undefined = undefined;
  let calculateLeftoverTenure: number | undefined = undefined;
  let calculatePricePerMonth: number | undefined = undefined;

  if (watchAmount && watchTenure) {
    calculatePricePerMonth = watchAmount / watchTenure;
  }

  if (moment(watchStartDate).isValid() && watchTenure) {
    calculateEndDate = moment(watchStartDate, "YYYY-MM-DD")
      .date(statementDate)
      .add(watchTenure, "months")
      .startOf("day");

    if (startDate.date() >= statementDate) {
      calculateEndDate.add(1, "month");
    }
  }

  if (!errors.startDate?.message && calculateEndDate) {
    const today = moment().date(statementDate).startOf("day");

    if (startDate.date() >= statementDate) {
      today.add(1, "months");
    }

    calculateLeftoverTenure = calculateEndDate.diff(today, "months");

    if (startDate.date() >= statementDate) {
      calculateLeftoverTenure++;
    }
  }

  const onSubmit = async () => {
    const res = await fetch(`/api/installments/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(getValues()),
    });

    if (res.ok) {
      const data = await res.json();
      data.startDate = moment(data.startDate).format("YYYY-MM-DD");
      reset(data);
      notify(true, `Record has been updated successfully`);
    } else {
      notify(false, `Failed to update the record`);
    }
  };

  const notify = (status: boolean, message?: string) => {
    if (status) return toast.success(message);
    return toast.error(message);
  };

  useEffect(() => {
    (async () => {
      const data = await getCardData();
      const cardOptions =
        data &&
        data.map((card: CardProp) => ({
          label: card.name,
          value: card.id,
          statementDate: card.statementDate,
        }));
      setCardOptions(cardOptions);
      const installmentData = await getInstallmentData();

      if (installmentData && installmentData.length > 0) {
        const filterData = installmentData.filter(
          (res: InstallmentProp) => res.id === Number(params.id)
        );

        let cardId: number | undefined = undefined;

        const data = filterData.map((res: InstallmentProp) => {
          if (cardOptions && Array.isArray(cardOptions)) {
            const cardDetails: CardOptionProp | undefined = cardOptions.find(
              (option: CardOptionProp) => option.value == res.card.id
            );
            cardId = cardDetails?.value;
            setSelectedCardOptions(cardDetails);
          }

          return {
            name: res.name,
            card: cardId,
            tenure: res.tenure,
            leftoverTenure: res.leftoverTenure,
            startDate: moment(res.startDate).format("YYYY-MM-DD"),
            endDate: res.endDate,
            amount: res.amount,
            payPerMonth: res.payPerMonth,
          };
        })[0];

        reset(data);
      }
    })();
  }, [params.id, reset]);

  useEffect(() => {
    if (calculateEndDate) {
      setValue("endDate", new Date(calculateEndDate.format("YYYY-MM-DD")));
    }

    if (calculatePricePerMonth) {
      setValue("payPerMonth", parseFloat(calculatePricePerMonth.toFixed(2)));
    }

    if (calculateLeftoverTenure) {
      setValue("leftoverTenure", calculateLeftoverTenure);
    }
  }, [
    setValue,
    calculateEndDate,
    calculatePricePerMonth,
    calculateLeftoverTenure,
    watchStartDate,
    watchAmount,
    watchTenure,
  ]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="pb-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="installment-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Installment Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    {...register("name")}
                    type="text"
                    id="installment-name"
                    placeholder="Installment Name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-xs text-red-500">
                    {errors.name?.message}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="card"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Credit Card
                </label>
                <div className="mt-2">
                  <Select
                    {...register("card")}
                    value={selectedCardOptions}
                    id="card"
                    onChange={(newValue: SingleValue<CardOptionProp>) => {
                      if (newValue) {
                        setValue("card", newValue.value);
                        setStatementDate(newValue.statementDate);
                      }
                    }}
                    options={cardOptions}
                  />
                  <p className="text-sm text-red-500 pl-2 mt-1">
                    {errors.card?.message}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="tenure"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tenure Period <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    {...register("tenure", { valueAsNumber: true })}
                    type="number"
                    id="tenure"
                    placeholder="24"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-xs text-red-500">
                    {errors.tenure?.message}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    {...register("startDate", { valueAsDate: true })}
                    type="date"
                    id="startDate"
                    placeholder={moment().format("YYYY-MM-DD")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-xs text-red-500">
                    {errors.startDate?.message}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Total Amount <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    {...register("amount", { valueAsNumber: true })}
                    id="amount"
                    type="text"
                    placeholder="9999.99"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-xs text-red-500">
                    {errors.amount?.message}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pb-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <div>
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-lg font-bold text-gray-800">
                      Summary
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 border border-gray-200 bg-white px-4 py-5 sm:px-6 shadow-sm rounded">
              <label
                htmlFor="end_date"
                className="block text-sm font-medium text-center leading-6 text-gray-900"
              >
                End Date
              </label>
              <div className="text-sm mt-2 text-center">
                {calculateEndDate
                  ? calculateEndDate.format("MMM DD, YYYY")
                  : "—"}

                <span className="block text-xs text-gray-500 mt-2">
                  Based on your credit card statement date
                </span>
              </div>
            </div>

            <div className="sm:col-span-2 border border-gray-200 bg-white px-4 py-5 sm:px-6 shadow-sm rounded">
              <label
                htmlFor="leftover_tenure"
                className="block text-sm font-medium text-center leading-6 text-gray-900"
              >
                Leftover Tenure
              </label>
              <div className="text-sm mt-2 text-center">
                {calculateLeftoverTenure
                  ? calculateLeftoverTenure.toString()
                  : "—"}
              </div>
            </div>

            <div className="sm:col-span-2 border border-gray-200 bg-white px-4 py-5 sm:px-6 shadow-sm rounded">
              <label
                htmlFor="price_per_month"
                className="block text-sm font-medium text-center leading-6 text-gray-900"
              >
                Price Per Month
              </label>
              <div className="text-sm mt-2 text-center">
                {calculatePricePerMonth
                  ? calculatePricePerMonth.toFixed(2)
                  : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 flex items-center justify-end gap-x-6">
          <button
            onClick={() => router.back()}
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Back
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Update
          </button>
        </div>
      </form>
    </>
  );
}
