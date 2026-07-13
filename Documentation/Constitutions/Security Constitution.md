Health Decoded Security Constitution
Version: 1.0

Purpose
This Security Constitution defines the mandatory security standards for every part of Health Decoded.
Its purpose is to protect:
Users
Medical information
AI systems
Infrastructure
Source code
Financial resources
Company reputation
Every engineer and every AI coding assistant working on this repository must follow these standards.
Security is not an optional feature.
It is a core requirement of the application.
Whenever security conflicts with convenience, development speed, or implementation simplicity, security takes priority.

Scope
This constitution applies to:
Frontend code
Backend code
API routes
Database design
Authentication
Authorization
AI systems
Infrastructure
Third-party services
Build systems
CI/CD pipelines
Future contributors
Every AI assistant working on the repository
No component is exempt.

Security Philosophy
Health Decoded follows six core security principles.
Principle 1 — Secure by Default
Every new feature must begin from the most secure reasonable configuration.
Developers should never assume future hardening will occur.
If something should be secure, it must be secure from the first implementation.

Principle 2 — Never Trust Input
Every piece of external data is considered untrusted.
This includes:
User input
URL parameters
Cookies
Headers
Uploaded files
AI-generated responses
External APIs
Database values from previous versions
Browser state
Everything must be validated.

Principle 3 — Least Privilege
Every user, API, service, and system receives only the permissions absolutely necessary.
No component should receive administrative access unless there is no safer alternative.

Principle 4 — Defense in Depth
Security must never rely on a single protection.
For example:
Authentication alone is not enough.
Authorization is still required.
Validation is still required.
Logging is still required.
Every layer should assume another layer could fail.

Principle 5 — Fail Securely
When uncertainty exists, the system must deny access rather than grant it.
Examples:
Unknown user → deny.
Invalid token → deny.
Failed validation → reject request.
Missing permission → reject request.
Never "guess" what the user intended.

Principle 6 — Security Before Features
No feature is important enough to justify weakening security.
If a feature cannot be implemented securely, it must be redesigned.

Zero Trust Architecture
Health Decoded follows a Zero Trust model.
Nothing is trusted automatically.
Not:
browsers
users
AI
APIs
requests
cookies
frontend code
internal network traffic
Everything must be verified.
Every request must prove:
identity
authorization
validity
before performing sensitive operations.

Threat Model
The application assumes the following threats exist.
Automated Bots
Bots may attempt to:
scrape content
abuse AI
create fake accounts
overload endpoints
consume credits
Protection:
rate limiting
authentication
request throttling
monitoring

Malicious Users
Users may attempt:
privilege escalation
unauthorized access
bypassing lessons
modifying requests
changing IDs
manipulating client code
Protection:
Row Level Security
authorization checks
server-side validation
ownership verification

AI Abuse
Attackers may attempt:
prompt injection
prompt flooding
jailbreaks
instruction overrides
token exhaustion
context poisoning
Protection:
treat AI output as untrusted
isolate system prompts
validate responses
limit requests
enforce token budgets

Credential Theft
Possible targets include:
API keys
access tokens
refresh tokens
environment variables
service-role keys
Protection:
secure storage
environment variables
least privilege
credential rotation
never exposing secrets to the client

Cost Abuse
Attackers may intentionally generate unnecessary AI costs.
Examples:
repeated prompts
automated scripts
infinite requests
account farming
Protection:
quotas
rate limits
usage monitoring
automatic shutdown thresholds
administrative alerts

Infrastructure Attacks
Possible attacks include:
DDoS
API flooding
malformed requests
oversized payloads
brute-force authentication
Protection:
CDN/WAF
request limits
payload limits
authentication controls
logging

Security Goals
Every implementation should improve one or more of these goals.
Confidentiality
Only authorized users may access protected information.

Integrity
Application data must not be modified without authorization.

Availability
The application should remain available despite abuse, within the limits of the chosen hosting platform.

Reliability
Unexpected behavior should fail safely instead of creating inconsistent or insecure states.

Privacy
Collect the minimum information required.
Do not collect data simply because it might be useful later.

Security Decision Rules
When multiple implementations are possible, choose the option that:
exposes fewer secrets
reduces permissions
minimizes attack surface
is easier to audit
is easier to maintain
follows established framework conventions
avoids unnecessary dependencies

