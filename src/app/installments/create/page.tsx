"use client";

import Form from "@/components/installments/Form";
import type { CardOptionProp, CardProp } from "@/types/card";
import type { FormInstallmentProp } from "@/types/installment";
import { create, fetchAll } from "@/utils/fetcher";
import { schema } from "@/utils/validation/installment";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";

export default function Create() {
  const { data: cards, isLoading } = useSWR<CardProp[]>("/api/cards", fetchAll);
  const [selectCardOption, setSelectedCardOption] =
    useState<CardOptionProp | null>();
  const [statementDate, setStatementDate] = useState<number>(1);
  const [cardOptions, setCardOptions] = useState<CardOptionProp[]>([]);
  const {
    register,
    watch,
    reset,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormInstallmentProp>({
    resolver: zodResolver(schema),
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

    if (startDate.date() > statementDate) {
      today.add(1, "months");
    }

    calculateLeftoverTenure = calculateEndDate.diff(today, "months");

    if (startDate.date() >= statementDate) {
      calculateLeftoverTenure++;
    }

    if (calculateLeftoverTenure > watchTenure) {
      calculateLeftoverTenure = watchTenure;
    } else if (calculateEndDate.date() === today.date()) {
      calculateLeftoverTenure--;
    }
  }

  useEffect(() => {
    setCardOptions(() =>
      Array.isArray(cards)
        ? cards.map((card: CardProp) => ({
            label: card.name,
            value: card.id,
            statementDate: card.statementDate,
          }))
        : []
    );
  }, [cards]);

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

  const onSubmit = async () => {
    const res = await create("/api/installments", getValues());
    if (res) {
      reset();
      setSelectedCardOption(null);
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
    <Form
      buttonName={"Create"}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      register={register}
      setValue={setValue}
      setStatementDate={setStatementDate}
      errors={errors}
      endDate={calculateEndDate}
      leftoverTenure={calculateLeftoverTenure}
      pricePerMonth={calculatePricePerMonth}
      selectCardOption={selectCardOption}
      cardOptions={cardOptions}
    />
  );
}
