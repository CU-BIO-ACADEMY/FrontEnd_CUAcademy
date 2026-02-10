import { Input, NumberInput, Textarea, DatePicker, Image, Button } from "@heroui/react";
import { DateValue } from "@internationalized/date";
import { useState } from "react";

export interface ActivityFormData {
    title: string;
    description: string;
    description_short: string;
    max_users: string;
    price: string;
}

export interface AttachmentFile {
    file: File;
    name: string;
}

export interface EventDate {
    id: string;
    eventStartAt: DateValue | null;
    max_users: number | undefined;
    price: number | undefined;
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
    attachments: AttachmentFile[];
    handleAttachmentsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeAttachment: (index: number) => void;
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
    attachments,
    handleAttachmentsChange,
    removeAttachment,
}: FormBodyProps) {
    const [eventDates, setEventDates] = useState<EventDate[]>([
        { id: '1', eventStartAt: null, max_users: undefined, price: undefined }
    ]);

    const addEventDate = () => {
        const newId = (eventDates.length + 1).toString();
        setEventDates([...eventDates, { id: newId, eventStartAt: null, max_users: undefined, price: undefined }]);
    };

    const removeEventDate = (id: string) => {
        if (eventDates.length > 1) {
            setEventDates(eventDates.filter(date => date.id !== id));
        }
    };

    const updateEventDate = (id: string, field: keyof EventDate, value: any) => {
        setEventDates(eventDates.map(date =>
            date.id === id ? { ...date, [field]: value } : date
        ));
    };

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

                {/* วันจัดกิจกรรมหลายวัน */}
                <div className="flex flex-col gap-4">
                    {eventDates.map((eventDate, index) => (
                        <div key={eventDate.id} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-700">
                                    วันจัดกิจกรรม {index + 1}
                                </p>
                                {eventDates.length > 1 && (
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        onClick={() => removeEventDate(eventDate.id)}
                                    >
                                        <i className="fa-solid fa-trash"></i> ลบ
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <DatePicker
                                    label="วันที่จัดกิจกรรม"
                                    className="col-span-2"
                                    value={eventDate.eventStartAt}
                                    onChange={(date) => updateEventDate(eventDate.id, 'eventStartAt', date)}
                                    isRequired
                                    granularity="minute"
                                    hourCycle={24}
                                    hideTimeZone
                                    classNames={{
                                        label: "text-gray-700",
                                        input: "text-gray-900",
                                    }}
                                />
                                <NumberInput
                                    label="จำนวนผู้เข้าร่วมสูงสุด"
                                    className="col-span-1"
                                    value={eventDate.max_users}
                                    onValueChange={(value) => updateEventDate(eventDate.id, 'max_users', value)}
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
                                    className="col-span-1"
                                    value={eventDate.price}
                                    onValueChange={(value) => updateEventDate(eventDate.id, 'price', value)}
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
                        </div>
                    ))}
                </div>

                <div className="w-full sm:w-auto flex justify-end">
                    <Button
                        color="success"
                        variant="faded"
                        onClick={addEventDate}
                    >
                        <i className="fa-solid fa-plus"></i> เพิ่มวันจัดกิจกรรม
                    </Button>
                </div>

                <div className="flex flex-col gap-2">
                    <Input
                        type="file"
                        onChange={handleAttachmentsChange}
                        label="ไฟล์แนบ (สูงสุด 10 ไฟล์)"
                        variant="faded"
                        multiple
                    />
                    {attachments.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                            <p className="text-sm text-gray-600">ไฟล์ที่เลือก ({attachments.length}/10):</p>
                            <div className="flex flex-wrap gap-2">
                                {attachments.map((attachment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
                                    >
                                        <span className="truncate max-w-[150px]">{attachment.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default FormBody
