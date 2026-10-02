# PROMPTS.md

## Prompt Sequence Used

1. **Initial implementation prompt (provided in this task):**
   - Build the News Blog Performance Optimization deliverable with React performance constraints, accessibility, unhappy-path handling, sanitization, telemetry simulation, tests, and documentation.

2. **Execution strategy prompt (implicit from task instructions):**
   - Implement in a test-driven flow: create Vitest/RTL tests first for rendering, filtering/empty state, loading, validation, sanitization, analytics logging, and keyboard/accessibility basics.

3. **Iteration prompt from failing tests:**
   - Implement the dashboard and sanitizer until the failing tests pass.

4. **Validation prompt (task quality requirements):**
   - Run targeted tests first, then full test/lint/build validation, and fix any failures.

5. **Documentation completion prompt (task requirement):**
   - Update README with setup, test, lint, build, deployment instructions, and concise feature/accessibility coverage.
