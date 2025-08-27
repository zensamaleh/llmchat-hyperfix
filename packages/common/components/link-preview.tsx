'use client';

import { Source } from '@repo/shared/types';
import { getHost } from '@repo/shared/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@repo/ui';
import { IconExternalLink } from '@tabler/icons-react';
import React, { memo, useState } from 'react';
import { LinkFavicon } from './link-favicon';
const ogCache = new Map<string, any>();

export type LinkPreviewType = {
    source: Source;
    children: React.ReactNode;
};

export const LinkPreviewPopover = memo(({ source, children }: LinkPreviewType) => {
    if (!source?.link?.trim()?.length) {
        return null;
    }

    return (
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger className="cursor-pointer">{children}</HoverCardTrigger>
            <HoverCardContent
                className="bg-background prose-none hover:border-hard group isolate z-[100] w-[400px] cursor-pointer rounded-xl p-0 shadow-2xl"
                onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(source.link, '_blank');
                }}
            >
                <IconExternalLink
                    className="text-muted-foreground group-hover:text-brand absolute right-3 top-3"
                    size={14}
                />
                <LinkPreview source={source} />
            </HoverCardContent>
        </HoverCard>
    );
});

export const LinkPreview = memo(({ source }: { source: Source }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [ogResult, setOgResult] = useState<any | null>(null);

    // const fetchOg = async (url: string) => {
    //     try {
    //         if (ogCache.has(url)) {
    //             setOgResult(ogCache.get(url));
    //             return;
    //         }

    //         setIsLoading(true);
    //         const res = await fetch(`/api/og?url=${url}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         const data = await res.json();

    //         if (data) {
    //             ogCache.set(url, data);
    //             setOgResult(data);
    //         } else {
    //             setOgResult(undefined);
    //         }
    //     } catch (e) {
    //         setOgResult(undefined);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     let mounted = true;

    //     if (!ogResult && mounted) {
    //         fetchOg(url);
    //     }

    //     return () => {
    //         mounted = false;
    //     };
    // }, [url]);

    // const parsedUrl = useMemo(() => {
    //     try {
    //         return new URL(url);
    //     } catch (e) {
    //         return null;
    //     }
    // }, [url]);

    // if (!parsedUrl) return null;

    // if (isLoading) {
    //     return (
    //         <div className="flex w-full animate-pulse flex-col items-start p-4">
    //             <div className="flex w-full items-center gap-1.5">
    //                 <div className="bg-muted h-4 w-4 rounded-full" />
    //                 <div className="bg-muted h-3 w-24 rounded" />
    //             </div>
    //             <div className="mt-2 w-full space-y-2">
    //                 <div className="bg-muted h-4 w-3/4 rounded" />
    //                 <div className="bg-muted h-4 w-1/2 rounded" />
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="not-prose ">
            <div className="flex flex-col items-start">
                <div className="flex w-full flex-col items-start gap-1.5 p-4">
                    <div className="flex flex-row items-center gap-1.5">
                        <LinkFavicon link={source.link} />

                        <p className="text-muted-foreground line-clamp-1 w-full font-sans text-xs">
                            {getHost(source.link)}
                        </p>
                    </div>
                    <p className="text-foreground line-clamp-2 w-full overflow-hidden font-sans text-xs font-medium leading-tight">
                        {source.title}
                    </p>
                    <p className="text-muted-foreground line-clamp-2 w-full font-sans text-xs">
                        {source.snippet}
                    </p>
                </div>
            </div>
        </div>
    );
});
