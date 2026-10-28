import Button from './Button'
import VisualIcon from './ui/VisualIcon'

type PaginationProps = {
  startItem: number
  endItem: number
  totalItems: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ startItem, endItem, totalItems, currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="table-pagination">
      <span>Showing {startItem}–{endItem} of {totalItems}</span>
      <div className="pagination-buttons">
        <Button variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} aria-label="Previous page"><VisualIcon name="chevron-left" size={16}/></Button>
        <span>{String(currentPage).padStart(2,'0')} <span className="pagination-of">/ {String(totalPages).padStart(2,'0')}</span></span>
        <Button variant="ghost" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} aria-label="Next page"><VisualIcon name="chevron-right" size={16}/></Button>
      </div>
    </div>
  )
}
