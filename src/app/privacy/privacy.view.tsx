export function PrivacyView() {
    return (
        <section className="bg-white py-16">
            <div className="container mx-auto max-w-3xl px-4 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="mt-4 text-lg text-gray-600">
                    LabAssist stores the account and laboratory records needed to run the product.
                    The app does not collect payment card numbers.
                </p>

                <h2 className="mt-10 text-xl font-semibold text-gray-900">Account</h2>
                <p className="mt-3 text-gray-700">
                    Email address, name, institution, phone, and address. Sign-in uses a one-time link sent to that email.
                </p>

                <h2 className="mt-8 text-xl font-semibold text-gray-900">Laboratory</h2>
                <p className="mt-3 text-gray-700">
                    Laboratory name, members and roles, invitations, animals, breeding pairs, experiments, tasks,
                    medical records, notifications, and saved reports.
                </p>

                <h2 className="mt-8 text-xl font-semibold text-gray-900">Contact</h2>
                <p className="mt-3 text-gray-700">
                    Questions about this data go to{" "}
                    <a className="font-medium text-[#2563EB]" href="mailto:kolevegov@gmail.com">
                        kolevegov@gmail.com
                    </a>
                    .
                </p>
            </div>
        </section>
    )
}
