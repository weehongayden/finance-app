"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as z from "zod";

export type CardProp = {
  id: number;
  name: string;
  statementDate: number;
};

const schema = z.object({
  name: z.string().trim().min(1, "Installment cannot be blank"),
  statementDate: z
    .number({
      required_error: "Statement Date cannot be blank",
    })
    .min(1, "Statement Date cannot smaller than 1")
    .max(31, "Statement Date cannot greater than 31"),
});

export default function Create() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CardProp>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<CardProp> = async (data) => {
    const res = await fetch("/api/cards", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      reset();
      notify(true, `Record has been created successfully`);
    } else {
      notify(false, `Failed to create the record`);
    }
  };

  const notify = (status: boolean, message?: string) => {
    if (status) return toast.success(message);
    return toast.error(message);
  };

  return (
    <div className="max-w-7xl">
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
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              <div className="col-span-1">
                <span className="block text-sm text-gray-500">
                  Any card name for differentiation of the card that is
                  associated with the installment.
                </span>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="card-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Card Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    {...register("name")}
                    type="text"
                    id="card-name"
                    placeholder="Card Name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-xs text-red-500">
                    {errors.name?.message}
                  </span>
                </div>
              </div>

              <div className="col-span-1">
                <span className="block text-sm text-gray-500">
                  Used to calculate the leftover tenure and send email to notify
                  about the installment payment
                </span>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="statement-date"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Statement Date <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    {...register("statementDate", { valueAsNumber: true })}
                    type="text"
                    id="statement-date"
                    placeholder="Statement Date (1 ~ 31)"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-xs text-red-500">
                    {errors.name?.message}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
