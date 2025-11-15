import React, { useEffect, useRef } from 'react';

// Using declare to inform TypeScript that these will be available globally
declare const gsap: any;
declare const Draggable: any;

interface ThemeBulbProps {
    theme: string;
    toggleTheme: () => void;
}

const ThemeBulb: React.FC<ThemeBulbProps> = ({ toggleTheme }) => {
    const dragProxyRef = useRef<HTMLDivElement>(null);
    const cordRef = useRef<SVGPathElement>(null);
    const bulbRef = useRef<SVGGElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Ensure GSAP and Draggable are loaded
        if (typeof gsap === 'undefined' || typeof Draggable === 'undefined') {
            console.error('GSAP or Draggable not loaded');
            return;
        }

        gsap.set(dragProxyRef.current, { y: 0 });
        gsap.set(bulbRef.current, { transformOrigin: '50% -100px' });

        const PULL_THRESHOLD = 60;
        let isDragging = false;
        
        const draggableInstance = Draggable.create(dragProxyRef.current, {
            type: 'y',
            bounds: { minY: 0, maxY: PULL_THRESHOLD + 20 },
            onDrag: function() {
                isDragging = true;
                const dragY = this.y;
                // Stretch the cord
                gsap.to(cordRef.current, {
                    attr: { d: `M 50,0 V ${55 + dragY}` },
                    duration: 0.1,
                });
                // Move the bulb down
                 gsap.to(bulbRef.current, {
                    y: dragY,
                    duration: 0.1,
                });
            },
            onDragEnd: function() {
                // If it was a real drag and not just a click
                if (isDragging) {
                    // If pulled past the threshold, toggle the theme
                    if (this.y >= PULL_THRESHOLD) {
                        toggleTheme();
                        if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play();
                        }
                    }

                    // Animate back to original position with a wobble
                    gsap.to([this.target, bulbRef.current], {
                        y: 0,
                        duration: 1.5,
                        ease: 'elastic.out(1, 0.3)',
                    });
                    
                    // Animate the cord path back
                    gsap.to(cordRef.current, {
                        attr: { d: 'M 50,0 V 55' },
                        duration: 1.5,
                        ease: 'elastic.out(1, 0.3)',
                    });
                    
                    // Add a slight rotational wobble to the bulb
                    gsap.fromTo(bulbRef.current, 
                        { rotation: this.y / 4 }, // Start rotation based on pull distance
                        { rotation: 0, duration: 1.5, ease: 'elastic.out(1, 0.3)' }
                    );

                }
                isDragging = false;
            },
        });

        return () => {
            // Kill the Draggable instance to prevent memory leaks
            if (draggableInstance && draggableInstance[0]) {
                draggableInstance[0].kill();
            }
        };
    }, [toggleTheme]);

    // Base64 encoded click sound to keep it self-contained
    const clickSound = "data:audio/mpeg;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YUfIT19PbmVsaW5lYXVkaW9jb252ZXJ0ZXIuY29tDQpoaXNwaXNlciBkb2Ugbm90IHJlY29yZCBvciBzdG9yZSB5b3VyIGZpbGVzLg0KYwAACEAZ0kU/19R/Z/qj+AEEoAJv+CsEEQSQADwAFPhxGv8EABkAFb///wABEKQAAQDXAD4AABMAAAAABwAAgQIAAwAAAB4AAGQAAAAAAAAAAAAAgJiYANQAAAEAMgAAAAAAAAAAAAAAMwAsgAAAAAAAAAAAAAAAACwASAAAAAAAAAAAAAAABACwAAAAAAAAAAAAAAAAAAAAAADYAEgAAAAAAAAAAAQAAAAAAAAAAABYAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAEAACgAAAAAAAAAAAAAAAAAAADwAAgAAAAAAAAABAAAAAAAAAAAAEAAIAAAAAAAAAAEAAAAAAAAAAAADABIAAAAAAAAAAQAAAAAAAAAAAPwAEgAAAAAAAAABAAAAAAAAAAAAIAAgAAAAAAAAAAQAAAAAAAAAAAAIAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAkAAAAAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAA=";


    return (
        <>
            <div ref={dragProxyRef} className="toggle-scene">
                <svg width="100" height="150" viewBox="0 0 100 150">
                    <path ref={cordRef} d="M 50,0 V 55" className="toggle-scene__cord" />
                    <g ref={bulbRef} className="bulb">
                        <path className="bulb__cap" d="M 40,55 H 60 V 65 H 40 Z" />
                        <path className="bulb__bulb" d="M 40,65 C 40,85 60,85 60,65 H 40 Z" />
                        <path className="bulb__filament" d="M 45,67 C 45,72 55,72 55,67" fill="none"/>
                    </g>
                </svg>
            </div>
            <audio ref={audioRef} src={clickSound} preload="auto"></audio>
        </>
    );
};

export default ThemeBulb;
