export function PublicGlow() {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
            <div className="absolute -left-24 top-[-6rem] h-[32rem] w-[32rem] rounded-full bg-[#3B82F6]/20 blur-3xl" />
            <div className="absolute right-[-6rem] top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#8B5CF6]/15 blur-3xl" />
            <div className="absolute bottom-[-8rem] left-1/3 h-[24rem] w-[24rem] rounded-full bg-[#3B82F6]/10 blur-3xl" />
        </div>
    )
}
