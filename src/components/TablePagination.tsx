import { Button } from "@heroui/react";

interface TablePaginationProps {
    handleNext: () => void;
    handlePrev: () => void;
}

export const TablePagination = ({ handleNext, handlePrev }: TablePaginationProps) => {
    return (
        <div className="flex gap-4">
            <Button onPress={handlePrev}>ก่อนหน้า</Button>
            <Button onPress={handleNext}>ถัดไป</Button>
        </div>
    );
};
