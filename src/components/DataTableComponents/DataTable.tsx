import { useState, type ReactNode } from 'react'
import Pagination from '../Pagination'

type DataTableProps = {
  columns: string[]
  rows: ReactNode[][]
  rowsPerPage?: number
  emptyLabel?: string
}

export default function DataTable({ columns, rows, rowsPerPage = 10, emptyLabel = 'No records found.' }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const offset = (safePage - 1) * rowsPerPage
  const visibleRows = rows.slice(offset, offset + rowsPerPage)

  return (
    <>
      <div className="table-scroll">
        <table className="data-table">
          <thead><tr>{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>
            {visibleRows.map((row, rowIndex) => <tr key={`${offset + rowIndex}-${String(row[0])}`}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>)}
          </tbody>
        </table>
        {rows.length === 0 && <div className="table-empty">{emptyLabel}</div>}
      </div>
      {rows.length > rowsPerPage && <Pagination startItem={offset + 1} endItem={Math.min(offset + rowsPerPage, rows.length)} totalItems={rows.length} currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </>
  )
}
