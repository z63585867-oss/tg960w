'use client';

interface PaginationProps { page: number; totalPages: number; onPageChange: (page: number) => void; }

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 32 }}>
      {page > 1 && <button onClick={() => onPageChange(page-1)} className="btn btn-line btn-sm">上一页</button>}
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i+1} onClick={() => onPageChange(i+1)} className={`btn btn-sm ${page===i+1 ? "btn-red" : "btn-line"}`}>{i+1}</button>
      ))}
      {page < totalPages && <button onClick={() => onPageChange(page+1)} className="btn btn-line btn-sm">下一页</button>}
    </div>
  );
}
