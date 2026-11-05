import { Footer } from "@/src/components/landing/footer"
import { Header } from "@/src/components/landing/header"
import { PrivacyView } from "./privacy.view"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <PrivacyView />
            </main>
            <Footer />
        </div>
    )
}
