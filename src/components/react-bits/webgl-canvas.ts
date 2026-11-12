'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_RESTARTS = 3;

export function elementOnScreen(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return rect.width > 1
        && rect.height > 1
        && rect.bottom > 0
        && rect.right > 0
        && rect.top < window.innerHeight
        && rect.left < window.innerWidth;
}

export function useWebglCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [epoch, setEpoch] = useState(0);
    const attempts = useRef(0);
    const releasing = useRef(false);
    const restartRef = useRef(() => {});

    restartRef.current = () => {
        if (releasing.current || attempts.current >= MAX_RESTARTS) return;
        attempts.current += 1;
        setEpoch(value => value + 1);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        releasing.current = false;
        const onLost = (event: Event) => {
            event.preventDefault();
            restartRef.current();
        };
        const onPageShow = (event: PageTransitionEvent) => {
            if (event.persisted) restartRef.current();
        };
        canvas.addEventListener('webglcontextlost', onLost);
        window.addEventListener('pageshow', onPageShow);
        return () => {
            releasing.current = true;
            canvas.removeEventListener('webglcontextlost', onLost);
            window.removeEventListener('pageshow', onPageShow);
        };
    }, [epoch]);

    return { canvasRef, epoch, releasing, restartRef };
}
