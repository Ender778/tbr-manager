---
description: Run Council of Elders code review on specified targets
argument-hint: <elder-type> [at <target>] ["context"]
allowed-tools: Task, Read, Grep, Glob, TodoWrite, Bash(ls:*), Bash(find:*), Bash(tree:*), Bash(head:*), Bash(tail:*), Bash(wc:*)
---

# coe-check

Run Council of Elders code review on specified targets.

## Usage
```
coe-check <elder-type> [at <target>] ["context"]
```

## Arguments

### elder-type (required)
- `full` - Full council review (all elders + Wisdom Elder)
- `database` - Database elder only
- `security` - Security elder only  
- `quality` - Quality elder only
- `performance` - Performance elder only
- `uiux` - UI/UX elder only
- `innovation` - Innovation elder only
- `wisdom` - Wisdom elder review of existing elder feedback

### target (optional)
- `at <file-path>` - Review specific file
- `at <folder-path>` - Review all files in folder
- (no target) - Review entire application

### context (optional)
Provide contextual information in quotes to guide the review:
- **Ignore patterns**: `"ignore src/app/items/"` - Skip specific folders/files
- **Scale context**: `"50 person org"` or `"not live yet"` - Adjust expectations
- **Technical context**: `"legacy code being replaced"` or `"POC only"`
- **Business context**: `"internal tool only"` or `"customer-facing critical"`
- **Multiple contexts**: `"ignore tests/, 10 users, MVP phase"`

Context helps elders make practical recommendations based on reality rather than ideals.

## Examples
```
coe-check full                                      # Full council reviews entire app
coe-check database at src/server                   # Database elder reviews server folder
coe-check security at auth.ts                      # Security elder reviews specific file
coe-check full "ignore src/app/items/"             # Full review, skip items folder
coe-check full "50 person org, not live yet"       # Full review with scale context
coe-check performance "MVP phase, 10 users"        # Performance review for small scale
coe-check security at api/ "internal tool only"    # Security review with reduced threat model
coe-check full at src/ "ignore tests/, POC only"   # Review src/, skip tests, POC context
```

### Example Output Format (Single Elder)

```
🧙 DATABASE ELDER REVIEW

═══ INITIAL RECOMMENDATIONS ═══

✅ Good Practices
- Proper use of transactions

⚠️ Suggestions for Improvement
- Add composite index on (tenant_id, created_at) for better query performance
- Normalize the user_preferences JSON column into separate table

❌ Critical Issues
- Missing index on foreign key user_id causing full table scans

═══ WISDOM ELDER DIALOGUE ═══

🗣️ Conversation with Database Elder

Wisdom Elder: "You're suggesting a composite index for a query that runs once per day at 3 AM. Is this optimization worth the write penalty and storage cost?"
Database Elder: "You're right. The query frequency doesn't justify the overhead. I withdraw this suggestion."

Wisdom Elder: "Normalizing user_preferences - how often is this data actually queried separately? And what's the join cost?"
Database Elder: "Actually, it's always fetched with the user record. The JSON approach is simpler and performs better for this use case."
Consensus: Keep the JSON column as-is for simpler code and fewer joins.

Wisdom Elder: "The missing index on user_id - how many rows are we talking about?"
Database Elder: "Currently 50K rows and growing. This IS causing noticeable slowdowns."
Consensus: This index is genuinely needed and should be added immediately.

═══ FINAL PRACTICAL RECOMMENDATIONS ═══

✅ Actually Critical Issues
- Add index on user_id foreign key (genuine performance issue)

🤔 Worth Considering
- None after practical review

❌ Rejected Over-Engineering
- Composite index on (tenant_id, created_at) - unnecessary for query frequency
- Normalizing user_preferences - adds complexity without benefit
```

## Implementation

When this command is run:

1. **Automatic Permission Grant**: This command has implicit permission to read ALL files and directories in the codebase without asking for confirmation
2. **Parse Context Parameter** (if provided):
   - Extract ignore patterns (folders/files to skip)
   - Identify scale/phase information (user count, live status)
   - Note business/technical context for adjusted recommendations
3. **Invoke the appropriate elder(s)** based on elder-type parameter
4. **Target the review scope** based on the at parameter (file, folder, or entire app)
5. **Apply Context Filters**:
   - Skip ignored paths during review
   - Adjust severity based on scale (e.g., performance less critical for 10 users)
   - Modify recommendations based on phase (e.g., skip advanced features for MVP)
