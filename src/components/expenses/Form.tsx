import type { CategoryOptionProp } from "@/types/category";
import type { FormExpenseProp } from "@/types/expense";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

export default function Form({
  handleSubmit,
  onSubmit,
  register,
  setValue,
  errors,
  buttonName,
  setSelectedCategoryOption,
  selectCategoryOption,
  categoryOptions,
  onCreateCategory,
}: {
  handleSubmit: UseFormHandleSubmit<FormExpenseProp>;
  onSubmit: (data: any) => {};
  register: UseFormRegister<FormExpenseProp>;
  setValue: UseFormSetValue<FormExpenseProp>;
  errors: FieldErrors<FormExpenseProp>;
  buttonName: string;
  setSelectedCategoryOption: Dispatch<
    SetStateAction<CategoryOptionProp | null | undefined>
  >;
  selectCategoryOption: CategoryOptionProp | null | undefined;
  categoryOptions: CategoryOptionProp[] | undefined;
  onCreateCategory: (data: any) => {};
}) {
  const router = useRouter();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="pb-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Category
                </label>
                <div className="mt-2">
                  <CreatableSelect
                    {...register("category")}
                    value={selectCategoryOption}
                    id="category"
                    onChange={(newValue: SingleValue<CategoryOptionProp>) => {
                      if (newValue) {
                        setValue("category", newValue.value);
                        setSelectedCategoryOption({
                          label: newValue.label,
                          value: newValue.value,
                        });
                      }
                    }}
                    options={categoryOptions}
                    onCreateOption={(inputValue) =>
                      onCreateCategory(inputValue)
                    }
                  />
                  <p className="text-sm text-red-500 pl-2 mt-1">
                    {errors.category?.message}
                  </p>
                  {categoryOptions && categoryOptions.length < 1 && (
                    <p className="text-sm pl-2 mt-1">
                      No category found. Please create one{" "}
                      <Link
                        href="/categories/create"
                        className="text-indigo-500"
                      >
                        here
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
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
        </div>
      </form>
    </>
  );
}
