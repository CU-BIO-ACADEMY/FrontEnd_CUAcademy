import { Input, NumberInput, Textarea, DatePicker, Image, Button } from "@heroui/react";
import { DateValue, CalendarDateTime } from "@internationalized/date";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState, useCallback } from "react";

// Schema สำหรับแต่ละรอบกิจกรรม - ตรงกับ backend
const scheduleSchema = z.object({
    event_start_at: z.date(),
    price: z.number().min(0, { message: "ค่าสมัครต้องมากกว่าหรือเท่ากับ 0" }),
    max_users: z.number().min(1, { message: "จำนวนผู้เข้าร่วมต้องมีอย่างน้อย 1 คน" }),
});

// Schema สำหรับฟอร์มสร้างกิจกรรม
export const createActivityFormSchema = z.object({
    title: z.string().min(1, { message: "ชื่อกิจกรรมต้องมีอย่างน้อย 1 ตัวอักษร" }),
    description: z.string().min(1, { message: "รายละเอียดกิจกรรมต้องมีอย่างน้อย 1 ตัวอักษร" }),
    description_short: z.string().min(1, { message: "คำอธิบายสั้นต้องมีอย่างน้อย 1 ตัวอักษร" }),
    registration_open_at: z.date(),
    registration_close_at: z.date(),
    schedules: z.array(scheduleSchema).min(1, { message: "ต้องมีอย่างน้อย 1 รอบ" }),
    thumbnail: z.instanceof(File, { message: "โปรดเลือกรูปภาพหลัก" }),
    attachments: z.array(z.instanceof(File)),
});

export type CreateActivityFormData = z.infer<typeof createActivityFormSchema>;

// Interface สำหรับส่งข้อมูลกลับไป parent
export interface ActivityFormSubmitData {
    title: string;
    description: string;
    description_short: string;
    registration_open_at: string;
    registration_close_at: string;
    schedules: {
        event_start_at: string;
        price: number;
        max_users: number;
    }[];
    thumbnail: File;
    attachments: File[];
}

interface FormBodyProps {
    onSubmit: (data: ActivityFormSubmitData) => void;
    isLoading?: boolean;
}

// Helper function แปลง DateValue เป็น Date
const dateValueToDate = (dateValue: DateValue): Date => {
    return new Date(dateValue.year, dateValue.month - 1, dateValue.day, 
        'hour' in dateValue ? (dateValue as unknown as { hour: number }).hour : 0, 
        'minute' in dateValue ? (dateValue as unknown as { minute: number }).minute : 0);
};

// Helper function แปลง Date เป็น CalendarDateTime
const dateToCalendarDateTime = (date: Date | null): CalendarDateTime | null => {
    if (!date) return null;
    return new CalendarDateTime(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes()
    );
};

