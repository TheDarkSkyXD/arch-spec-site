import { BookOpen, Layout, Database, Code, Server, TestTube, FileCode, Users } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';

const Documentation = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
            Creating Effective Architecture Specifications
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            A comprehensive guide to developing complete and implementation-ready software
            specifications.
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Introduction
          </h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            ArchSpec is an AI-powered software specification system that transforms traditional
            software development by creating exhaustive, implementation-ready specifications before
            any code is written. This guide will help you understand how to create effective
            architecture specifications using our platform.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Unlike conventional AI coding assistants that operate through iterative prompt-response
            cycles, ArchSpec employs a structured, upfront planning methodology to create
            comprehensive blueprints containing all architectural decisions, implementation details,
            and testing frameworks necessary for frictionless development.
          </p>
        </div>

        {/* Core Principles Section */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Core Principles
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Complete Specification
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Every aspect of the software is defined before implementation, ensuring clarity
                across all components.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Implementation Independence
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Specifications contain sufficient detail to be implemented by any competent AI or
                human developer.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Testability By Design
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Testing strategy is built into the specification from the beginning, not added as an
                afterthought.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Architectural Integrity
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Adherence to proven software architectural patterns and principles throughout the
                specification.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Contextual Continuity
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Development can be paused and resumed without loss of context or architectural
                vision.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Progressive Validation
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Implementation can be verified against the specification at any point in the
                development process.
              </p>
            </div>
          </div>
        </div>

        {/* Specification Domains Section */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Key Specification Domains
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">
                  Requirements Management
                </h3>
              </div>
              <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-300">
                <li>User story capture and organization</li>
                <li>Functional requirement classification</li>
                <li>Non-functional requirement definition</li>
                <li>Constraint documentation</li>
                <li>Acceptance criteria formulation</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                  <Layout className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">
                  Architecture Specification
                </h3>
              </div>
              <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-300">
                <li>High-level architectural pattern selection</li>
                <li>Component identification</li>
                <li>Interface definition between components</li>
                <li>Data flow mapping</li>
                <li>Security architecture definition</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                  <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">
                  Data Design
                </h3>
              </div>
              <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-300">
                <li>Data model definition</li>
                <li>Entity relationship diagrams</li>
                <li>Database schema specification</li>
                <li>Data validation rules</li>
                <li>Caching strategies</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                  <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">
                  API Design
                </h3>
              </div>
              <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-300">
                <li>Endpoint definition</li>
                <li>Request/response format specification</li>
                <li>Authentication and authorization schemes</li>
                <li>API documentation generation</li>
                <li>OpenAPI/Swagger compatibility</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                  <TestTube className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">
                  Testing Framework
                </h3>
              </div>
              <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-300">
                <li>Test strategy definition</li>
                <li>Unit test case specification</li>
                <li>Integration test planning</li>
                <li>End-to-end test scenarios</li>
                <li>Performance testing criteria</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                  <FileCode className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">
                  Implementation Planning
                </h3>
              </div>
              <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-300">
                <li>File and directory structure planning</li>
                <li>Module and class definitions</li>
                <li>Method signatures and responsibilities</li>
                <li>Third-party library selection</li>
                <li>Dependency management approach</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Creating Your First Spec */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Creating Your First Specification
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-xl font-medium text-slate-800 dark:text-slate-100">
                1. Project Initialization
              </h3>
              <p className="mb-2 text-slate-600 dark:text-slate-300">
                Start by selecting a project type (web, mobile, desktop, API) and choose between
                preset templates or custom configuration. Select your technology stack and capture
                high-level requirements.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-medium text-slate-800 dark:text-slate-100">
                2. Domain-Specific Specifications
              </h3>
              <p className="mb-2 text-slate-600 dark:text-slate-300">
                Work through each specification domain, providing details appropriate to your
                project. The AI will assist in filling gaps and ensuring consistency across domains.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-medium text-slate-800 dark:text-slate-100">
                3. Review & Refinement
              </h3>
              <p className="mb-2 text-slate-600 dark:text-slate-300">
                Review the complete specification, validating cross-references and addressing any
                identified gaps. Refine based on AI suggestions and your own expertise.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-medium text-slate-800 dark:text-slate-100">
                4. Export & Implementation
              </h3>
              <p className="mb-2 text-slate-600 dark:text-slate-300">
                Export the specification in your preferred format for implementation. The
                specification contains everything needed for successful development.
              </p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Best Practices
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Be Comprehensive
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Cover all aspects of your system, leaving no ambiguities or assumptions. Address
                edge cases and error conditions explicitly.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Focus on Interfaces
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Clearly define interfaces between components, as these are critical integration
                points that often cause implementation issues.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Consider Scalability Early
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Define how your system will scale and handle increased load, even if initial
                implementation is for smaller scale.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Integrate Testing Strategy
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Define how each component and feature will be tested as part of the specification,
                not as an afterthought.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Embrace AI Assistance
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Utilize AI suggestions to fill gaps and identify inconsistencies, but maintain
                critical oversight of the final specification.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">
                Document Assumptions
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Explicitly state any assumptions made during the specification process to prevent
                misunderstandings during implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="rounded-lg border border-primary-100 bg-gradient-to-r from-primary-50 to-blue-50 p-6 shadow-sm dark:border-primary-800/30 dark:from-primary-900/20 dark:to-blue-900/20">
          <h2 className="mb-4 text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Ready to Get Started?
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Creating comprehensive architecture specifications upfront leads to smoother
            implementation, fewer defects, and more maintainable software. Use ArchSpec to transform
            your development process.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => navigate('/new-project')}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-white shadow-sm hover:bg-primary-700"
            >
              <Users size={18} />
              <span>Create Your First Project</span>
            </button>
            <button
              onClick={() => navigate('/templates')}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Server size={18} />
              <span>Browse Templates</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Documentation;
