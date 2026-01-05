'use client'
import React from 'react'
import { BannerSlide } from '@/components/(main)/main/BannerSlide'
import { Card, CardBody, CardHeader, Avatar, Button } from "@heroui/react"
import { ProfileCard } from '@/components/(main)/profile/profileCard'

function ProfileContainer() {
    return (
        <div className='flex flex-col'>
            <div className='flex gap-2'>
                <div className='w-60'>
                    <ProfileCard email="6834415023@student.chula.ac.th" fullName='Nano wadad' tag={["Nano","fffff","awdv"]}/>
                </div>
                <div className='flex grow bg-red-400 '>
                    <div>

                    </div>
                    <div>

                    </div>
                </div>
            </div>
            <div>
                awdwaf
            </div>
        </div>
    )
}

export default ProfileContainer