function FormBody({ onSubmit, isLoading }: FormBodyProps) {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CreateActivityFormData>({
        resolver: zodResolver(createActivityFormSchema),
        defaultValues: {
            schedules: [
                { event_start_at: undefined as unknown as Date, price: 0, max_users: 1 }
            ],
            attachments: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "schedules",
    });

    const thumbnail = useWatch({ control, name: "thumbnail" });
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    
    const attachments = useWatch({ control, name: "attachments" });

    const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleAttachmentsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const currentAttachments = attachments || [];
            const combined = [...currentAttachments, ...newFiles];
            setValue("attachments", combined.slice(0, 10));
        }
    }, [attachments, setValue]);

    const removeAttachment = useCallback((index: number) => {
        const currentAttachments = attachments || [];
        setValue("attachments", currentAttachments.filter((_, i) => i !== index));
    }, [attachments, setValue]);

    const addEventDate = () => {
        append({ event_start_at: undefined as unknown as Date, price: 0, max_users: 1 });
    };

    const removeEventDate = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    const handleFormSubmit = (data: CreateActivityFormData) => {
        const submitData: ActivityFormSubmitData = {
            title: data.title,
            description: data.description,
            description_short: data.description_short,
            registration_open_at: data.registration_open_at.toISOString(),
            registration_close_at: data.registration_close_at.toISOString(),
            schedules: data.schedules.map(schedule => ({
                event_start_at: schedule.event_start_at.toISOString(),
                price: schedule.price,
                max_users: schedule.max_users,
            })),
            thumbnail: data.thumbnail,
            attachments: data.attachments,
        };
        onSubmit(submitData);
    };

    return (
        <form id="create-activity-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
            {/* Thumbnail */}
            <div className="flex flex-col gap-2">
                {thumbnailPreview && (
                    <Image
                        src={thumbnailPreview}
                        alt="Preview"
                        className="w-80 object-cover rounded-lg aspect-3/2"
                        classNames={{wrapper:" w-full !max-w-none flex justify-center"}}
                    />
                )}
                <Controller
                    name="thumbnail"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleThumbnailChange(e, onChange)}
                            label="รูปภาพหลัก"
                            isRequired
                            variant="faded"
                            isInvalid={!!errors.thumbnail}
                            errorMessage={errors.thumbnail?.message}
                        />
                    )}
                />
            </div>
            
            <Input
                label="ชื่อกิจกรรม"
                placeholder="กรอกชื่อกิจกรรม"
                isRequired
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
                classNames={{
                    label: "text-gray-700",
                    input: "text-gray-900",
                }}
                {...register("title")}
            />
            
            <Textarea
                label="คำอธิบายสั้น"
                placeholder="กรอกคำอธิบายสั้นๆ"
                isRequired
                minRows={2}
                isInvalid={!!errors.description_short}
                errorMessage={errors.description_short?.message}
                classNames={{
                    label: "text-gray-700",
                    input: "text-gray-900",
                }}
                {...register("description_short")}
            />
            
            <Textarea
                label="รายละเอียดกิจกรรม"
                placeholder="กรอกรายละเอียดกิจกรรม"
                isRequired
                minRows={4}
                isClearable
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                classNames={{
                    label: "text-gray-700",
                    input: "text-gray-900 resize-y min-h-[40px]",
                }}
                {...register("description")}
            />
            
            <div className="grid md:grid-cols-2 gap-4">
                <Controller
                    name="registration_open_at"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label="วันที่เปิดรับสมัคร"
                            value={dateToCalendarDateTime(field.value)}
                            onChange={(date) => field.onChange(date ? dateValueToDate(date) : null)}
                            isRequired
                            isInvalid={!!errors.registration_open_at}
                            errorMessage={errors.registration_open_at?.message}
                            granularity="minute"
                            hourCycle={24}
                            hideTimeZone
                            classNames={{
                                label: "text-gray-700",
                                input: "text-gray-900",
                            }}
                        />
                    )}
                />
                <Controller
                    name="registration_close_at"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label="วันที่ปิดรับสมัคร"
                            value={dateToCalendarDateTime(field.value)}
                            onChange={(date) => field.onChange(date ? dateValueToDate(date) : null)}
                            isRequired
                            isInvalid={!!errors.registration_close_at}
                            errorMessage={errors.registration_close_at?.message}
                            granularity="minute"
                            hourCycle={24}
                            hideTimeZone
                            classNames={{
                                label: "text-gray-700",
                                input: "text-gray-900",
                            }}
                        />
                    )}
                />
            </div>

            {/* วันจัดกิจกรรมหลายวัน */}
            <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700">
                                วันจัดกิจกรรม {index + 1}
                            </p>
                            {fields.length > 1 && (
                                <Button
                                    size="sm"
                                    color="danger"
                                    variant="light"
                                    onPress={() => removeEventDate(index)}
                                >
                                    <i className="fa-solid fa-trash"></i> ลบ
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Controller
                                name={`schedules.${index}.event_start_at`}
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="วันที่จัดกิจกรรม"
                                        className="col-span-2"
                                        value={dateToCalendarDateTime(field.value)}
                                        onChange={(date) => field.onChange(date ? dateValueToDate(date) : null)}
                                        isRequired
                                        isInvalid={!!errors.schedules?.[index]?.event_start_at}
                                        errorMessage={errors.schedules?.[index]?.event_start_at?.message}
                                        granularity="minute"
                                        hourCycle={24}
                                        hideTimeZone
                                        classNames={{
                                            label: "text-gray-700",
                                            input: "text-gray-900",
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name={`schedules.${index}.max_users`}
                                control={control}
                                render={({ field }) => (
                                    <NumberInput
                                        label="จำนวนผู้เข้าร่วมสูงสุด"
                                        className="col-span-1"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        placeholder="0"
                                        isRequired
                                        min={1}
                                        isInvalid={!!errors.schedules?.[index]?.max_users}
                                        errorMessage={errors.schedules?.[index]?.max_users?.message}
                                        inputMode="numeric"
                                        classNames={{
                                            label: "text-gray-700",
                                            input: "text-gray-900",
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name={`schedules.${index}.price`}
                                control={control}
                                render={({ field }) => (
                                    <NumberInput
                                        label="ค่าสมัคร (บาท)"
                                        className="col-span-1"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        placeholder="0"
                                        isRequired
                                        min={0}
                                        isInvalid={!!errors.schedules?.[index]?.price}
                                        errorMessage={errors.schedules?.[index]?.price?.message}
                                        inputMode="numeric"
                                        classNames={{
                                            label: "text-gray-700",
                                            input: "text-gray-900",
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full sm:w-auto flex justify-end">
                <Button
                    color="success"
                    variant="faded"
                    onPress={addEventDate}
                    isDisabled={isLoading}
                >
                    <i className="fa-solid fa-plus"></i> เพิ่มวันจัดกิจกรรม
                </Button>
            </div>

            {/* Attachments */}
            <div className="flex flex-col gap-2">
                <Input
                    type="file"
                    onChange={handleAttachmentsChange}
                    label="ไฟล์แนบ (สูงสุด 10 ไฟล์)"
                    variant="faded"
                    multiple
                />
                {(attachments?.length ?? 0) > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                        <p className="text-sm text-gray-600">ไฟล์ที่เลือก ({attachments?.length}/10):</p>
                        <div className="flex flex-wrap gap-2">
                            {attachments?.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
                                >
                                    <span className="truncate max-w-[150px]">{file.name}</span>
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
        </form>
    )
}

export default FormBody