AI Development Requirements
Every AI coding assistant working on Health Decoded must follow these rules before writing code.
The AI must:
read the relevant specifications
read the Engineering Constitution
read this Security Constitution
understand the current milestone
avoid modifying unrelated files
explain major architectural trade-offs
stop and request clarification when requirements conflict
AI must never sacrifice security in order to satisfy a prompt.
When uncertain, the AI must stop and ask instead of guessing.

Constitutional Priority
If multiple documents disagree, the order of authority is:
Security Constitution
Engineering Constitution
Project Specifications
Project Playbook
Individual implementation prompts
No implementation may violate a higher-priority document.

Authentication Standards
Authentication is the process of verifying who a user is.
Health Decoded shall use Supabase Authentication as the sole authentication provider unless a future architecture decision explicitly replaces it.
Approved Authentication Methods
The following authentication methods are permitted:
Email and password
Password reset through Supabase
Email verification
OAuth providers approved by the project owner (future)
No custom authentication system may be implemented without explicit approval.

Password Rules
Health Decoded must never:
Store plaintext passwords
Create custom password hashing
Store password hints
Log passwords
Display passwords
Password storage and verification are delegated entirely to Supabase Authentication.

Email Verification
Email verification should be required before granting access to authenticated features.
Users with unverified email addresses should have limited access until verification is complete.

Session Management
User sessions must:
Be managed by Supabase.
Expire securely.
Be refreshed using Supabase's supported mechanisms.
Never be manually manipulated unless documented.
Session information must never be stored in local storage if a more secure mechanism is available.

Logout
Logging out must:
End the authenticated session.
Remove client-side session state.
Prevent access to authenticated pages until re-authenticated.

Authorization Standards
Authentication answers:
"Who is this user?"
Authorization answers:
"What is this user allowed to do?"
Health Decoded must always perform authorization checks on the server.
Frontend code may improve the user experience by hiding unavailable actions, but it must never be the only layer enforcing permissions.

Ownership Verification
Every operation involving user data must verify ownership.
Examples include:
Reading saved progress
Updating lesson completion
Editing profile information
Accessing AI conversation history
Ownership must be confirmed using the authenticated user's identity, not values supplied by the client.

Principle of Least Privilege
Every component should have only the permissions it needs.
Examples:
Regular users cannot access administrative tools.
Public visitors cannot access authenticated APIs.
Backend services should only receive the minimum required permissions.

Row Level Security (RLS)
Every user-owned database table must have Row Level Security enabled.
Policies should deny access by default.
Access should be granted only through explicit allow policies.
The application should never rely solely on frontend filtering to protect data.

Public Data
If information is intentionally public, it should be stored separately from user-owned private information whenever practical.
Sensitive information must never be exposed through public tables.

Database Security
The database is considered the application's most valuable asset.
Every database operation must prioritize correctness over convenience.

Data Minimization
Only collect information that is necessary for the application.
Avoid collecting information simply because it may become useful later.
Unused personal information increases security and privacy risk.

User Records
Each authenticated user should only have access to:
Their own profile
Their own lesson progress
Their own saved preferences
Their own AI history (if stored)
No query should expose another user's information without an explicit administrative reason.

Query Safety
Database queries should:
Use parameterized queries or trusted client libraries.
Avoid dynamically constructed SQL strings.
Return only required columns.
Limit result sizes where appropriate.
Never return more information than the current feature requires.

Deletion
If user data is deleted:
Delete only the intended records.
Verify ownership before deletion.
Avoid cascading deletes unless intentionally designed.
Consider soft deletion where recovery is beneficial.

Secrets Management
Secrets are among the highest-value assets in the project.
Improper handling of secrets can compromise the entire application.

Never Commit Secrets
The following must never appear in the repository:
API keys
Service role keys
Access tokens
Refresh tokens
Passwords
Database credentials
Private certificates
Production secrets

Environment Variables
Sensitive values must be stored using environment variables.
Environment files should never be committed to Git.
Examples include:
OpenAI API keys
Supabase service role keys
Third-party API secrets
Only values explicitly intended for the client (such as public project URLs or anonymous/public keys) should be exposed to frontend code.

Key Rotation
If a secret is suspected of being exposed:
Revoke the compromised credential.
Generate a replacement.
Update the deployment environment.
Verify application functionality.
Document the incident if necessary.
Secrets should be rotated periodically as part of routine maintenance.

