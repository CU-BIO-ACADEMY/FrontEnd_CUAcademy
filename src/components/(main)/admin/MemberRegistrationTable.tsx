"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Chip,
    Pagination,
    Tooltip,
    SortDescriptor,
} from "@heroui/react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import * as XLSX from "xlsx";

export interface Registrant {
    id: string;
    full_name: string;
    email: string;
    school: string;
    education_level: string;
    registered_at: string;
    status: "pending" | "approved";
}

interface MemberRegistrationTableProps {
    registrants: Registrant[];
    isLoading?: boolean;
    onConfirm?: (id: string) => void;
    onSendEmail?: (id: string) => void;
    onSendEmailAll?: (ids: string[]) => void;
    onDelete?: (id: string) => void;
}

type StatusFilter = "all" | "approved" | "pending";

const columns = [
    { key: "full_name", label: "ชื่อ-นามสกุล", sortable: true },
    { key: "email", label: "อีเมล", sortable: true },
    { key: "school", label: "โรงเรียน", sortable: true },
    { key: "education_level", label: "ระดับชั้น", sortable: true },
    { key: "registered_at", label: "วันที่สมัคร", sortable: true },
    { key: "status", label: "สถานะ", sortable: true },
    { key: "actions", label: "การดำเนินการ", sortable: false },
];

const ROWS_PER_PAGE = 10;

