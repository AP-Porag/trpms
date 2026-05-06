export default function AppLogo() {
    return (
        <>
            <div className="flex items-center gap-2">
                {/* First Logo (icon) */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-md">
                    <img src="/images/blueprint-icon.png" alt="Blueprint Icon" className="size-8 object-contain" />
                </div>

                {/* Second Logo (text/logo image) */}
                <img src="/images/blueprint-text.png" alt="Blueprint Logo" className="h-6 object-contain" />
            </div>
        </>
    );
}
