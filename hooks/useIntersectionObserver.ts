import { useState, useEffect, RefObject } from 'react';

interface ObserverOptions {
    threshold?: number;
    root?: Element | null;
    rootMargin?: string;
}

/**
 * Custom hook to detect when an element is visible in the viewport.
 * @param elementRef Ref to the element to observe.
 * @param options IntersectionObserver options.
 * @returns A boolean indicating if the element is intersecting.
 */
function useIntersectionObserver(
    elementRef: RefObject<Element>,
    options: ObserverOptions = {}
): boolean {
    const { threshold = 0.1, root = null, rootMargin = '0%' } = options;
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = elementRef.current;

        // Ensure the browser supports IntersectionObserver
        if (!element || typeof window.IntersectionObserver === 'undefined') {
            // Fallback for older browsers: just set to true
            if (!isIntersecting) setIsIntersecting(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Once it's intersecting, we update the state and stop observing
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.unobserve(element);
                }
            },
            { threshold, root, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    // We only want to run this effect once when the component mounts.
    // The ref object itself won't change, so it's safe to omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementRef, threshold, root, rootMargin]);

    return isIntersecting;
}

export default useIntersectionObserver;
