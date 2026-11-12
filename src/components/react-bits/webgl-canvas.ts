'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_RESTARTS = 4;

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
    const waiting = useRef(false);
    const queued = useRef(false);
    const restartRef = useRef(() => {});

    // A lost context is discarded. preventDefault would keep the slot reserved
    // until restoreContext(), which this canvas never calls.
    restartRef.current = () => {
        if (releasing.current || queued.current) return;
        const canvas = canvasRef.current;
        const onScreen = !!canvas
            && canvas.isConnected
            && !document.hidden
            && elementOnScreen(canvas);
        if (!onScreen) {
            waiting.current = true;
            attempts.current = 0;
            return;
        }
        if (attempts.current >= MAX_RESTARTS) return;
        queued.current = true;
        requestAnimationFrame(() => {
            queued.current = false;
            if (releasing.current) return;
            const node = canvasRef.current;
            const shown = !!node
                && node.isConnected
                && !document.hidden
                && elementOnScreen(node);
            if (!shown) {
                waiting.current = true;
                attempts.current = 0;
                return;
            }
            if (attempts.current >= MAX_RESTARTS) return;
            attempts.current += 1;
            waiting.current = false;
            setEpoch(value => value + 1);
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        releasing.current = false;
        const onLost = () => {
            if (releasing.current) return;
            restartRef.current();
        };
        const onShown = () => {
            if (waiting.current) restartRef.current();
        };
        const observer = new ResizeObserver(() => {
            if (waiting.current) restartRef.current();
        });
        canvas.addEventListener('webglcontextlost', onLost);
        document.addEventListener('visibilitychange', onShown);
        window.addEventListener('pageshow', onShown);
        observer.observe(canvas);
        return () => {
            releasing.current = true;
            waiting.current = false;
            canvas.removeEventListener('webglcontextlost', onLost);
            document.removeEventListener('visibilitychange', onShown);
            window.removeEventListener('pageshow', onShown);
            observer.disconnect();
        };
    }, [epoch]);

    return { canvasRef, epoch, releasing, restartRef };
}
