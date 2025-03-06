interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: PaginationControlsProps) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        قبلی
      </button>
      
      <span className="text-sm text-gray-600">
        صفحه {currentPage} از {totalPages}
      </span>
      
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        بعدی
      </button>
    </div>
  );
};

export default PaginationControls;