import { api } from "@/services";
import { Button } from "@heroui/react";
import { Fragment, useState } from "react";
import { toast } from "sonner";

export const PaymentUploadContainer = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("กรุณาเลือกไฟล์และระบุจำนวนเงิน");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("qrcode", selectedFile);

            const result = await api.paymentService.topup(formData);

            toast.success(result.message);

            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error("Upload error:", error);

            toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัพโหลด");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">อัพโหลดหลักฐานการโอน</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-(--pink1) file:text-white hover:file:bg-(--pink2) cursor-pointer"
                />
            </div>
            {previewUrl && (
                <div className="w-full">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                    />
                </div>
            )}
            <Button color="primary" className="w-full" isDisabled={!selectedFile} onPress={handleUpload} isLoading={loading}>
                <i className="fa-solid fa-upload"></i>
                ยืนยันการเติมเงิน
            </Button>
        </Fragment>
    );
};
