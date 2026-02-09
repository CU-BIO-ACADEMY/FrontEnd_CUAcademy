"use client";

import { Card, CardBody, Button } from "@heroui/react";

interface PdfViewerCardProps {
    url: string;
    filename?: string;
    preview?: boolean
}

export function PdfViewerCard({ url, filename = "รายชื่อผู้สมัคร.pdf", preview = false }: PdfViewerCardProps) {
    return (
        <Card className="w-full mt-3">
            <CardBody className="p-0 overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                        <i className="fa-regular fa-file-pdf text-lg text-red-400 shrink-0" />
                        <span className="text-sm font-medium text-gray-700 truncate">
                            {filename}
                        </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Button
                            as="a"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            variant="flat"
                            startContent={<i className="fa-regular fa-arrow-up-right-from-square" />}
                        >
                            เปิดในแท็บใหม่
                        </Button>
                        <Button
                            as="a"
                            href={url}
                            download={filename}
                            size="sm"
                            variant="flat"
                            color="primary"
                            startContent={<i className="fa-regular fa-download" />}
                        >
                            ดาวน์โหลด
                        </Button>
                    </div>
                </div>
                {preview && (
                    <iframe
                        src={url}
                        title={filename}
                        className="w-full h-[500px] border-0"
                    />
                )}
            </CardBody>
        </Card>
    );
}