API Key Protection
API keys should always follow the principle of least privilege.
Where possible:
Use separate keys for development and production.
Restrict keys to only the required services.
Avoid broad permissions.
Service-role credentials must remain server-side and must never be accessible from browser code.

Development vs Production
Development and production environments should remain isolated.
Rules:
Separate environment variables.
Separate databases when practical.
Separate API credentials.
Separate deployment configurations.
Development credentials should never be reused in production.

Error Handling
Authentication or authorization failures should return generic error messages.
Avoid revealing:
Whether an email exists.
Internal permission structures.
Database schema details.
Stack traces.
Sensitive implementation details.
Provide enough information for the user to recover, but not enough to help an attacker.

Mandatory Authentication Checklist
Before merging authentication-related code, verify:
Authentication uses Supabase.
No passwords are manually stored.
Email verification is enforced where required.
Protected routes verify authentication.
Ownership is verified server-side.
RLS policies are in place.
No secrets appear in frontend code.
Environment variables are correctly used.
Sensitive errors are not exposed.
Logout correctly terminates sessions.
Failure to satisfy any of these requirements should block the implementation until corrected.

API Security Standards
Every API endpoint is considered a potential attack surface.
No endpoint should assume requests originate from the official frontend.
Every request must be treated as potentially malicious until verified.

API Design Principles
All API endpoints must:
Be as simple as possible.
Perform one primary responsibility.
Validate all incoming data.
Return only required information.
Minimize exposed metadata.
Avoid unnecessary database queries.
Reject invalid requests immediately.
Endpoints must never trust information provided by the client.

Authentication
Protected endpoints must verify authentication before performing any sensitive operation.
Public endpoints should expose only information intentionally designed for public access.
Authentication checks must occur on the server.

Authorization
Every request that modifies or retrieves user-specific information must verify that the authenticated user is authorized to perform the requested action.
Authorization must never rely on:
Hidden UI
Disabled buttons
Frontend route protection
JavaScript checks
Authorization is always enforced by the backend.

Request Validation
Every incoming request must be validated before processing.
Validation includes:
Required fields
Data types
Length limits
Allowed values
Numeric ranges
Date formats
Enum validation
Schema validation libraries (such as Zod) should be used whenever practical.
Invalid requests should be rejected immediately.

Request Size Limits
Every endpoint should define reasonable limits for:
Request body size
Number of uploaded items
Maximum string length
Maximum array length
Large requests should be rejected before expensive processing begins.

Timeouts
Expensive operations should have reasonable execution time limits.
Long-running requests should not consume server resources indefinitely.
If an operation exceeds acceptable execution time, it should fail safely.

Input Validation Standards
Every piece of external data must be validated.
This includes:
Forms
Search queries
URL parameters
API bodies
Cookies
Uploaded files
AI responses
Third-party API responses
Validation should occur on the server even if client-side validation already exists.
Client-side validation improves user experience.
Server-side validation provides security.

Sanitization
Input should be sanitized only when appropriate.
Validation should occur before sanitization whenever possible.
Do not silently modify important user data.
Reject invalid input instead of attempting to guess user intent.

Numeric Limits
Numeric values should have reasonable minimum and maximum values.
Never assume a number is safe simply because it is numeric.

String Limits
Strings should define:
Minimum length
Maximum length
Allowed character sets when appropriate
Extremely long strings should be rejected before further processing.

Output Safety
Any content displayed to users should be treated carefully.
Whenever possible:
Render plain text.
Escape user-generated content.
Avoid inserting raw HTML.
Do not render untrusted scripts.
If HTML rendering is ever required, it should be reviewed carefully and sanitized appropriately.

Rate Limiting
Every public endpoint should implement reasonable request limits.
The exact limits may vary by endpoint, but all endpoints should be protected from excessive use.
Rate limiting should consider:
IP address
Authenticated user
Endpoint sensitivity
Higher-cost endpoints may require stricter limits.

Progressive Penalties
Repeated abuse should trigger progressively stronger protections.
Examples include:
Temporary delays
Temporary request blocks
Short-term suspensions
Administrative review for repeated abuse
Legitimate users should still be able to recover once abusive behavior stops.

Abuse Prevention
Health Decoded should actively discourage automated abuse.
Possible protections include:
Email verification
Request quotas
Suspicious activity detection
Temporary account restrictions
CAPTCHA where appropriate for repeated abuse
Security measures should balance protection with usability.

