import BorderGlow from "@/src/components/react-bits/border-glow"
import BlurText from "@/src/components/react-bits/blur-text"

export function PrivacyView() {
    return (
        <section className="py-16">
            <div className="container mx-auto max-w-3xl px-4 lg:px-8">
                <BorderGlow
                    backgroundColor="hsl(var(--card))"
                    borderRadius={12}
                    glowColor="258 90 66"
                    colors={["#8B5CF6", "#3B82F6", "#C4B5FD"]}
                    glowIntensity={0.55}
                >
                    <div className="p-8">
                        <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
                        <BlurText
                            text="LabAssist stores the account and laboratory records needed to run the product. The app does not collect payment card numbers."
                            className="mt-4 text-lg text-muted-foreground"
                            animateBy="words"
                            direction="bottom"
                            delay={24}
                        />

                        <h2 className="mt-10 text-xl font-semibold text-foreground">Account</h2>
                        <p className="mt-3 text-muted-foreground">
                            Email address, name, institution, phone, and address. Sign-in uses a one-time link sent to that email.
                        </p>

                        <h2 className="mt-8 text-xl font-semibold text-foreground">Laboratory</h2>
                        <p className="mt-3 text-muted-foreground">
                            Laboratory name, members and roles, invitations, animals, breeding pairs, experiments, tasks,
                            medical records, notifications, and saved reports.
                        </p>

                        <h2 className="mt-8 text-xl font-semibold text-foreground">Contact</h2>
                        <p className="mt-3 text-muted-foreground">
                            Questions about this data go to{" "}
                            <a className="font-medium text-primary" href="mailto:kolevegov@gmail.com">
                                kolevegov@gmail.com
                            </a>
                            .
                        </p>
                    </div>
                </BorderGlow>
            </div>
        </section>
    )
}
