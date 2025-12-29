'use client'
import React from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Image } from '@heroui/react';

export function BannerSlide({ images }: {images:string[]}) {
    return (
        <div className='w-full h-full'>
            <Splide 
                className='h-auto max-h-60 w-full rounded-md overflow-hidden' 
                options={{ 
                    rewind: true,
                    arrows: false,
                    autoplay: true,
                    interval: 3000,
                    speed: 1000,
                    type: 'slide',
                    pagination: true,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    resetProgress: false,
                }} 
                aria-label="Banner Slider"
            >
                {images.map((item, index) => (
                    <SplideSlide key={index} className="w-full">
                        <Image src={item} classNames={{wrapper: `max-w-none!`}} radius='none' className='h-full w-full aspect-4/1'/>
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    )
}