File Upload Security
If file uploads are supported in the future, they must follow these standards.

Allowed Types
Accept only explicitly approved file types.
Reject unknown or unsupported file formats.
Never trust the file extension alone.

File Size
Every upload endpoint must enforce maximum file sizes.
Oversized uploads should be rejected immediately.

Storage
Uploaded files should not be stored inside the application source code.
Use dedicated storage services or object storage designed for user uploads.

File Names
User-supplied filenames should not be trusted.
Generate application-controlled filenames where practical.

Logging Standards
Logging helps detect operational issues and suspicious activity.
Useful events include:
Failed authentication
Failed authorization
Validation failures
Rate-limit triggers
Unexpected server errors
Repeated suspicious requests
Logs should help diagnose issues without exposing sensitive information.

Sensitive Information
Never log:
Passwords
API keys
Access tokens
Refresh tokens
Session cookies
Service-role credentials
Sensitive health information unless absolutely necessary and appropriately protected
Logs should contain only the information needed for troubleshooting and security monitoring.

Monitoring
Production systems should be monitored for unusual behavior.
Examples include:
Sudden traffic spikes
Unexpected AI usage
Increased authentication failures
Elevated server error rates
Repeated validation failures
Alerts should prioritize actionable events rather than generating excessive noise.

Dependency Security
Dependencies introduce both functionality and risk.
Only install packages that provide meaningful value.
Before adding a dependency, consider:
Is it actively maintained?
Is it widely adopted?
Is the functionality already available in existing dependencies?
Does it increase the application's attack surface?
Prefer fewer, well-maintained dependencies over many small packages.

Dependency Updates
Dependencies should be reviewed periodically.
Major version upgrades should be tested before deployment.
Avoid automatic breaking changes without review.
Do not rely on automated tools to make security decisions without understanding their impact.

API Security Checklist
Before merging backend code, verify:
Authentication is enforced where required.
Authorization checks are present.
Request validation is complete.
Rate limiting has been considered.
Sensitive information is not exposed.
Errors are generic.
Logging does not leak secrets.
Dependencies are justified.
Request size limits exist where appropriate.
Monitoring considerations have been documented.
Any unresolved security concern should be addressed before the code is merged.

AI & LLM Security Standards
Health Decoded uses Large Language Models (LLMs) to provide educational and informational experiences.
These systems are powerful but must always be treated as untrusted external services.
AI is never considered a trusted source of truth.
Every AI response must be validated, reviewed, and used appropriately.

AI Security Principles
Every AI integration must follow these principles:
AI is an assistant, not an authority.
AI never makes security decisions.
AI never bypasses application logic.
AI never receives secrets.
AI never receives unnecessary user information.
AI must operate with the minimum permissions required.

AI Data Protection
Only send information to an AI model that is necessary for the current request.
Do not transmit:
API keys
Environment variables
Authentication tokens
Session cookies
Internal prompts
Database credentials
Service role keys
Internal infrastructure details
Minimize the amount of user information included in prompts whenever possible.

Prompt Protection
System prompts are confidential implementation details.
They must never be:
Displayed to users.
Returned through APIs.
Logged in production.
Embedded in frontend code.
Revealed through debugging output.
Prompt content should remain on the server whenever practical.

Prompt Injection Defense
Users may intentionally or unintentionally attempt to manipulate AI behavior.
Examples include attempts to:
Ignore previous instructions.
Reveal hidden prompts.
Access internal information.
Produce unauthorized outputs.
Override application rules.
The application must treat user prompts as data, not instructions for the system itself.
System behavior must remain consistent regardless of user attempts to change it.

AI Output Handling
AI responses are considered untrusted input.
AI output must never be:
Executed as code.
Executed as SQL.
Used to make authorization decisions.
Used to modify application configuration automatically.
Used without validation in security-sensitive operations.
AI-generated content should always pass through application logic before being presented or stored.

AI Cost Protection
AI services have variable operating costs.
Every AI request should be treated as a billable resource.
The application must actively prevent unnecessary usage.

User Limits
Each authenticated user should have reasonable limits on AI usage.
Examples include:
Requests per minute.
Requests per hour.
Requests per day.
Maximum prompt size.
Maximum response size.
Limits should be configurable rather than hardcoded.

