"use client";

import { useState, useEffect } from 'react';

interface CloudsBackgroundProps {
    className?: string;
}

interface Cloud {
    id: number;
    size: number;
    top: string;
    opacity: number;
    duration: number;
    delay: number;
}

export function CloudsBackground({ className = "" }: CloudsBackgroundProps) {
    const [clouds, setClouds] = useState<Cloud[]>([]);

    useEffect(() => {
        // Generate random clouds
        const generateClouds = () => {
            const cloudCount = 8 + Math.floor(Math.random() * 4); // 8-12 clouds
            const newClouds: Cloud[] = [];
            
            for (let i = 0; i < cloudCount; i++) {
                newClouds.push({
                    id: i,
                    size: 0.6 + Math.random() * 0.8, // Size multiplier between 0.6 and 1.4
                    top: `${10 + Math.random() * 70}%`, // Random vertical position
                    opacity: 0.3 + Math.random() * 0.4, // Opacity between 0.3 and 0.7
                    duration: 40 + Math.random() * 30, // Duration between 40-70 seconds
                    delay: Math.random() * -60 // Random delay up to -60 seconds
                });
            }
            
            setClouds(newClouds);
        };

        generateClouds();
        
        // Regenerate clouds periodically for more variety
        const interval = setInterval(generateClouds, 120000); // Every 2 minutes
        
        return () => clearInterval(interval);
    }, []);

    const renderCloud = (cloud: Cloud) => {
        const baseWidth = 100;
        const baseHeight = 50;
        const width = baseWidth * cloud.size;
        const height = baseHeight * cloud.size;
        
        return (
            <div key={cloud.id}>
                <div 
                    className="absolute cloud-float"
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        top: cloud.top,
                        left: '-200px',
                        background: 'rgba(255, 255, 255, 0.85)',
                        borderRadius: '100px',
                        opacity: cloud.opacity,
                        filter: 'blur(0.5px)',
                        boxShadow: '0 8px 32px rgba(255, 255, 255, 0.3)',
                        animation: `float-cloud ${cloud.duration}s infinite linear`,
                        animationDelay: `${cloud.delay}s`
                    }}
                >
                    {/* Cloud puffs */}
                    <div 
                        className="absolute"
                        style={{
                            width: `${width * 0.6}px`,
                            height: `${height * 1.3}px`,
                            top: `${-height * 0.6}px`,
                            left: `${width * 0.2}px`,
                            background: 'rgba(255, 255, 255, 0.85)',
                            borderRadius: '100px',
                            filter: 'blur(0.3px)'
                        }}
                    />
                    <div 
                        className="absolute"
                        style={{
                            width: `${width * 0.8}px`,
                            height: `${height * 1.1}px`,
                            top: `${-height * 0.4}px`,
                            right: `${width * 0.15}px`,
                            background: 'rgba(255, 255, 255, 0.85)',
                            borderRadius: '100px',
                            filter: 'blur(0.3px)'
                        }}
                    />
                    {/* Additional smaller puff for variety */}
                    {cloud.size > 0.8 && (
                        <div 
                            className="absolute"
                            style={{
                                width: `${width * 0.4}px`,
                                height: `${height * 0.8}px`,
                                top: `${-height * 0.3}px`,
                                left: `${width * 0.7}px`,
                                background: 'rgba(255, 255, 255, 0.85)',
                                borderRadius: '100px',
                                filter: 'blur(0.3px)'
                            }}
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`fixed inset-0 z-0 ${className}`}>
            {/* Sky Gradient Background */}
            <div 
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #4A90E2 0%, #87CEEB 25%, #B8E6F7 75%, #E8F4FD 100%)'
                }}
            />
            
            {/* Atmospheric overlay */}
            <div 
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.1) 0%, transparent 70%)'
                }}
            />
            
            {/* Dynamic Clouds */}
            {clouds.map(renderCloud)}

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes float-cloud {
                    0% { 
                        transform: translateX(-200px) translateY(0px);
                        opacity: 0;
                    }
                    5% { opacity: var(--cloud-opacity, 0.6); }
                    95% { opacity: var(--cloud-opacity, 0.6); }
                    100% { 
                        transform: translateX(calc(100vw + 200px)) translateY(-30px);
                        opacity: 0;
                    }
                }
                
                .cloud-float {
                    --cloud-opacity: inherit;
                }
                
                /* Add some gentle vertical movement to clouds */
                @keyframes cloud-drift {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                .cloud-float::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    animation: cloud-drift 20s infinite ease-in-out;
                    animation-delay: inherit;
                }
            `}</style>
        </div>
    );
}
