import { Link } from "react-router-dom";
import LandingLayout from "../layouts/LandingLayout";
import Logo from "../components/ui/Logo";

const LandingPage = () => {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <svg
            className="absolute left-full transform -translate-y-1/2 -translate-x-1/4 lg:translate-x-1/2 xl:translate-x-1/4"
            width="404"
            height="784"
            fill="none"
            viewBox="0 0 404 784"
          >
            <defs>
              <pattern
                id="pattern-1"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height="4"
                  className="text-primary-200 opacity-10"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect width="404" height="784" fill="url(#pattern-1)" />
          </svg>
        </div>
        <div className="relative pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8 space-x-4">
                <Logo
                  size="large"
                  className="text-white rounded"
                  variant="image"
                />
                <h2 className="text-white text-3xl font-bold">Arch Spec</h2>
              </div>
              <div className="mb-6 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Early Access / Open Source Release
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-6xl">
                <span className="block">Revolutionary Software</span>
                <span className="block text-blue-200">
                  Specification System
                </span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-xl text-blue-100 sm:max-w-3xl">
                ArchSpec transforms software development by creating
                comprehensive, implementation-ready specifications before a
                single line of code is written by an AI or human developer.
              </p>
              <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                  <Link
                    to="/register"
                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-blue-50 sm:px-8"
                  >
                    Try For Free
                  </Link>
                  <a
                    href="https://github.com/mamertofabian/arch-spec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-800 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Open Source
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex flex-col" aria-hidden="true">
            <div className="flex-1"></div>
            <div className="flex-1 w-full bg-white dark:bg-slate-900"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="relative bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden">
              <div className="absolute inset-0">
                <img
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
                  alt=""
                />
                <div className="absolute inset-0 bg-primary-700 mix-blend-multiply"></div>
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Complete Specifications. Perfect Implementation.
                </h2>
                <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                  ArchSpec produces exhaustive blueprints containing all
                  architectural decisions, implementation details, and testing
                  frameworks necessary for frictionless development.
                </p>
                <div className="mt-10">
                  <a
                    href="https://youtube.com/@aidrivencoder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-blue-50"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                    Watch Video
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Status Section */}
      <div className="py-16 bg-blue-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              Development Status
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Current Stage & Roadmap
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-300 lg:mx-auto">
              ArchSpec is currently in early access, with core functionality
              working and additional features in active development.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* What's Working */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">
                    What's Working Now
                  </h3>
                  <ul className="mt-2 text-base text-slate-500 dark:text-slate-300 space-y-2">
                    <li>✅ User signup and authentication</li>
                    <li>✅ Project management (create/update/delete)</li>
                    <li>
                      ✅ Software specs sections (Requirements, Features, Pages,
                      Data Model, API Endpoints, Test Cases)
                    </li>
                    <li>✅ Preview and export options (markdown, zip)</li>
                    <li>✅ Free manual data entry for all spec sections</li>
                    <li>✅ One template available (more coming soon)</li>
                    <li>✅ LemonSqueezy payment integration</li>
                  </ul>
                </div>
              </div>

              {/* Coming Soon */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">
                    In Development
                  </h3>
                  <ul className="mt-2 text-base text-slate-500 dark:text-slate-300 space-y-2">
                    <li>⏳ AI credit-based plans</li>
                    <li>⏳ Optimized AI calls (batching)</li>
                    <li>⏳ Intelligent knowledge graphs for gaps detection</li>
                    <li>⏳ Implementation sequence generator</li>
                    <li>⏳ Additional project templates</li>
                    <li>⏳ UI polishing and bug fixes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              Core Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              A Better Way to Build Software
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-300 lg:mx-auto">
              ArchSpec employs a structured, upfront planning methodology
              instead of iterative prompt-response cycles.
            </p>
          </div>

          <div className="mt-20">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">
                    Complete Specification
                  </h3>
                  <p className="mt-2 text-base text-slate-500 dark:text-slate-300">
                    Every aspect of the software is defined before
                    implementation, leaving no room for ambiguity.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">
                    Implementation Independence
                  </h3>
                  <p className="mt-2 text-base text-slate-500 dark:text-slate-300">
                    Specifications contain sufficient detail to be implemented
                    by any competent AI or human developer.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">
                    Testability By Design
                  </h3>
                  <p className="mt-2 text-base text-slate-500 dark:text-slate-300">
                    Testing strategy and comprehensive test cases are built into
                    the specification from the beginning.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">
                    Architectural Integrity
                  </h3>
                  <p className="mt-2 text-base text-slate-500 dark:text-slate-300">
                    Ensures adherence to proven software architectural patterns
                    and principles for robust systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Source Section */}
      <div className="bg-slate-50 dark:bg-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              Current Status
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Open Source First Approach
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-300 lg:mx-auto">
              ArchSpec is currently available as an open source project. Try it
              yourself or use our hosted version.
            </p>
          </div>

          <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
            {/* Open Source Option */}
            <div className="relative p-8 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Self-Hosted Open Source
                </h3>
                <p className="mt-4 flex items-baseline text-slate-900 dark:text-white">
                  <span className="text-5xl font-extrabold tracking-tight">
                    Free
                  </span>
                  <span className="ml-1 text-xl font-semibold">/forever</span>
                </p>
                <p className="mt-6 text-slate-500 dark:text-slate-300">
                  Run ArchSpec on your own infrastructure with complete control
                  over your data and customization options.
                </p>

                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-slate-700 dark:text-slate-300">
                      Full control over your data
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-slate-700 dark:text-slate-300">
                      Unlimited projects and specifications
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-slate-700 dark:text-slate-300">
                      Requires your own AI API keys for AI features
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-slate-700 dark:text-slate-300">
                      Customize and contribute to the codebase
                    </p>
                  </li>
                </ul>
              </div>

              <a
                href="https://github.com/mamertofabian/arch-spec"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full bg-slate-800 dark:bg-slate-600 py-3 px-6 border border-transparent rounded-md text-center font-medium text-white hover:bg-slate-900 dark:hover:bg-slate-500"
              >
                View on GitHub
              </a>
            </div>

            {/* Early Access Hosted */}
            <div className="relative p-8 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm flex flex-col">
              <div className="absolute top-0 right-0 -mt-3 mr-3 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded">
                EARLY ACCESS
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Hosted Early Access
                </h3>
                <p className="mt-4 flex items-baseline text-slate-900 dark:text-white">
                  <span className="text-5xl font-extrabold tracking-tight">
                    Basic
                  </span>
                  <span className="ml-1 text-xl font-semibold">+ AI costs</span>
                </p>
                <p className="mt-6 text-slate-500 dark:text-slate-300">
                  Use our hosted version at archspec.dev with no setup. AI
                  features require payment to cover API costs.
                </p>

                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-slate-700 dark:text-slate-300">
                      No setup required - use our hosted version
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-slate-700 dark:text-slate-300">
                      Basic features available for free
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-slate-700 dark:text-slate-300">
                      Subscribe to access AI-powered features
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-slate-700 dark:text-slate-300">
                      Be among the first to try new features
                    </p>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="mt-8 block w-full bg-primary-600 py-3 px-6 border border-transparent rounded-md text-center font-medium text-white hover:bg-primary-700"
              >
                Sign Up for Early Access
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">
              Ready to transform your development process?
            </span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join the revolution in software specification and development. Try
            the open source version or sign up for our hosted early access.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0">
            <a
              href="https://github.com/mamertofabian/arch-spec"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-800 hover:bg-primary-900 sm:w-auto"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
            >
              Try Early Access
            </Link>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default LandingPage;
