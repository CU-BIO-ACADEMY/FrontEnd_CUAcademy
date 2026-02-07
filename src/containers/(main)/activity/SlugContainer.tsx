'use client'
import React, { useEffect, useState } from 'react'
import { api } from '@/services';
import useSWR from 'swr';
import type { Activity } from "@/services/api/ActivityService";
import { Image } from '@heroui/react';

interface SlugContainer{
    id: string;
}

function SlugContainer({ id }: SlugContainer) {
    // const { data, error, isLoading } = useSWR(`/api/activities/${id}`, () => api.activityService.getActivitiesByID(id));
    return (
        <div className='flex flex-col'>
            <Image src={`https://i.pinimg.com/474x/7c/b7/dd/7cb7ddaaab0cb10a19286876ec56b060.jpg`} alt='banner' classNames={{'img':' max-w-none'}} className='w-full aspect-2/1'/>
        </div>
    )
}

export default SlugContainer