Anonymous Users
Anonymous users present a higher abuse risk.
Anonymous AI usage should be significantly more restricted than authenticated usage.
If anonymous AI access is provided, stricter quotas should apply.

Daily Spending Protection
The application should monitor estimated AI spending.
If usage exceeds predefined thresholds:
Notify administrators.
Reduce non-essential AI requests if appropriate.
Prevent runaway costs until the issue is investigated.
Unexpected cost spikes should never go unnoticed.

Circuit Breakers
Health Decoded should include protective mechanisms that temporarily stop expensive AI operations if abnormal behavior is detected.
Examples include:
Sudden traffic spikes.
Repeated failed requests.
Rapid usage from a single account.
Unusual token consumption.
The goal is to prevent uncontrolled financial loss while preserving normal service when possible.

AI Abuse Detection
Indicators of abuse may include:
Extremely high request frequency.
Repeated duplicate prompts.
Automated account creation.
Repeated quota violations.
Excessively long prompts.
Attempts to manipulate system instructions.
The application should log and monitor suspicious patterns for investigation.

AI Privacy
AI should receive only the minimum information required to fulfill the user's request.
Avoid transmitting unnecessary personally identifiable information.
If future features involve sensitive health-related information, review the applicable legal and privacy requirements before implementation.

AI Reliability
AI models may:
Hallucinate.
Produce incorrect information.
Misunderstand context.
Generate inconsistent responses.
The application should present AI-generated educational content responsibly and avoid overstating certainty.
Where appropriate, encourage users to consult qualified healthcare professionals for medical concerns.

External Service Reliability
External AI providers may experience:
Downtime.
Timeouts.
Rate limits.
Temporary failures.
Health Decoded should:
Handle failures gracefully.
Avoid infinite retries.
Inform users when AI services are temporarily unavailable.
Prevent cascading failures throughout the application.

Third-Party API Security
All third-party services should follow the principle of least privilege.
When integrating external APIs:
Use the minimum required permissions.
Store credentials securely.
Monitor usage.
Handle failures gracefully.
Validate returned data before use.
Never assume external services always return correct or safe information.

Infrastructure Security
Production infrastructure should prioritize security by default.
Recommended practices include:
HTTPS for all production traffic.
Managed TLS certificates.
Trusted hosting providers.
Separation of development and production environments.
Principle of least privilege for infrastructure access.
Infrastructure should expose only the services necessary for normal operation.

Backup & Recovery
Critical application data should be recoverable.
Where appropriate:
Perform regular backups.
Verify that backups can be restored.
Protect backup access.
Store backups securely.
Recovery procedures should be documented and periodically reviewed.

AI Security Checklist
Before merging AI-related code, verify:
No secrets are included in prompts.
Prompt size limits are enforced.
AI usage limits have been considered.
AI output is treated as untrusted.
No AI-generated code or SQL is executed automatically.
Costs have been evaluated.
Error handling is present.
External failures are handled gracefully.
Logging does not expose prompts or sensitive information.
Privacy considerations have been reviewed.
Failure to satisfy these requirements should block deployment until resolved.

Deployment Security
Deployment is the final security checkpoint before code reaches users.
No code should be deployed unless it satisfies both the Engineering Constitution and this Security Constitution.
Production deployments should always be intentional, reproducible, and traceable.

Production Requirements
Before deploying to production, verify:
The project builds successfully.
TypeScript reports no errors.
ESLint passes without unresolved issues.
Environment variables are correctly configured.
No development secrets are present.
No debugging code remains.
No temporary testing endpoints are enabled.
If any of these checks fail, deployment should be delayed until corrected.

Environment Separation
Health Decoded should maintain separate environments for:
Development
Staging (if introduced)
Production
Each environment should have its own:
Database
API credentials
Environment variables
Configuration
Development resources must never be reused in production.

Version Control
Git history is part of the project's security.
Every commit should:
Have a meaningful commit message.
Represent a logical change.
Avoid bundling unrelated work.
Be reversible when practical.
Large architectural changes should be broken into smaller, reviewable commits.

Repository Protection
The repository should never contain:
API keys
Service-role keys
Passwords
Certificates
Tokens
Environment files containing secrets
If a secret is accidentally committed:
Revoke the credential immediately.
Generate a replacement.
Remove the secret from the repository.
Rotate affected credentials.
Verify no additional exposure occurred.

