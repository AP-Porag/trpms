// import AppLogoIcon from './app-logo-icon';

// export default function AppLogo() {
//     return (
//         <>
//             <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
//                 <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
//             </div>
//             <div className="ml-1 grid flex-1 text-left text-sm">
//                 <span className="mb-0.5 truncate leading-none font-semibold">TRPMS</span>
//             </div>
//         </>
//     );
// }

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center gap-2">
                {/* First Logo (icon) */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-md">
                    <img src="/images/trpms-icon.png" alt="TRPMS Icon" className="size-8 object-contain" />
                </div>

                {/* Second Logo (text/logo image) */}
                <img src="/images/trpms-text.png" alt="TRPMS Logo" className="h-6 object-contain" />
            </div>
        </>
    );
}
