declare module '@splidejs/react-splide' {
    import { ComponentType, ReactNode } from 'react';
    import { Options } from '@splidejs/splide';

    export interface SplideProps {
        options?: Options;
        extensions?: Record<string, unknown>;
        transition?: ComponentType;
        hasTrack?: boolean;
        tag?: string;
        children?: ReactNode;
        className?: string;
        [key: string]: any;
    }

    export interface SplideSlideProps {
        children?: ReactNode;
        className?: string;
        [key: string]: any;
    }

    export interface SplideTrackProps {
        children?: ReactNode;
        className?: string;
        [key: string]: any;
    }

    export const Splide: ComponentType<SplideProps>;
    export const SplideSlide: ComponentType<SplideSlideProps>;
    export const SplideTrack: ComponentType<SplideTrackProps>;
}

declare module '@splidejs/react-splide/css' {
    const content: string;
    export default content;
}

declare module '@splidejs/react-splide/css/core' {
    const content: string;
    export default content;
}

declare module '@splidejs/react-splide/css/sea-green' {
    const content: string;
    export default content;
}

declare module '@splidejs/react-splide/css/skyblue' {
    const content: string;
    export default content;
}

declare module '@splidejs/react-splide/css';