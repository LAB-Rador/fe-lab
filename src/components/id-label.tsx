"use client"

import { Button } from "@/src/components/ui/button"
import { Printer } from "lucide-react"
import { useEffect, useState } from "react"
import QRCode from "qrcode"

export function IdLabel({ title, caption, path }: { title: string; caption?: string; path: string }) {
    const [src, setSrc] = useState("")

    useEffect(() => {
        const url = `${window.location.origin}${path}`
        QRCode.toDataURL(url, { margin: 1, width: 192, errorCorrectionLevel: "M" })
            .then(setSrc)
            .catch(() => setSrc(""))
    }, [path])

    return (
        <>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .id-label, .id-label * { visibility: visible; }
                    .id-label { position: absolute; left: 0; top: 0; width: 50mm; border: none; }
                    .id-label .no-print { display: none !important; }
                }
            `}</style>
            <div className="id-label w-[50mm] rounded-md border bg-white p-2">
                <div className="flex items-center gap-2">
                    {src ? (
                        <img src={src} alt="" width={88} height={88} />
                    ) : (
                        <div className="h-[88px] w-[88px] bg-gray-100" />
                    )}
                    <p className="text-sm font-bold leading-tight break-all">{title}</p>
                </div>
                {caption ? <p className="mt-1 text-xs text-gray-600">{caption}</p> : null}
                <Button type="button" variant="outline" size="sm" className="no-print mt-2 w-full" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print label
                </Button>
            </div>
        </>
    )
}
