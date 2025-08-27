import React from 'react';
import { Drawer } from 'vaul';
import { cn } from '../lib/utils';

export type TSheetContent = {
    children: React.ReactNode;
    className?: string;
    width?: 'sm' | 'md';
};

export const SheetContent = ({ children, width = 'md', className }: TSheetContent) => {
    return (
        <Drawer.Portal>
            <Drawer.Overlay className="bg-background/70 fixed inset-0 z-30 backdrop-blur-sm" />
            <Drawer.Content
                className={cn(
                    'fixed bottom-0 left-0 right-0 z-40 mx-auto mt-24 flex max-h-[80%] flex-col rounded-3xl outline-none md:bottom-4 md:left-[50%]',
                    width == 'md' && `w-full md:ml-[-250px] md:w-[500px]`,
                    width == 'sm' && `w-full md:ml-[-200px] md:w-[400px]`,
                    className
                )}
            >
                <div className="bg-background flex-1 rounded-3xl pt-4">
                    <div className="-col bg-muted mx-auto mb-4 h-1 w-8 flex-shrink-0 rounded-full" />
                    <div className="flex flex-col">{children}</div>
                </div>
            </Drawer.Content>
        </Drawer.Portal>
    );
};

export const Sheet = React.forwardRef<
    React.ElementRef<typeof Drawer.Root>,
    React.ComponentPropsWithoutRef<typeof Drawer.Root>
>(({ ...props }, ref) => <Drawer.Root shouldScaleBackground {...props} />);

export const SheetTrigger = React.forwardRef<
    React.ElementRef<typeof Drawer.Trigger>,
    React.ComponentPropsWithoutRef<typeof Drawer.Trigger>
>(({ ...props }, ref) => <Drawer.Trigger {...props} ref={ref} className="text-left" asChild />);

SheetTrigger.displayName = 'SheetTrigger';
Sheet.displayName = 'Sheet';
