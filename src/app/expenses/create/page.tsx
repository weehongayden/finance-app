"use client";

import Form from "@/components/expenses/Form";
import type { CategoryOptionProp, CategoryProp } from "@/types/category";
import type { FormExpenseProp } from "@/types/expense";
import { create, fetchAll } from "@/utils/fetcher";
import { schema } from "@/utils/validation/expense";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";

export default function Create() {
  const {
    data: categories,
    isLoading,
    mutate,
  } = useSWR<CategoryProp[]>("/api/categories", fetchAll);
  const [selectCategoryOption, setSelectedCategoryOption] =
    useState<CategoryOptionProp | null>();
  const [categoryOptions, setCategoryOptions] = useState<CategoryOptionProp[]>(
    []
  );
  const {
    register,
    reset,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormExpenseProp>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    setCategoryOptions(() =>
      Array.isArray(categories)
        ? categories.map((category: CategoryProp) => ({
            label: category.name,
            value: category.id,
          }))
        : []
    );
  }, [categories]);

  const onCreateCategory = async (value: string) => {
    const res: CategoryProp = await create("/api/categories", { name: value });
    if (res) {
      setSelectedCategoryOption({
        label: res.name,
        value: res.id,
      });
      setCategoryOptions((prev) => [
        ...prev,
        { label: res.name, value: res.id },
      ]);
      notify(true, `Category has been created successfully`);
    } else {
      notify(false, `Failed to create the category`);
    }
  };

  const onSubmit = async () => {
    const res = await create("/api/expenses", getValues());
    if (res) {
      reset();
      setSelectedCategoryOption(null);
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
    <>
      <Form
        buttonName={"Create"}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        setValue={setValue}
        control={control}
        errors={errors}
        setSelectedCategoryOption={setSelectedCategoryOption}
        selectCategoryOption={selectCategoryOption}
        categoryOptions={categoryOptions}
        onCreateCategory={onCreateCategory}
        onMutate={mutate}
        onNotify={notify}
      />
    </>
  );
}
