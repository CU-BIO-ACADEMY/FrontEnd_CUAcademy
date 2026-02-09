"use client";

import { useMemo, useState, useCallback } from "react";
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
} from "@heroui/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/th";
import type { Activity } from "@/services/api/ActivityService";
import { api } from "@/services";
import { toast } from "sonner";

dayjs.locale("th");

interface AdminActivityTableProps {
    activities: Activity[];
    isLoading?: boolean;
    onApproveSuccess?: () => void;
}

type StatusFilter = "all" | "approved" | "pending";

const columns = [
    { key: "title", label: "ชื่อกิจกรรม" },
    { key: "status", label: "สถานะ" },
    { key: "event_date", label: "วันจัดกิจกรรม" },
    { key: "participants", label: "ผู้สมัคร" },
    { key: "price", label: "ราคา" },
    { key: "actions", label: "การดำเนินการ" },
];

const ROWS_PER_PAGE = 10;

export function AdminActivityTable({ activities, isLoading = false, onApproveSuccess }: AdminActivityTableProps) {
    const router = useRouter();
    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [page, setPage] = useState(1);
    const [approvingId, setApprovingId] = useState<string | null>(null);

    const handleApprove = async (activityId: string) => {
        try {
            setApprovingId(activityId);
            await api.activityService.approveActivity(activityId);
            toast.success("อนุมัติกิจกรรมสำเร็จ");
            onApproveSuccess?.();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอนุมัติกิจกรรม");
        } finally {
            setApprovingId(null);
        }
    };

    const filteredActivities = useMemo(() => {
        let filtered = [...activities];

        if (filterValue) {
            filtered = filtered.filter((activity) =>
                activity.title.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((activity) =>
                statusFilter === "approved" ? activity.approved : !activity.approved
            );
        }

        return filtered;
    }, [activities, filterValue, statusFilter]);

    const pages = Math.ceil(filteredActivities.length / ROWS_PER_PAGE);

    const items = useMemo(() => {
        const start = (page - 1) * ROWS_PER_PAGE;
        return filteredActivities.slice(start, start + ROWS_PER_PAGE);
    }, [page, filteredActivities]);

    const onSearchChange = useCallback((value: string) => {
        setFilterValue(value);
        setPage(1);
    }, []);

    const onStatusFilterChange = useCallback((value: StatusFilter) => {
        setStatusFilter(value);
        setPage(1);
    }, []);

    const renderCell = (activity: Activity, columnKey: React.Key) => {
        switch (columnKey) {
            case "title":
                return <span className="font-medium">{activity.title}</span>;
            case "status":
                return (
                    <Chip
                        color={activity.approved ? "success" : "warning"}
                        variant="flat"
                        size="sm"
                    >
                        {activity.approved ? "อนุมัติแล้ว" : "รออนุมัติ"}
                    </Chip>
                );
            case "event_date":
                return dayjs(activity.event_start_at).format("DD/MM/YYYY");
            case "participants":
                return `${activity.users_registered}/${activity.max_users}`;
            case "price":
                return `${activity.price} ฿`;
            case "actions":
                return (
                    <div className="flex gap-2">
                        {!activity.approved && (
                            <Button
                                size="sm"
                                variant="shadow"
                                className="bg-(--pink2) text-white shadow-red-200"
                                isLoading={approvingId === activity.id}
                                isDisabled={approvingId !== null}
                                onPress={() => handleApprove(activity.id)}
                            >
                                อนุมัติ
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="flat"
                            className="text-(--pink2)"
                            onPress={() => router.push(`/admin/${activity.id}`)}
                        >
                            ดูรายละเอียด
                        </Button>
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
                        placeholder="ค้นหาชื่อกิจกรรม..."
                        value={filterValue}
                        onClear={() => onSearchChange("")}
                        onValueChange={onSearchChange}
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
                <span className="text-default-400 text-small">
                    ทั้งหมด {filteredActivities.length} กิจกรรม
                </span>
            </div>
        ),
        [filterValue, statusFilter, filteredActivities.length, onSearchChange, onStatusFilterChange]
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
        <div className="overflow-x-auto">
            <Table
                aria-label="ตารางกิจกรรมทั้งหมด"
                topContent={topContent}
                bottomContent={bottomContent}
                topContentPlacement="outside"
                bottomContentPlacement="outside"
                classNames={{
                    table: "min-w-[700px]",
                }}
                className="p-2"
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key} className="whitespace-nowrap">
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={items}
                    emptyContent="ไม่พบกิจกรรม"
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
    );
}
