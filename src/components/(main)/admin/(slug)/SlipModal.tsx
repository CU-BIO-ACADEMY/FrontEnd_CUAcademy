import React from 'react'
import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Image, Button } from "@heroui/react"

interface SlipModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChange?: (isOpen: boolean) => void;
    slipUrl: string | null;
    studentName: string;
    registeredAt: string;
    amount?: number;
}

export function SlipModal(props: SlipModalProps) {
    const hasSlip = props.slipUrl && props.slipUrl.length > 0;

    return (
        <Modal onOpenChange={props.onChange} isOpen={props.isOpen} onClose={props.onClose} size="lg">
            <ModalContent>
                <ModalHeader>สลิปการชำระเงิน</ModalHeader>
                <ModalBody>
                    {hasSlip ? (
                        <div className="w-full flex items-center justify-center">
                            <Image 
                                className="w-full max-w-md object-contain" 
                                alt="slip" 
                                src={props.slipUrl!} 
                            />
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center py-12 text-gray-500">
                            <i className="fa-solid fa-receipt text-6xl mb-4 text-gray-300" />
                            <p>ไม่พบสลิปการชำระเงิน</p>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter className="flex-col items-start gap-2">
                    <p><span className="font-semibold">ชื่อผู้สมัคร:</span> {props.studentName}</p>
                    <p><span className="font-semibold">วันที่สมัคร:</span> {props.registeredAt}</p>
                    {props.amount !== undefined && (
                        <p><span className="font-semibold">จำนวนเงิน:</span> {props.amount.toLocaleString()} ฿</p>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
