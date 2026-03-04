import React from 'react';
import type { GoalType, BrandVoiceConfig } from '@fluxxis/core';

export interface SmartSectionProps extends React.HTMLAttributes<HTMLElement> {
    /** 
     * Primary goal of the section
     */
    goal: GoalType;
    /** 
     * Context of where this section lives on the page 
     * (e.g., 'pricing tier comparison', 'product features')
     */
    pageContext: string;
    /** 
     * Optional brand voice override for this specific section 
     */
    brandVoice?: BrandVoiceConfig;
    /** 
     * The HTML element to render the section as. Defaults to 'section'.
     */
    as?: React.ElementType;
    /**
     * Children of the section
     */
    children?: React.ReactNode;
}
