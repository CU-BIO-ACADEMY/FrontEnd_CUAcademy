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
    useDisclosure
} from "@heroui/react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { FormatEmailModal } from "@/components/(main)/admin/FormatEmailModal"
import { SlipModal } from "./SlipModal"
import * as XLSX from "xlsx";

export interface Registrant {
    id: string;
    full_name: string;
    email: string;
    school: string;
    education_level: string;
    registered_at: string;
    event_dates: string[];
    status: "pending" | "approved" | "rejected";
    slip_url?: string | null;
    amount?: number;
}

interface MemberRegistrationTableProps {
    registrants: Registrant[];
    isLoading?: boolean;
    onConfirm?: (id: string) => void;
    onReject?: (id: string) => void;
    onSendEmail?: (id: string) => void;
    onSendEmailAll?: (ids: string[]) => void;
    onDelete?: (id: string) => void;
    formatEmail: string;
    activityId: string;
    onEmailTemplateSaved?: (subject: string, body: string) => void;
}

type StatusFilter = "all" | "approved" | "pending";

const columns = [
    { key: "full_name", label: "ชื่อ-นามสกุล", sortable: true },
    { key: "email", label: "อีเมล", sortable: true },
    { key: "school", label: "โรงเรียน", sortable: true },
    { key: "education_level", label: "ระดับชั้น", sortable: true },
    { key: "event_dates", label: "วันที่มาทำกิจกรรม", sortable: false },
    { key: "registered_at", label: "วันที่สมัคร", sortable: true },
    { key: "status", label: "สถานะ", sortable: true },
    { key: "actions", label: "การดำเนินการ", sortable: false },
];

const ROWS_PER_PAGE = 10;

export function MemberRegistrationTable({
    registrants,
    isLoading = false,
    onConfirm,
    onReject,
    onSendEmail,
    onSendEmailAll,
    onDelete,
    formatEmail = "",
    activityId,
    onEmailTemplateSaved,
}: MemberRegistrationTableProps) {
    console.log(registrants);
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
    const [slipTarget, setSlipTarget] = useState<Registrant | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const FormatModal = useDisclosure();
    const slipModal = useDisclosure();

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

    const handleOpenFormatModal = () => {
        FormatModal.onOpen();
    }

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
        const statusLabel: Record<string, string> = {
            approved: "อนุมัติแล้ว",
            pending: "รออนุมัติ",
            rejected: "ปฏิเสธ",
        };

        const data = sortedRegistrants.map((r, i) => ({
            "ลำดับ": i + 1,
            "ชื่อ-นามสกุล": r.full_name,
            "อีเมล": r.email,
            "โรงเรียน": r.school,
            "ระดับชั้น": r.education_level,
            "วันที่มาทำกิจกรรม": r.event_dates
                .map((d) => new Date(d).toLocaleDateString("th-TH"))
                .join(", "),
            "วันที่สมัคร": new Date(r.registered_at).toLocaleDateString("th-TH"),
            "จำนวนเงิน (บาท)": r.amount ?? 0,
            "สถานะ": statusLabel[r.status] ?? r.status,
        }));

        const ws = XLSX.utils.json_to_sheet(data);

        // Auto-fit column widths
        const colWidths = Object.keys(data[0] ?? {}).map((key) => {
            const maxLen = Math.max(
                key.length,
                ...data.map((row) => String(row[key as keyof typeof row] ?? "").length)
            );
            return { wch: maxLen + 2 };
        });
        ws["!cols"] = colWidths;

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
            case "event_dates":
                return (
                    <div className="flex flex-col gap-0.5">
                        {registrant.event_dates.map((date, i) => (
                            <span key={i} className="text-sm">
                                {new Date(date).toLocaleDateString("th-TH")}
                            </span>
                        ))}
                    </div>
                );
            case "registered_at":
                return new Date(registrant.registered_at).toLocaleDateString("th-TH");
            case "status":
                const statusConfig = {
                    approved: { color: "success" as const, label: "อนุมัติแล้ว" },
                    rejected: { color: "danger" as const, label: "ปฏิเสธ" },
                    pending: { color: "warning" as const, label: "รออนุมัติ" },
                };
                const config = statusConfig[registrant.status];
                return (
                    <Chip
                        color={config.color}
                        variant="flat"
                        size="sm"
                    >
                        {config.label}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="flex gap-2">
                        {registrant.status === "pending" && (
                            <>
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
                                <Tooltip content="ปฏิเสธ" color="danger">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        color="danger"
                                        onPress={() => onReject?.(registrant.id)}
                                    >
                                        <i className="fa-solid fa-xmark" />
                                    </Button>
                                </Tooltip>
                            </>
                        )}
                        <Tooltip content={registrant.status === "approved" ? "ส่งอีเมล" : "ต้องอนุมัติก่อนจึงจะส่งอีเมลได้"}>
                            <span>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    isDisabled={registrant.status !== "approved" || formatEmail === ""}
                                    onPress={() => onSendEmail?.(registrant.id)}
                                >
                                    <i className="fa-solid fa-envelope" />
                                </Button>
                            </span>
                        </Tooltip>
                        {/*<Tooltip content="ลบ" color="danger">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="danger"
                                onPress={() => setDeleteTarget(registrant.id)}
                            >
                                <i className="fa-solid fa-trash" />
                            </Button>
                        </Tooltip>*/}
                        <Tooltip content="ดูสลิป">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="secondary"
                                isDisabled={!registrant.slip_url}
                                onPress={() => {
                                    setSlipTarget(registrant);
                                    slipModal.onOpen();
                                }}
                            >
                                <i className="fa-solid fa-file-invoice" />
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
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            startContent={<i className="fa-solid fa-envelope" />}
                            isDisabled={approvedIds.length === 0}
                            onPress={handleOpenFormatModal}
                        >
                           สร้างรูปแบบ Email
                        </Button>
                        <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                startContent={<i className="fa-solid fa-envelope" />}
                                isDisabled={approvedIds.length === 0 || formatEmail === ""}
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
        [searchInput, statusFilter, filteredRegistrants.length,handleOpenFormatModal, onStatusFilterChange, handleExportExcel, approvedIds.length, handleSendEmailAll]
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
                                    <TableCell className={columnKey === "event_dates" ? "" : "whitespace-nowrap"}>
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
            <FormatEmailModal
                isOpen={FormatModal.isOpen}
                onClose={FormatModal.onClose}
                onChange={FormatModal.onOpenChange}
                activityId={activityId}
                onSaved={onEmailTemplateSaved}
            />
            <SlipModal
                isOpen={slipModal.isOpen}
                onClose={() => {
                    slipModal.onClose();
                    setSlipTarget(null);
                }}
                onChange={slipModal.onOpenChange}
                slipUrl={slipTarget?.slip_url ?? null}
                studentName={slipTarget?.full_name ?? ""}
                registeredAt={slipTarget ? new Date(slipTarget.registered_at).toLocaleDateString("th-TH") : ""}
                amount={slipTarget?.amount}
            />
        </>
    );
}
