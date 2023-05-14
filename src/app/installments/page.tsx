"use client";

import TableSkeleton from "@/components/TableSkeleton";
import "@tanstack/react-table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import moment from "moment";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { fetchAll } from "../../utils/fetcher";
import { classNames } from "../../utils/util";

export type InstallmentProp = {
  id: number;
  name: string;
  statementDate: number;
  tenure: number;
  leftoverTenure: number;
  startDate: Date;
  endDate: Date;
  amount: number;
  payPerMonth: number;
  user: UserProp;
  card: CardProp;
};

export type CardProp = {
  id: number;
  userId: number;
  name: string;
  statementDate: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProp = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Installment() {
  const [installments, setInstallments] = useState<InstallmentProp[]>([]);
  const { data, error, isLoading } = useSWR(
    "/api/installments",
    fetchAll<InstallmentProp>
  );

  const headers = useMemo<ColumnDef<InstallmentProp>[]>(
    () => [
      {
        header: "Name",
        cell: (info) => info.row.original.name,
      },
      {
        header: "Pay Per Month",
        cell: (info) => (
          <>
            <span className="pr-3">SGD</span>
            <span>
              {Number(info.row.original.payPerMonth).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </>
        ),
        meta: {
          className: "text-right",
        },
      },
      {
        cell: (info) =>
          `${info.row.original.leftoverTenure} / ${info.row.original.tenure}`,
        meta: {
          className: "text-center",
        },
        header: "Tenure",
      },
      {
        cell: (info) =>
          moment(info.row.original.startDate).format("MMM DD, YYYY"),
        meta: {
          className: "text-right",
        },
        header: "Start Date",
      },
      {
        cell: (info) =>
          moment(info.row.original.endDate).format("MMM DD, YYYY"),
        meta: {
          className: "text-right",
        },
        header: "End Date",
      },
      {
        cell: (info) => (
          <>
            <span className="pr-3">SGD</span>
            <span>
              {Number(
                info.row.original.payPerMonth * info.row.original.leftoverTenure
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </>
        ),
        meta: {
          className: "text-right",
        },
        header: "Leftover Amount",
      },
      {
        cell: (info) => {
          const now = moment();
          const updatedDate = moment().date(
            info.row.original.card.statementDate
          );

          if (now.date() >= 15) {
            updatedDate.add(1, "month");
          }

          return updatedDate.format("MMM DD, YYYY");
        },
        header: "Upcoming Statement Date",
      },
    ],
    []
  );

  const table = useReactTable({
    data: installments,
    columns: headers,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setInstallments(() =>
        data.filter((installment) => installment.user.id === 1)
      );
    }

    console.log("Installment: ", installments);
  }, [installments, data]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Installments
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the installments that you&apos;re currently bind with
            your account including the installment name, amount to pay per
            month, total amount and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/installments/create"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Installment
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="py-3.5 p-4 text-left text-sm font-semibold text-gray-900"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <TableSkeleton rowSize={10} columnSize={7} />
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={classNames(
                            "whitespace-nowrap p-4 text-sm text-gray-900",
                            cell.column.columnDef.meta?.className ?? ""
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                      <td className="flex whitespace-nowrap p-4 text-sm text-gray-900">
                        <button
                          type="button"
                          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Edit
                        </button>
                        <div className="px-1"></div>
                        <button
                          type="button"
                          className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
