import React from 'react'
import { Card, CardBody, CardHeader, CardFooter, Button, Divider } from "@heroui/react"

export interface ActivityFile {
    name: string;
    url: string;
    size: string;
}

interface BodyCardProps{
    disc: string;
    files?: ActivityFile[];
}

const fileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'fa-file-pdf text-red-400';
    if (ext === 'doc' || ext === 'docx') return 'fa-file-word text-blue-400';
    if (ext === 'xls' || ext === 'xlsx') return 'fa-file-excel text-green-400';
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'fa-file-image text-purple-400';
    return 'fa-file text-gray-400';
};

function BodyCard({ disc, files }:BodyCardProps) {
  return (
    <Card className="flex-2 h-max">
        <CardHeader className="flex text-2xl font-semibold px-6 pt-5 pb-0">
            รายละเอียดกิจกรรม
        </CardHeader>

        <CardBody className="indent-10 px-6 text-gray-600 leading-relaxed">
            {disc}
        </CardBody>

        {files && files.length > 0 && (
            <>
                <Divider />
                <CardFooter className="flex flex-col items-start gap-3 px-6 py-4">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <i className="fa-regular fa-paperclip text-[var(--pink2)]" />
                        ไฟล์แนบ ({files.length})
                    </h4>
                    <div className="w-full flex flex-col gap-2">
                        {files.map((file, index) => (
                            <a
                                key={index}
                                href={file.url}
                                download
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-[var(--secondary)] hover:border-[var(--pink1)] transition-colors group"
                            >
                                <div className="shrink-0 w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-[var(--pink1)] transition-colors">
                                    <i className={`fa-regular ${fileIcon(file.name)} text-lg`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {file.size}
                                    </p>
                                </div>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="text-gray-400 group-hover:text-[var(--pink2)]"
                                    as="span"
                                >
                                    <i className="fa-regular fa-download text-base" />
                                </Button>
                            </a>
                        ))}
                    </div>
                </CardFooter>
            </>
        )}
    </Card>
  )
}

export default BodyCard