export function MemberRegistrationTable({
    registrants,
    isLoading = false,
    onConfirm,
    onSendEmail,
    onSendEmailAll,
    onDelete,
}: MemberRegistrationTableProps) {
    const [searchInput, setSearchInput] = useState("");
    const [debouncedFilter, setDebouncedFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "registered_at",
        direction: "descending",
    });
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        debounceRef.current = setTimeout(() => {
            setDebouncedFilter(searchInput);
            setPage(1);
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchInput]);

    const filteredRegistrants = useMemo(() => {
        let filtered = [...registrants];

        if (debouncedFilter) {
            const search = debouncedFilter.toLowerCase();
            filtered = filtered.filter(
                (r) =>
                    r.full_name.toLowerCase().includes(search) ||
                    r.email.toLowerCase().includes(search) ||
                    r.school.toLowerCase().includes(search)
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((r) => r.status === statusFilter);
        }

        return filtered;
    }, [registrants, debouncedFilter, statusFilter]);

    const sortedRegistrants = useMemo(() => {
        const sorted = [...filteredRegistrants];
        const { column, direction } = sortDescriptor;

        if (!column) return sorted;

        sorted.sort((a, b) => {
            const key = column as keyof Registrant;
            const aVal = a[key] ?? "";
            const bVal = b[key] ?? "";

            let cmp = 0;
            if (typeof aVal === "string" && typeof bVal === "string") {
                cmp = aVal.localeCompare(bVal, "th");
            }

            return direction === "descending" ? -cmp : cmp;
        });

        return sorted;
    }, [filteredRegistrants, sortDescriptor]);

    const pages = Math.ceil(sortedRegistrants.length / ROWS_PER_PAGE);

    const items = useMemo(() => {
        const start = (page - 1) * ROWS_PER_PAGE;
        return sortedRegistrants.slice(start, start + ROWS_PER_PAGE);
    }, [page, sortedRegistrants]);

    const onStatusFilterChange = useCallback((value: StatusFilter) => {
        setStatusFilter(value);
        setPage(1);
    }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        onDelete?.(deleteTarget);
        setIsDeleting(false);
        setDeleteTarget(null);
    };

    const approvedIds = useMemo(
        () => registrants.filter((r) => r.status === "approved").map((r) => r.id),
        [registrants]
    );

    const handleSendEmailAll = useCallback(() => {
        if (approvedIds.length > 0) {
            onSendEmailAll?.(approvedIds);
        }
    }, [approvedIds, onSendEmailAll]);

    const handleExportExcel = useCallback(() => {
        const data = sortedRegistrants.map((r) => ({
            "ชื่อ-นามสกุล": r.full_name,
            "อีเมล": r.email,
            "โรงเรียน": r.school,
            "ระดับชั้น": r.education_level,
            "วันที่สมัคร": new Date(r.registered_at).toLocaleDateString("th-TH"),
            "สถานะ": r.status === "approved" ? "อนุมัติแล้ว" : "รออนุมัติ",
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ผู้สมัคร");
        XLSX.writeFile(wb, "registrants.xlsx");
    }, [sortedRegistrants]);

    const renderCell = (registrant: Registrant, columnKey: React.Key) => {
        switch (columnKey) {
            case "full_name":
                return <span className="font-medium">{registrant.full_name}</span>;
            case "email":
                return <span className="text-sm text-gray-600">{registrant.email}</span>;
            case "school":
                return registrant.school;
            case "education_level":
                return registrant.education_level;
            case "registered_at":
                return new Date(registrant.registered_at).toLocaleDateString("th-TH");
            case "status":
                return (
                    <Chip
                        color={registrant.status === "approved" ? "success" : "warning"}
                        variant="flat"
                        size="sm"
                    >
                        {registrant.status === "approved" ? "อนุมัติแล้ว" : "รออนุมัติ"}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="flex gap-2">
                        {registrant.status === "pending" && (
                            <Tooltip content="อนุมัติ">
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="flat"
                                    color="success"
                                    onPress={() => onConfirm?.(registrant.id)}
                                >
                                    <i className="fa-solid fa-check" />
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip content={registrant.status === "pending" ? "ต้องอนุมัติก่อนจึงจะส่งอีเมลได้" : "ส่งอีเมล"}>
                            <span>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    isDisabled={registrant.status === "pending"}
                                    onPress={() => onSendEmail?.(registrant.id)}
                                >
                                    <i className="fa-solid fa-envelope" />
                                </Button>
                            </span>
                        </Tooltip>
                        <Tooltip content="ลบ" color="danger">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="danger"
                                onPress={() => setDeleteTarget(registrant.id)}
                            >
                                <i className="fa-solid fa-trash" />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return null;
        }
    };

    const topContent = useMemo(
        () => (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="ค้นหาชื่อ, อีเมล, โรงเรียน..."
                        value={searchInput}
                        onClear={() => setSearchInput("")}
                        onValueChange={setSearchInput}
                        variant="bordered"
                        startContent={<i className="fa-solid fa-magnifying-glass text-default-400" />}
                    />
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            size="sm"
                            variant={statusFilter === "all" ? "shadow" : "flat"}
                            className={statusFilter === "all" ? "bg-(--pink2) text-white" : ""}
                            onPress={() => onStatusFilterChange("all")}
                        >
                            ทั้งหมด
                        </Button>
                        <Button
                            size="sm"
                            color={statusFilter === "approved" ? "success" : "default"}
                            variant={statusFilter === "approved" ? "shadow" : "flat"}
                            onPress={() => onStatusFilterChange("approved")}
                        >
                            อนุมัติแล้ว
                        </Button>
                        <Button
                            size="sm"
                            color={statusFilter === "pending" ? "warning" : "default"}
                            variant={statusFilter === "pending" ? "shadow" : "flat"}
                            onPress={() => onStatusFilterChange("pending")}
                        >
                            รออนุมัติ
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        ทั้งหมด {filteredRegistrants.length} คน
                    </span>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            startContent={<i className="fa-solid fa-envelope" />}
                            isDisabled={approvedIds.length === 0}
                            onPress={handleSendEmailAll}
                        >
                            ส่งอีเมลทั้งหมด ({approvedIds.length})
                        </Button>
                        <Button
                            size="sm"
                            variant="flat"
                            color="success"
                            startContent={<i className="fa-solid fa-file-excel" />}
                            onPress={handleExportExcel}
                        >
                            Export Excel
                        </Button>
                    </div>
                </div>
            </div>
        ),
        [searchInput, statusFilter, filteredRegistrants.length, onStatusFilterChange, handleExportExcel, approvedIds.length, handleSendEmailAll]
    );

    const bottomContent = useMemo(
        () =>
            pages > 0 ? (
                <div className="py-2 px-2 flex justify-between items-center">
                    <span className="text-small text-default-400">
                        หน้า {page} จาก {pages}
                    </span>
                    <Pagination
                        isCompact
                        showControls
                        color="secondary"
                        page={page}
                        total={pages}
                        onChange={setPage}
                    />
                </div>
            ) : null,
        [page, pages]
    );

    return (
        <>
            <div className="overflow-x-auto">
                <Table
                    aria-label="ตารางผู้สมัครกิจกรรม"
                    topContent={topContent}
                    bottomContent={bottomContent}
                    topContentPlacement="outside"
                    bottomContentPlacement="outside"
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    classNames={{
                        table: "min-w-[800px]",
                    }}
                    className="p-2"
                >
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn
                                key={column.key}
                                className="whitespace-nowrap"
                                allowsSorting={column.sortable}
                            >
                                {column.label}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody
                        items={items}
                        emptyContent="ไม่พบผู้สมัคร"
                        isLoading={isLoading}
                        loadingContent={<div className="text-gray-500">กำลังโหลด...</div>}
                    >
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell className="whitespace-nowrap">
                                        {renderCell(item, columnKey)}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmModal
                isOpen={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="ยืนยันการลบ"
                message="คุณต้องการลบผู้สมัครรายนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
                confirmText="ลบ"
                confirmColor="danger"
                isLoading={isDeleting}
            />
        </>
    );
}