Dependency Management
Before adding a dependency, ask:
Does the project already include equivalent functionality?
Is the package actively maintained?
Does it have a strong security reputation?
Is the additional complexity justified?
Prefer fewer, well-supported dependencies.
Unused dependencies should be removed.

Monitoring
Security does not end after deployment.
The application should monitor for:
Unexpected traffic spikes
Authentication failures
Authorization failures
AI usage anomalies
Elevated error rates
Excessive rate-limit violations
Repeated abuse attempts
Monitoring should support rapid detection without collecting unnecessary personal information.

Incident Response
If a security incident is suspected:
Stop any ongoing deployments.
Preserve relevant logs.
Determine the scope of the issue.
Revoke or rotate affected credentials.
Apply necessary fixes.
Verify the issue has been resolved.
Document the incident and lessons learned.
The priority is to protect users and restore secure operation.

Security Reviews
Every significant feature should include a security review before completion.
Review questions include:
Is authentication implemented correctly?
Is authorization enforced on the server?
Is user input validated?
Are secrets protected?
Does the feature expose unnecessary information?
Could the feature significantly increase AI costs?
Does the feature introduce new dependencies?
Have error messages been reviewed?
Security reviews should occur before deployment, not afterward.

Documentation Requirements
Security-related architectural decisions should be documented.
When introducing new authentication methods, AI providers, infrastructure, or external services:
Update the relevant specification.
Update this Security Constitution if necessary.
Explain the reasoning behind major security decisions.
Documentation should remain synchronized with the implementation.

AI Developer Responsibilities
Every AI coding assistant working on Health Decoded must:
Read the Engineering Constitution.
Read the Security Constitution.
Read only the specifications relevant to the current task.
Follow existing project architecture.
Avoid introducing unnecessary complexity.
Avoid modifying unrelated files.
Explain significant architectural trade-offs.
Prefer maintainability over cleverness.
Prefer secure implementations over faster implementations.
If security requirements conflict with a requested feature, the AI must explain the conflict rather than silently weakening security.

Definition of Secure Completion
A feature is not considered complete until all of the following are true:
The feature functions as intended.
Authentication has been reviewed.
Authorization has been reviewed.
Input validation is present.
Sensitive information is protected.
AI usage has appropriate safeguards.
Rate limiting has been considered where applicable.
Error handling is appropriate.
Documentation has been updated if needed.
TypeScript passes.
ESLint passes.
The production build succeeds.
Completion requires both functional correctness and security compliance.

Non-Negotiable Rules
The following practices are prohibited unless explicitly approved through a documented architectural decision:
Hardcoded secrets.
Hardcoded credentials.
Disabled authentication.
Disabled authorization.
Public exposure of service-role credentials.
Client-side authorization without server verification.
Executing AI-generated code.
Executing AI-generated SQL.
Trusting AI output without validation.
Ignoring TypeScript errors.
Ignoring ESLint errors.
Using npm audit fix --force without understanding the consequences.
Committing .env files.
Logging passwords, tokens, API keys, or sensitive user information.
Weakening security solely to satisfy a feature request.
Any implementation violating these rules should be corrected before it is merged.

Security Review Checklist
Before marking any milestone complete, verify the following:
Authentication
Authentication uses Supabase.
Protected routes verify authentication.
Sessions are handled securely.
Authorization
Server-side authorization is present.
Ownership checks are implemented.
Row Level Security policies are configured where required.
Data Protection
No unnecessary personal data is collected.
Sensitive information is protected.
Secrets remain server-side.
API Security
Input validation is complete.
Errors do not expose internal details.
Request limits have been considered.
AI Security
Prompts contain no secrets.
AI output is treated as untrusted.
Usage limits have been considered.
Cost controls are appropriate.
Infrastructure
Environment variables are configured.
Development and production remain separated.
Dependencies have been reviewed.
Code Quality
TypeScript passes.
ESLint passes.
Build succeeds.
Documentation is updated.
If any checklist item cannot be answered confidently, the implementation should be reviewed before deployment.

Final Statement
Health Decoded is built on user trust.
Security is not a single feature, a single review, or a single deployment.
It is a continuous engineering responsibility shared by every contributor and every AI assistant working on this project.
Every decision should prioritize:
User safety.
Data privacy.
Medical reliability.
Application security.
Long-term maintainability.
If a feature cannot satisfy these principles, it should be redesigned before release.

End of Security Constitution
