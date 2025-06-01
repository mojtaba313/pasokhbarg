"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

interface VerticalPaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number, itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

export default function Pagination({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  itemsPerPageOptions = [5, 10, 25, 50],
  className = "",
}: VerticalPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isClosed, setIsClosed] = useState(true);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      // if (page < 1 || page > totalPages || page === currentPage) return;
      console.log("OK");

      // Update URL query parameters
      const query = new URLSearchParams(searchParams.toString());
      query.set("page", String(page));
      router.push(`?${query.toString()}`);

      // Call the callback
      onPageChange(page, itemsPerPage);
    },
    [currentPage, itemsPerPage, onPageChange, router, searchParams, totalPages]
  );

  const handleItemsPerPageChange = useCallback(
    (value: number) => {
      // Reset to first page when changing items per page
      const query = new URLSearchParams(searchParams.toString());
      query.set("limit", String(value));
      query.set("page", "1");
      router.push(`?${query.toString()}`);

      // Call the callback
      onPageChange(1, value);
    },
    [onPageChange, router, searchParams]
  );

  const itemsPerPageOptionsWithLabels = useMemo(
    () =>
      itemsPerPageOptions.map((option) => ({
        label: `${option}`,
        value: option,
      })),
    [itemsPerPageOptions]
  );

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  // if (totalItems <= itemsPerPageOptions[0]) {
  //   return null;
  // }

  const GButton = ({
    pageNumber,
    className,
  }: {
    pageNumber: number;
    className?: string;
  }) => (
    <button
      onClick={() => handlePageChange(pageNumber)}
      className={classNames(
        "no-underline group cursor-pointer relative !rounded-full w-16 h-16 !text-xl p-px font-semibold leading-6 text-white inline-block",
        "[background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.slate.600/.48))_border-box]",
        "border border-transparent animate-border",
        "hover:![--gradient-speed:2s]",
        "!transition-[--gradient-speed transition-all duration-300 ease-in-out",
        className
      )}
      style={{
        // @ts-ignore
        "--border-angle": "0deg",
        "--gradient-speed": "5s",
      }}
    >
      {pageNumber}
    </button>
  );

  return (
    <div
      className={classNames(
        "flex fixed bottom-2 left-1/2 -translate-x-1/2 items-center justify-between gap-4 p-4 rounded-lg",
        className
      )}
    >
      <div className="flex items-center gap-2 *:!text-white">
        {currentPage > 2 && <GButton pageNumber={1} className={"scale-50"} />}
        {currentPage > 1 && (
          <GButton pageNumber={currentPage - 1} className="scale-75" />
        )}
        <GButton pageNumber={currentPage} />
        {totalPages - currentPage > 0 && (
          <GButton pageNumber={currentPage + 1} className="scale-75" />
        )}
        {totalPages - currentPage > 1 && (
          <GButton pageNumber={totalPages} className="scale-50" />
        )}
      </div>
    </div>
  );
}
