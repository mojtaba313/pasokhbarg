// components/ChapterSummaryTable.tsx
"use client";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface ChapterSummary {
  chapter: string;
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  percentage: number;
}

interface ChapterSummaryTableProps {
  chapters: ChapterSummary[];
}

export default function ChapterSummaryTable({
  chapters,
}: ChapterSummaryTableProps) {
  const percentageBodyTemplate = (rowData: ChapterSummary) => {
    return `${rowData.percentage.toFixed(2)}%`;
  };

  return (
    <div className="card mt-4 pr-3">
      <DataTable
        value={chapters}
        sortField="percentage"
        sortOrder={-1}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        className="glass-panel [direction:rtl]"
        rowClassName={() => "dark:!bg-gray-800 dark:hover:!bg-gray-700"}
        tableClassName={"*:!bg-slate-900"}
        cellClassName={()=>'text-center'}
      >
        <Column field="chapter" header="فصل" sortable></Column>
        <Column field="correct" header="صحیح" sortable></Column>
        <Column field="incorrect" header="غلط" sortable></Column>
        <Column field="unanswered" header="نزده" sortable></Column>
        <Column
          field="percentage"
          header="درصد"
          sortable
          body={percentageBodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
}
