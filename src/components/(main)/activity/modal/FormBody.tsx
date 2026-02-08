import { Input, NumberInput, Textarea, DatePicker, Image } from "@heroui/react";
import { DateValue } from "@internationalized/date";

export interface ActivityFormData {
    title: string;
    description: string;
    description_short: string;
    max_users: string;
    price: string;
}

interface FormBodyProps {
    thumbnailPreview: string | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    registrationOpenAt: DateValue | null;
    setRegistrationOpenAt: (date: DateValue | null) => void;
    registrationCloseAt: DateValue | null;
    setRegistrationCloseAt: (date: DateValue | null) => void;
    eventStartAt: DateValue | null;
    setEventStartAt: (date: DateValue | null) => void;
}

function FormBody({
    thumbnailPreview,
    handleFileChange,
    registrationOpenAt,
    setRegistrationOpenAt,
    registrationCloseAt,
    setRegistrationCloseAt,
    eventStartAt,
    setEventStartAt,
}: FormBodyProps) {
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    {thumbnailPreview && (
                        <Image
                            src={thumbnailPreview}
                            alt="Preview"
                            className="w-80 object-cover rounded-lg aspect-3/2"
                            classNames={{wrapper:" w-full !max-w-none flex justify-center"}}
                        />
                    )}
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        label="รูปภาพหลัก"
                        isRequired
                        variant="faded"
                    />
                </div>
                <Input
                    label="ชื่อกิจกรรม"
                    name="title"
                    placeholder="กรอกชื่อกิจกรรม"
                    isRequired
                    classNames={{
                        label: "text-gray-700",
                        input: "text-gray-900",
                    }}
                />
                <Textarea
                    label="คำอธิบายสั้น"
                    name="description_short"
                    placeholder="กรอกคำอธิบายสั้นๆ"
                    isRequired
                    minRows={2}
                    classNames={{
                        label: "text-gray-700",
                        input: "text-gray-900",
                    }}
                />
                <Textarea
                    label="รายละเอียดกิจกรรม"
                    name="description"
                    placeholder="กรอกรายละเอียดกิจกรรม"
                    isRequired
                    minRows={4}
                    isClearable
                    classNames={{
                        label: "text-gray-700",
                        input: "text-gray-900 resize-y min-h-[40px]",
                    }}
                />
                <div className="grid md:grid-cols-2 gap-4">
                    <NumberInput
                        label="จำนวนผู้เข้าร่วมสูงสุด"
                        name="max_users"
                        type="number"
                        placeholder="0"
                        isRequired
                        min={1}
                        inputMode="numeric"
                        classNames={{
                            label: "text-gray-700",
                            input: "text-gray-900",
                        }}
                    />
                    <NumberInput
                        label="ค่าสมัคร (บาท)"
                        name="price"
                        type="number"
                        placeholder="0"
                        isRequired
                        min={0}
                        inputMode="numeric"
                        classNames={{
                            label: "text-gray-700",
                            input: "text-gray-900",
                        }}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <DatePicker
                        label="วันที่เปิดรับสมัคร"
                        value={registrationOpenAt}
                        onChange={setRegistrationOpenAt}
                        isRequired
                        granularity="minute"
                        hourCycle={24}
                        hideTimeZone
                        classNames={{
                            label: "text-gray-700",
                            input: "text-gray-900",
                        }}
                    />
                    <DatePicker
                        label="วันที่ปิดรับสมัคร"
                        value={registrationCloseAt}
                        onChange={setRegistrationCloseAt}
                        isRequired
                        granularity="minute"
                        hourCycle={24}
                        hideTimeZone
                        classNames={{
                            label: "text-gray-700",
                            input: "text-gray-900",
                        }}
                    />
                </div>
                <DatePicker
                    label="วันที่จัดกิจกรรม"
                    value={eventStartAt}
                    onChange={setEventStartAt}
                    isRequired
                    granularity="minute"
                    hourCycle={24}
                    hideTimeZone
                    classNames={{
                        label: "text-gray-700",
                        input: "text-gray-900",
                    }}
                />
            </div>
        </>
    )
}

export default FormBody