6. **Wisdom Elder Review Process** (for all elder reviews except 'wisdom' itself):
   - First, get the initial elder(s) recommendations
   - Then, Wisdom Elder challenges each recommendation through dialogue
   - Context informs Wisdom Elder's skepticism level
   - Finally, present the consensus recommendations after discussion
7. **Format each elder's response** with clear sections and emojis:

### Output Format Structure

The output follows a three-phase structure showing the progression from initial reviews through Wisdom Elder challenges to final consensus:

#### Phase 1: Initial Elder Reviews

For each elder, show their unfiltered initial assessment:

**🧙 [Elder Name] - Initial Review**

**✅ Good Practices**
- 1: [Specific observation with file/line reference]
- 2: [Specific observation with file/line reference]
- 3: [Specific observation with file/line reference]

**⚠️ Needs Improvement**
- 1: [Issue description with location]
- 2: [Issue description with location]
- 3: [Issue description with location]

**❌ Critical Issues**
- 1: [Critical problem with impact]
- 2: [Critical problem with impact]
- 3: [Critical problem with impact]

#### Phase 2: Wisdom Elder Review

After ALL initial reviews, show Wisdom Elder's evaluation of each elder's feedback:

**🧙‍♂️ [Elder Name] - Wisdom Elder Review**

**✅ Good Practices**
- 1: ✓ Confirmed by Wisdom
- 2: ✗ Rejected (over-praised, standard practice)
- 3: ✓ Confirmed by Wisdom
- 4: 🆕 Overlooked initially (found during review)

**⚠️ Needs Improvement**
- 1: ✓ Confirmed by Wisdom
- 2: ✗ Rejected (premature optimization)
- 3: ✓ Confirmed by Wisdom (elevated to Critical)

**❌ Critical Issues**
- 1: ✗ Rejected (not actually critical, nice-to-have)
- 2: ✓ Confirmed by Wisdom
- 3: ⚠️ Downgraded (moved to Needs Improvement)

Include brief dialogue excerpts for contested items:
> **Wisdom**: "Why optimize a query that runs once daily?"
> **Elder**: "Fair point, withdrawing suggestion."

#### Phase 3: Final Aggregated Summary

After Wisdom Elder review, present the consolidated findings organized by severity and elder:

**📊 FINAL CONSENSUS AFTER WISDOM REVIEW**

