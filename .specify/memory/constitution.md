<!--
SYNC IMPACT REPORT
==================
Version change: (template, unversioned) → 1.0.0
Rationale: Initial ratification. First concrete constitution populated from template; MINOR/PATCH
           rules begin applying to subsequent amendments.

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Code Quality
  - [PRINCIPLE_2_NAME] → II. Testing Standards
  - [PRINCIPLE_3_NAME] → III. User Experience Consistency
  - [PRINCIPLE_4_NAME] → IV. Performance Requirements
  - [PRINCIPLE_5_NAME] → (removed; project requested four principles)

Added sections:
  - Quality Gates & Tooling (Section 2)
  - Development Workflow (Section 3)

Removed sections:
  - None (placeholder fifth principle intentionally dropped per scope)

Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gate is generic; no change required)
  - ✅ .specify/templates/spec-template.md (Success Criteria already supports measurable UX/perf goals)
  - ✅ .specify/templates/tasks-template.md (test/perf/polish task categories already align)
  - ✅ .specify/templates/checklist-template.md (no principle-specific references)

Follow-up TODOs:
  - None
-->

# SDD SpecKit Constitution

## Core Principles

### I. Code Quality

Code MUST be readable, consistent, and maintainable before it is considered complete.

- All code MUST pass the project's configured linter and formatter with zero errors before merge;
  formatting is automated, never debated in review.
- Every public function, module, and exported interface MUST have a clear single responsibility;
  functions that exceed reasonable cognitive load MUST be decomposed.
- Code review by at least one other contributor is REQUIRED for every change to the main branch.
  Reviews MUST verify correctness, readability, and constitution compliance — not just "it works".
- Duplication MUST be removed or justified (DRY); dead code MUST NOT be merged.
- Public APIs and non-obvious decisions MUST be documented. Comments explain intent and trade-offs,
  never restate what the code already says.

**Rationale**: Maintainability is the dominant long-term cost of software. Enforcing automated style
and human review keeps the codebase legible and lowers the cost of every future change.

### II. Testing Standards

Functionality MUST be proven by automated tests, and those tests MUST be trustworthy.

- Every user-facing feature and bug fix MUST ship with automated tests that exercise it.
- Tests MUST be deterministic: no reliance on wall-clock timing, network flakiness, or test order.
  Flaky tests MUST be fixed or quarantined immediately, never ignored.
- Contract and integration tests are REQUIRED at component boundaries (APIs, shared schemas,
  inter-service communication); unit tests cover internal logic.
- The test suite MUST pass in CI before any merge. A red build blocks the branch.
- Coverage is a signal, not a target to game; critical paths (auth, data integrity, money,
  permissions) MUST have explicit test coverage regardless of overall percentage.

**Rationale**: Tests are the executable specification that lets the team change code with confidence.
Deterministic, boundary-focused tests catch regressions where they matter most.

### III. User Experience Consistency

Users MUST encounter one coherent product, not a collection of independently styled parts.

- Shared UI elements (components, spacing, typography, color, iconography) MUST come from a single
  source of truth (design system / shared component library); ad-hoc one-off styling is prohibited.
- Interaction patterns MUST be consistent: equivalent actions behave the same way everywhere
  (navigation, validation, confirmations, loading, empty, and error states).
- Every interactive surface MUST define and handle its loading, empty, error, and success states.
- Accessibility is REQUIRED, not optional: interfaces MUST meet WCAG 2.1 AA (keyboard navigation,
  sufficient contrast, labeled controls, screen-reader support).
- User-facing copy (errors, labels, microcopy) MUST be clear, actionable, and consistent in voice.

**Rationale**: Consistency reduces the user's cognitive load and builds trust. A shared source of
truth prevents drift as the product and team grow.

### IV. Performance Requirements

Performance is a feature and MUST be specified, measured, and defended.

- Every feature MUST declare measurable performance targets in its spec (e.g., p95 latency,
  throughput, memory budget, frame rate, bundle size) before implementation begins.
- Performance-sensitive paths MUST be measured against those targets; claims of "fast enough"
  MUST be backed by data, not intuition.
- Changes that regress an established performance budget MUST NOT merge without an explicit,
  documented justification and sign-off.
- Premature optimization is discouraged: optimize against real measurements and defined budgets,
  guided by profiling, not guesswork.
- Performance budgets MUST be tracked over time so regressions are visible early.

**Rationale**: Performance silently degrades unless it is treated as an explicit, measured
requirement. Budgets turn a vague goal into an enforceable gate.

## Quality Gates & Tooling

The following gates MUST be enforced automatically in CI and block merge on failure:

- **Lint & format**: zero linter errors; code matches the canonical formatter output.
- **Tests**: full automated suite green; no skipped tests without a tracked justification.
- **Performance**: budget checks for paths with declared targets; regressions fail the gate.
- **Accessibility**: automated a11y checks on user-facing surfaces where tooling supports it.

Tooling choices (linter, formatter, test runner, profiler, design system) are decided per project
in the implementation plan, but the gates above are mandatory regardless of stack. Suppressing or
disabling a gate REQUIRES an inline justification and reviewer approval.

## Development Workflow

- Work follows the Spec-Driven Development flow: specification → plan → tasks → implementation.
- Each feature specification MUST include measurable success criteria covering UX and performance
  expectations (see Principles III and IV).
- Pull requests MUST be small enough to review meaningfully and MUST describe what changed and why.
- Every PR MUST pass all Quality Gates and receive at least one approving review before merge.
- Reviewers MUST explicitly confirm constitution compliance; violations block merge until resolved
  or formally justified via the Complexity Tracking mechanism in the plan template.

## Governance

This constitution supersedes other practices where they conflict. All PRs and reviews MUST verify
compliance with these principles.

- **Amendments**: Proposed via pull request that edits this file, including the rationale and a
  Sync Impact Report. Amendments require maintainer approval before merge.
- **Versioning**: This document follows semantic versioning:
  - **MAJOR**: Backward-incompatible governance changes, or removal/redefinition of a principle.
  - **MINOR**: A new principle or section is added, or guidance is materially expanded.
  - **PATCH**: Clarifications, wording, and non-semantic refinements.
- **Compliance review**: Any change that introduces complexity in tension with these principles MUST
  be justified in the plan's Complexity Tracking table; unjustified violations MUST be remediated.
- **Dependent artifacts**: When principles change, the plan, spec, tasks, and checklist templates
  MUST be reviewed and updated in the same change to stay in sync.

**Version**: 1.0.0 | **Ratified**: 2026-05-28 | **Last Amended**: 2026-05-28
