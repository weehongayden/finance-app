import type { CardOptionProp } from "@/types/card";
import type { FormInstallmentProp } from "@/types/installment";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { SingleValue } from "react-select";
import Select from "react-select";

export default function Form({
  handleSubmit,
  onSubmit,
  register,
  setValue,
  setStatementDate,
  errors,
  buttonName,
  endDate,
  leftoverTenure,
  pricePerMonth,
  selectCardOption,
  cardOptions,
}: {
  handleSubmit: UseFormHandleSubmit<FormInstallmentProp>;
  onSubmit: () => {};
  register: UseFormRegister<FormInstallmentProp>;
  setValue: UseFormSetValue<FormInstallmentProp>;
  setStatementDate: Dispatch<SetStateAction<number>>;
  errors: FieldErrors<FormInstallmentProp>;
  buttonName: string;
  endDate: moment.Moment | undefined;
  leftoverTenure: number | undefined;
  pricePerMonth: number | undefined;
  selectCardOption: CardOptionProp | null | undefined;
  cardOptions: CardOptionProp[] | undefined;
}) {
  const router = useRouter();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="pb-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    {...register("name")}
                    type="text"
                    id="name"
                    placeholder="Name"
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
                  Card
                </label>
                <div className="mt-2">
                  <Select
                    {...register("card")}
                    value={selectCardOption}
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
                  {cardOptions && cardOptions.length < 1 && (
                    <p className="text-sm pl-2 mt-1">
                      No credit card found. Please create one{" "}
                      <Link href="/cards/create" className="text-indigo-500">
                        here
                      </Link>
                    </p>
                  )}
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
                  Amount <span className="text-red-500">*</span>
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
                {endDate ? endDate.format("MMM DD, YYYY") : "—"}
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
                {leftoverTenure ? leftoverTenure.toString() : "—"}
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
                {pricePerMonth ? pricePerMonth.toFixed(2) : "—"}
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
            {buttonName}
          </button>
        </div>
      </form>
    </>
  );
}
