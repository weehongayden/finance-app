"use client";

import ConfirmationModal from "@/components/ConfirmationModal";
import TableSkeleton from "@/components/TableSkeleton";
import type { InstallmentProp } from "@/types/installment";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import moment from "moment";
import { Copse } from "next/font/google";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchAll, remove } from "../../utils/fetcher";
import { classNames } from "../../utils/util";

const oldStandardTT = Copse({
  weight: "400",
  preload: false,
});

export default function Installment() {
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    useState<boolean>(false);
  const [selectedInstallment, setSelectedInstallment] = useState<{
    id: number;
    name: string;
  }>();
  const [installments, setInstallments] = useState<InstallmentProp[]>([]);
  const { data, mutate, isLoading } = useSWR(
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
            <span className={oldStandardTT.className}>
              {Number(info.row.original.payPerMonth).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="pl-3">SGD</span>
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
          className: `text-center ${oldStandardTT.className}`,
        },
        header: "Tenure",
      },
      {
        cell: (info) => (
          <>
            <span className={oldStandardTT.className}>
              {Number(
                info.row.original.payPerMonth * info.row.original.leftoverTenure
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="pl-3">SGD</span>
          </>
        ),
        meta: {
          className: "text-right",
        },
        header: "Leftover Amount",
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
        cell: (info) => {
          return (
            <>
              <Link href={`/installments/update/${info.row.original.id}`}>
                <PencilSquareIcon
                  className="h-5 w-5 text-indigo-500"
                  aria-hidden="true"
                />
              </Link>
              <div className="px-2"></div>
              <button
                onClick={() => {
                  setOpenConfirmationDialog(!openConfirmationDialog);
                  setSelectedInstallment({
                    id: info.row.original.id,
                    name: info.row.original.name,
                  });
                }}
              >
                <TrashIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </button>
            </>
          );
        },
        meta: {
          className: "flex",
        },
        header: " ",
      },
    ],
    [openConfirmationDialog]
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
  }, [data]);

  const notify = (status: boolean, message?: string) => {
    if (status) return toast.success(message);
    return toast.error(message);
  };

  return (
    <>
      {selectedInstallment &&
        selectedInstallment.id &&
        selectedInstallment.name && (
          <ConfirmationModal
            isOpen={openConfirmationDialog}
            setOpen={setOpenConfirmationDialog}
            title={"Delete installment"}
            message={
              <span>
                Are you sure want to delete <b>{selectedInstallment!.name}</b>?
                <br />
                This action cannot be undone.
              </span>
            }
            action={async () => {
              const res = await remove(
                `/api/installments/${selectedInstallment.id}`
              );
              if (res) {
                notify(
                  true,
                  `${selectedInstallment.name} has been deleted successfully`
                );
                mutate();
              } else {
                notify(false, `Failed to delete the record`);
              }
            }}
          />
        )}
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
                  <TableSkeleton rowSize={8} columnSize={8} />
                ) : data && data.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell, index) => (
                        <td
                          key={cell.id}
                          className={classNames(
                            `${
                              row.getVisibleCells().length !== index + 1
                                ? "border-r-2 border-gray-200 "
                                : ""
                            }whitespace-nowrap p-4 text-sm text-gray-900`,
                            cell.column.columnDef.meta?.className ?? ""
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="whitespace-nowrap p-4 text-sm text-gray-900 text-center"
                      colSpan={8}
                    >
                      No installments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
