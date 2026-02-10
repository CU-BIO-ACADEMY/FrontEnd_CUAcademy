import React from 'react'
import { Modal, ModalContent, ModalBody, ModalHeader,ModalFooter, UseDisclosureProps, Image } from "@heroui/react"

interface SlipModalProps extends UseDisclosureProps{
    date: string;
    name: string;
}

export function SlipModal(props: SlipModalProps) {
  return (
    <Modal onOpenChange={props.onChange} isOpen={props.isOpen} onClose={props.onClose}>
          <ModalContent>
              <ModalHeader>สลิปการชำระเงิน</ModalHeader>
              <ModalBody>
                    <div  className=' w-full flex items-center justify-center'>
                      <Image className=' w-80 aspect-2/3 object-fill' alt={`slip`} src={`https://i.pinimg.com/1200x/3a/54/ad/3a54ad116e0bef7cf2ff53e55d80087a.jpg`} />
                    </div>
              </ModalBody>
              <ModalFooter>
                  <p><span className="font-semibold">ชื่อ:</span> {props.name}</p>
                  <p><span className="font-semibold">วันที่:</span> {props.date}</p>
              </ModalFooter>
          </ModalContent>
    </Modal>
  )
}
