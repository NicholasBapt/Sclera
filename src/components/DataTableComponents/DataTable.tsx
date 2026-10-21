import { useState } from "react";
import Pagination from "../Pagination";
import Table from "./Table";
import TableBody from "./TableBody";
import TableCell from "./TableCell";
import TableHead from "./TableHead";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface DataTableProps {
  columns: string[];
  rows: React.ReactNode[][];
  rowsPerPage?: number;
}

export default function DataTable({
  columns,
  rows,
  rowsPerPage = 10,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(currentPage, safeTotalPages);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const startItem = rows.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + rowsPerPage, rows.length);
  const visibleRows =
    totalPages > 1 ? rows.slice(startIndex, startIndex + rowsPerPage) : rows;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {visibleRows.map((row, rowIndex) => (
            <TableRow key={startIndex + rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {rows.length > rowsPerPage && (
        <Pagination
          startItem={startItem}
          endItem={endItem}
          totalItems={rows.length}
          currentPage={safeCurrentPage}
          totalPages={safeTotalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
