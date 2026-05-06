import { HTMLAttributes } from 'react';

export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
    return (
        <div className="flex items-center gap-2">
            {/* First Logo (icon) */}
            <div className="flex aspect-square size-20 items-center justify-center rounded-md">
                <img src="/images/blueprint-icon.png" alt="Blueprint Icon" className="size-20 object-contain" />
            </div>

            {/* Second Logo (text/logo image) */}
            <img src="/images/blueprint-text.png" alt="Blueprint Logo" className="h- object-contain" />
        </div>
    );
}