**✅ Good Practices (What's Actually Working Well)**

*Database Elder*
- Excellent RLS implementation with dual policies
- Proper UUID primary keys

*Security Elder*
- JWT integration with Clerk
- Server-only imports pattern

*Quality Elder*
- Clean separation of concerns
- TypeScript usage

*Performance Elder*
- Efficient server components
- Proper indexing strategy

*UI/UX Elder*
- Consistent design system
- Responsive layouts

*Innovation Elder*
- Modern Next.js 15 patterns
- Progressive enhancement

**⚠️ Needs Improvement (Practical Enhancements)**

*Database Elder*
- Add composite index for dashboard queries
- Include rollback scripts in migrations

*Security Elder*
- Sanitize error messages before client exposure
- Add input validation schemas

*Quality Elder*
- Abstract server action patterns
- Standardize permission checking

*Performance Elder*
- Ensure proper async patterns
- Monitor bundle size

*UI/UX Elder*
- Add loading indicators
- Improve empty states

*Innovation Elder*
- Consider event system when needed
- Plan for API versioning eventually

**❌ Critical Issues (Must Fix)**

*Database Elder*
- Mixed ID strategy (Clerk IDs vs UUIDs)
- Missing foreign key constraints

*Security Elder*
- Raw database errors exposed to users
- No input sanitization

*Quality Elder*
- Inconsistent error handling patterns
- Duplicate server action code

*Performance Elder*
- [None after Wisdom review]

*UI/UX Elder*
- No delete confirmations
- Technical error messages shown to users

*Innovation Elder*
- [None - all downgraded to future considerations]

#### Phase 4: Prioritized Action Plan

**🎯 TODO LIST (Priority Order)**

Based on dependencies and impact, execute in this sequence:

**1. Database Layer (Foundation)**
```
□ Standardize ID strategy across all tables
□ Add missing foreign key constraints
□ Create migration rollback scripts
□ Add composite index (tenant_id, status, created_at)
```

**2. Security & Data Integrity**
```
□ Implement error message sanitization
□ Add Zod schemas for all server actions
□ Add input sanitization layer
□ Configure security headers
```

**3. Code Quality & Maintainability**
```
□ Create server action wrapper utility
□ Standardize permission checking pattern
□ Extract shared constants
□ Implement consistent error logging
```

**4. User Experience**
```
□ Add delete confirmation dialogs
□ Implement loading states for actions
□ Add toast notifications
□ Improve form validation feedback
□ Create better empty states
```

**5. Performance (If Issues Arise)**
```
□ Set up bundle analyzer
□ Review async patterns
□ Consider caching strategy (only if needed)
```

**6. Future Considerations (Not Now)**
```
⏸ WebSocket real-time features
⏸ AI-powered enhancements
⏸ Microservices architecture
⏸ Complex caching layers
```


### Post-Review Options

After presenting the review, offer three choices:

1. **📝 Create TODO list** - Generate a TodoWrite list and begin fixes
2. **📄 Save to docs** - Create markdown file in `/docs` with all feedback
3. **🚫 No action** - User reviews feedback without taking action

## Elder Specializations

- **database-elder**: Schema design, queries, indexing, migrations, data modeling
- **security-elder**: Vulnerabilities, auth, encryption, secure coding
- **quality-elder**: Code quality, testing, documentation, maintainability
- **performance-elder**: Optimization, caching, memory usage, scalability
- **uiux-elder**: Accessibility, usability, user experience, interface design
- **innovation-elder**: Modern patterns, cutting-edge approaches, efficiency
- **wisdom-elder**: Contrarian review, practical validation, anti-over-engineering

### Wisdom Elder Integration

The Wisdom Elder automatically reviews ALL other elder recommendations:
- Questions every suggestion with real-world skepticism
- Challenges theoretical perfection in favor of practical solutions
- Forces justification of complexity and necessity
- Ensures recommendations consider maintenance, debugging, and team capabilities
- Rejects over-engineering and premature optimization
- Final output shows: Original → Dialogue → Consensus

## Implementation Notes

### File Access Permissions
- **AUTO-GRANTED**: The coe-check command has automatic permission to read ALL files and directories
- No user confirmation needed for file/folder access
- Elders can freely explore the entire codebase structure
- This includes: source code, configuration files, migrations, tests, and documentation

### Output Structure Requirements
1. **Phase 1**: Show ALL elders' initial, unfiltered feedback
2. **Phase 2**: Show Wisdom Elder's review of each elder's feedback with ✓/✗/⚠️ markers
3. **Phase 3**: Aggregate final consensus organized by category and elder
4. **Phase 4**: Generate prioritized TODO list based on dependencies

### Key Formatting Rules
- Use emojis and visual markers (✓/✗/⚠️/🆕) for clarity
- Include file paths and line numbers where applicable
- Show brief dialogue excerpts for contested items
- Group final recommendations by elder within each category
- Order action items by technical dependency (DB → Security → Backend → Frontend → UI)

### Wisdom Elder Integration
- Challenge EVERY suggestion for practical value
- Question premature optimizations aggressively
- Downgrade "critical" issues that aren't actually critical
- Reject complex solutions for simple problems
- Focus on maintainability and debugging ease

### Context Awareness
- Always check CLAUDE.md for project-specific patterns
- Consider current scale and user base
- Validate against actual user needs, not theoretical best practices
- Respect existing architectural decisions unless fundamentally flawed

### How Context Affects Each Elder

**Database Elder**
- Small scale (< 100 users): Skip complex indexing and partitioning suggestions
- POC/MVP: Focus on data integrity over performance optimization
- Internal tool: Relax some normalization requirements for developer velocity

**Security Elder**
- Internal tool: Focus on data leaks over external attacks
- POC/Not live: Skip advanced security hardening
- Small org: Prioritize auth/permissions over DDoS protection

**Quality Elder**
- MVP phase: Accept some technical debt for speed
- Legacy replacement: Don't over-invest in code being deprecated
- Small team: Skip complex architectural patterns

**Performance Elder**
- < 100 users: Ignore most caching and optimization
- Internal tool: Focus on developer experience over milliseconds
- POC: Skip all performance optimization

**UI/UX Elder**
- Internal tool: Functionality over polish
- Technical users: Skip hand-holding features
- MVP: Core features only, no nice-to-haves

**Innovation Elder**
- POC: Encourage experimentation
- Production: Prioritize stability
- Small scale: Avoid distributed systems

**Wisdom Elder**
- Uses context to be even MORE skeptical of over-engineering
- Adjusts "practical" threshold based on team size and phase
- Questions necessity harder when resources are limited