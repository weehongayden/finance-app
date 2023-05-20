import type { CategoryOptionProp, CategoryProp } from "@/types/category";
import type { FormExpenseProp } from "@/types/expense";
import { remove } from "@/utils/fetcher";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { ActionMeta, SingleValue, SingleValueProps } from "react-select";
import { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import ConfirmationModal from "../ConfirmationModal";

export default function Form({
  handleSubmit,
  onSubmit,
  register,
  control,
  errors,
  buttonName,
  setSelectedCategoryOption,
  selectCategoryOption,
  categoryOptions,
  onCreateCategory,
  onMutate,
  onNotify,
}: {
  handleSubmit: UseFormHandleSubmit<FormExpenseProp>;
  onSubmit: () => {};
  register: UseFormRegister<FormExpenseProp>;
  control: Control<FormExpenseProp, any>;
  errors: FieldErrors<FormExpenseProp>;
  buttonName: string;
  setSelectedCategoryOption: Dispatch<
    SetStateAction<CategoryOptionProp | null | undefined>
  >;
  setValue: UseFormSetValue<FormExpenseProp>;
  selectCategoryOption: CategoryOptionProp | null | undefined;
  categoryOptions: CategoryOptionProp[] | undefined;
  onCreateCategory: (data: string) => {};
  onMutate: () => {};
  onNotify: (isOpen: boolean, message: string) => {};
}) {
  const [selectedValue, setSelectedValue] = useState<CategoryProp>();
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    useState<boolean>(false);
  const router = useRouter();

  const SingleValueLabel = ({
    children,
    ...props
  }: SingleValueProps<CategoryOptionProp>) => {
    return (
      <components.SingleValue {...props}>
        {props.data.label}
      </components.SingleValue>
    );
  };

  const formatOptionLabel = (option: CategoryOptionProp) => {
    return (
      <div className="flex justify-between">
        <span>{option.label}</span>
        {!option.label.includes("Create") && (
          <div className="flex items-center">
            <Link href={`/categories/update/${option.value}`}>
              <PencilSquareIcon
                className="h-5 w-5 text-indigo-500"
                aria-hidden="true"
              />
            </Link>
            <div className="px-1"></div>
            <button
              onClick={() => {
                setOpenConfirmationDialog(!openConfirmationDialog);
                setSelectedValue({
                  id: option.value,
                  name: option.label,
                });
              }}
            >
              <TrashIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {openConfirmationDialog && (
        <ConfirmationModal
          isOpen={openConfirmationDialog}
          setOpen={setOpenConfirmationDialog}
          title={"Delete installment"}
          message={
            <span>
              Are you sure want to delete <b>{selectedValue?.name}</b>?
              <br />
              This action cannot be undone.
            </span>
          }
          action={async () => {
            const res = await remove(`/api/categories/${selectedValue?.id}`);
            if (res) {
              onNotify(
                true,
                `${selectedValue?.name} has been deleted successfully`
              );
              setSelectedCategoryOption(null);
              onMutate();
            } else {
              onNotify(false, `Failed to delete the record`);
            }
          }}
        />
      )}
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
                  <Controller
                    {...register("category")}
                    control={control}
                    render={({ field }) => (
                      <CreatableSelect
                        {...field}
                        value={selectCategoryOption}
                        id="category"
                        components={{
                          NoOptionsMessage: () => null,
                          SingleValue: SingleValueLabel,
                        }}
                        formatOptionLabel={formatOptionLabel}
                        onChange={(newValue: SingleValue<any>) => {
                          if (newValue) {
                            field.onChange(newValue);
                            setSelectedCategoryOption({
                              label: newValue.label,
                              value: newValue.value,
                            });
                          }
                        }}
                        onCreateOption={(inputValue: string) =>
                          onCreateCategory(inputValue)
                        }
                        options={categoryOptions}
                      />
                    )}
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
