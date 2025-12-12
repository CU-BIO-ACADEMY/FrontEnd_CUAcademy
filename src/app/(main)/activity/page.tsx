"use client"
import React from "react"
import { Button } from "@heroui/react"

export default function Activity() {
  return (
    <div className={`h-full w-full overflow-auto p-4 relative`}>
        <div className={`flex justify-between`}>
            <h3 className="text-3xl">กิจกรรม</h3>
            <Button color={`success`} className={`text-white`} variant={`shadow`}>เพิ่มกิจกรรม</Button>
        </div>
        <p></p>
    </div>
  );
}
