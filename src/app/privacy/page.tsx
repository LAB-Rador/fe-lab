import { PublicGlow } from "@/src/components/landing/public-glow"
import { Footer } from "@/src/components/landing/footer"
import { Header } from "@/src/components/landing/header"
import { PrivacyView } from "./privacy.view"

export default function PrivacyPage() {
    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <PublicGlow />
            <Header />
            <main>
                <PrivacyView />
            </main>
            <Footer />
        </div>
    )
}
