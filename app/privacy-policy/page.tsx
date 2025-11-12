import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="w-full min-h-screen p-16">
      <div className="border-neutral-600/20 border-2 bg-white/5 rounded-3xl backdrop-blur-lg w-full h-full font-mono p-16">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Last Updated: November 2025
        </p>

        <section className="space-y-4">
          <p className="text-neutral-200">
            Hey Sanka we respects your privacy. This policy explains what data
            we handle — and more importantly, what we don’t.
          </p>

          <h2 className="text-2xl font-semibold mt-2 text-neutral-100">
            1. What We Collect
          </h2>
          <p className="text-neutral-200">
            Hey Sanka doesn’t collect, store, or track any personal information.
            There’s <strong>no account system</strong>,{" "}
            <strong>no database</strong>, and{" "}
            <strong>no server-side storage</strong>. Everything happens inside
            your browser.
          </p>
          <ul className="text-neutral-200 list-disc pl-6 space-y-2">
            <li>
              <strong>Vercel Token</strong> and{" "}
              <strong>GitHub Personal Access Token (PAT)</strong>
              are stored only in your browser’s local storage — never sent to
              our servers.
            </li>
            <li>
              <strong>Voice commands</strong> are processed locally in your
              browser. We don’t record, save, or transmit any audio.
            </li>
            <li>
              We may collect minimal, non-identifiable usage data (like
              performance metrics or errors) to improve functionality — always
              aggregated and anonymous.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 text-neutral-100">
            2. How Your Tokens Are Used
          </h2>
          <p className="text-neutral-200">
            Your tokens are used only to perform actions you request:
          </p>
          <ul className="text-neutral-200 list-disc pl-6 space-y-2">
            <li>Generate and preview temporary Next.js apps.</li>
            <li>Push generated code to your GitHub repository.</li>
            <li>
              Deploy generated projects to Vercel and return the live link.
            </li>
          </ul>
          <p className="text-neutral-200">
            These tokens never leave your browser, and we don’t store or log
            them anywhere.
          </p>

          <h2 className="text-2xl font-semibold mt-8 text-neutral-100">
            3. Data Retention
          </h2>
          <p className="text-neutral-200">
            We don’t retain any data. If you clear your browser cache or local
            storage, all tokens and settings are permanently deleted.
          </p>

          <h2 className="text-2xl font-semibold mt-8 text-neutral-100">
            4. Third-Party Services
          </h2>
          <p className="text-neutral-200">Hey Sanka interacts directly with:</p>
          <ul className="text-neutral-200 list-disc pl-6 space-y-2">
            <li>
              <a
                href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub API
              </a>{" "}
              (for pushing code)
            </li>
            <li>
              <a
                href="https://vercel.com/legal/privacy-policy"
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel API
              </a>{" "}
              (for deployments)
            </li>
          </ul>
          <p className="text-neutral-200">
            Your interactions with these services are governed by their
            respective privacy policies.
          </p>

          <h2 className="text-2xl font-semibold mt-8">5. Security</h2>
          <p className="text-neutral-200">
            Hey Sanka runs entirely in your browser. Your data’s security
            depends on your device. All API calls use secure HTTPS connections,
            and we never proxy your credentials.
          </p>

          <h2 className="text-2xl font-semibold mt-8">6. Your Control</h2>
          <ul className="text-neutral-200 list-disc pl-6 space-y-2">
            <li>
              Revoke GitHub or Vercel tokens anytime from their dashboards.
            </li>
            <li>Clear local storage to remove all data.</li>
            <li>Disable microphone access via browser settings.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">7. Updates</h2>
          <p className="text-neutral-200">
            We may update this policy as new features roll out. Updates will
            always be posted here with a revised “Last Updated” date.
          </p>

          <h2 className="text-2xl font-semibold mt-8">8. Contact</h2>
          <p className="text-neutral-200">
            For questions or concerns, reach us at{" "}
            <a
              href="mailto:support@gmail.com"
              className="text-blue-400 hover:underline"
            >
              works.pxi@gmail.com
            </a>
          </p>
        </section>
        {/* <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-500 text-center"></div> */}
      </div>
      {/* <p className="text-white/45 w-full text-center text-[0.6rem] font-mono">
        Designed & Built by
        <Link href={"https://nakul.space"}>
          <span className="hover:text-white cursor-pointer">&nbsp;Nakul</span>
        </Link>
        . © 2025.
        <Link href={"/privacy-policy"}>
          <span className="hover:text-white cursor-pointer">
            &nbsp;Privacy Policy&nbsp;
          </span>
        </Link>
        | X:
        <Link href={"https://x.com/heynakul"}>
          <span className="hover:text-white cursor-pointer">
            &nbsp;@heynakul
          </span>
        </Link>
      </p> */}
    </div>
  );
};

export default page;
