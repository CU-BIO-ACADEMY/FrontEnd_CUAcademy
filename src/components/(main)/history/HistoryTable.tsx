import { Transaction } from "@/types/transaction";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import dayjs from "dayjs";
import { ReactNode } from "react";

interface HistoryTableProps {
    transactions: Transaction[];
    bottomContent: ReactNode;
}

export const HistoryTable = ({ transactions, bottomContent }: HistoryTableProps) => {
    return (
        <Table bottomContent={bottomContent}>
            <TableHeader>
                <TableColumn>จำนวน</TableColumn>
                <TableColumn>ประเภท</TableColumn>
                <TableColumn>ว/ด/ป</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"ไม่มีข้อมูล"} items={transactions}>
                {(item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>
                            {item.transaction_type == "topup" ? "เติมเงิน" : "ใช้เงิน"}
                        </TableCell>
                        <TableCell>{dayjs(item.created_at).format("YYYY-MM-DD")}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
