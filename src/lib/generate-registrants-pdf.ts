import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { KANIT_REGULAR_BASE64 } from "@/lib/fonts/kanit-regular";
import type { ActivityDetail, RegisteredUser } from "@/services/api/ActivityService";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

const educationLevelMap: Record<number, string> = {
    1: "ม. 1",
    2: "ม. 2",
    3: "ม. 3",
    4: "ม. 4",
    5: "ม. 5",
    6: "ม. 6",
};

interface RegistrantRow {
    index: number;
    fullName: string;
    school: string;
    educationLevel: string;
    foodAllergies: string;
    eventDates: string[];
    status: string;
}

function collectRegistrants(data: ActivityDetail): RegistrantRow[] {
    const studentMap = new Map<
        string,
        {
            fullName: string;
            school: string;
            educationLevel: string;
            foodAllergies: string;
            eventDates: string[];
            statuses: string[];
        }
    >();

    data.schedules.forEach((schedule) => {
        schedule.registered_users.forEach((user: RegisteredUser) => {
            if (!user.student_info) return;

            const studentId = user.student_information_id;
            const existing = studentMap.get(studentId);

            if (existing) {
                if (!existing.eventDates.includes(schedule.event_start_at)) {
                    existing.eventDates.push(schedule.event_start_at);
                }
                existing.statuses.push(user.payment_status);
            } else {
                studentMap.set(studentId, {
                    fullName: `${user.student_info.prefix} ${user.student_info.full_name}`,
                    school: user.student_info.school,
                    educationLevel:
                        educationLevelMap[user.student_info.education_level] ??
                        `ม. ${user.student_info.education_level}`,
                    foodAllergies: user.student_info.food_allergies || "-",
                    eventDates: [schedule.event_start_at],
                    statuses: [user.payment_status],
                });
            }
        });
    });

    let index = 1;
    return Array.from(studentMap.values()).map((student) => {
        const hasApproved = student.statuses.some((s) => s === "approved");
        const allRejected = student.statuses.every((s) => s === "rejected");

        let status: string;
        if (hasApproved) status = "อนุมัติ";
        else if (allRejected) status = "ปฏิเสธ";
        else status = "รอดำเนินการ";

        return {
            index: index++,
            fullName: student.fullName,
            school: student.school,
            educationLevel: student.educationLevel,
            foodAllergies: student.foodAllergies,
            eventDates: student.eventDates,
            status,
        };
    });
}

function setupThaiFont(doc: jsPDF): void {
    doc.addFileToVFS("Kanit-Regular.ttf", KANIT_REGULAR_BASE64);
    doc.addFont("Kanit-Regular.ttf", "Kanit", "normal");
    doc.addFont("Kanit-Regular.ttf", "Kanit", "bold");
    doc.setFont("Kanit");
}

export function generateRegistrantsPdf(data: ActivityDetail): string {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    setupThaiFont(doc);

    // Title
    doc.setFontSize(18);
    doc.text(`รายชื่อผู้สมัคร - ${data.title}`, 14, 18);

    // Generated date
    doc.setFontSize(10);
    doc.text(`สร้างเมื่อ: ${dayjs().format("D MMMM YYYY HH:mm น.")}`, 14, 26);

    // Summary
    const totalRegistered = data.users_registered;
    const totalCapacity = data.schedules.reduce((sum, s) => sum + s.max_users, 0);
    doc.text(`จำนวนผู้สมัครทั้งหมด: ${totalRegistered} / ${totalCapacity} คน`, 14, 32);

    // Collect data
    const rows = collectRegistrants(data);

    // Table
    autoTable(doc, {
        startY: 38,
        head: [["#", "ชื่อ-นามสกุล", "โรงเรียน", "ระดับชั้น", "แพ้อาหาร", "วันที่สมัคร", "สถานะ"]],
        body: rows.map((r) => [
            r.index,
            r.fullName,
            r.school,
            r.educationLevel,
            r.foodAllergies,
            r.eventDates.map((d) => dayjs(d).format("D MMM YYYY")).join(", "),
            r.status,
        ]),
        styles: {
            font: "Kanit",
            fontSize: 10,
        },
        headStyles: {
            fillColor: [236, 72, 153], // pink-500
            font: "Kanit",
            fontSize: 11,
        },
        alternateRowStyles: {
            fillColor: [253, 242, 248], // pink-50
        },
        columnStyles: {
            0: { cellWidth: 12, halign: "center" },
            3: { cellWidth: 22, halign: "center" },
            6: { cellWidth: 28, halign: "center" },
        },
    });

    return doc.output("datauristring");
}

export function downloadRegistrantsPdf(data: ActivityDetail): void {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    setupThaiFont(doc);

    doc.setFontSize(18);
    doc.text(`รายชื่อผู้สมัคร - ${data.title}`, 14, 18);

    doc.setFontSize(10);
    doc.text(`สร้างเมื่อ: ${dayjs().format("D MMMM YYYY HH:mm น.")}`, 14, 26);

    const totalRegistered = data.users_registered;
    const totalCapacity = data.schedules.reduce((sum, s) => sum + s.max_users, 0);
    doc.text(`จำนวนผู้สมัครทั้งหมด: ${totalRegistered} / ${totalCapacity} คน`, 14, 32);

    const rows = collectRegistrants(data);

    autoTable(doc, {
        startY: 38,
        head: [["#", "ชื่อ-นามสกุล", "โรงเรียน", "ระดับชั้น", "แพ้อาหาร", "วันที่สมัคร", "สถานะ"]],
        body: rows.map((r) => [
            r.index,
            r.fullName,
            r.school,
            r.educationLevel,
            r.foodAllergies,
            r.eventDates.map((d) => dayjs(d).format("D MMM YYYY")).join(", "),
            r.status,
        ]),
        styles: {
            font: "Kanit",
            fontSize: 10,
        },
        headStyles: {
            fillColor: [236, 72, 153],
            font: "Kanit",
            fontSize: 11,
        },
        alternateRowStyles: {
            fillColor: [253, 242, 248],
        },
        columnStyles: {
            0: { cellWidth: 12, halign: "center" },
            3: { cellWidth: 22, halign: "center" },
            6: { cellWidth: 28, halign: "center" },
        },
    });

    doc.save(`รายชื่อผู้สมัคร-${data.title}.pdf`);
}
