# coe-check

Run Council of Elders code review on specified targets.

## Usage
```
coe-check <elder-type> [at <target>]
```

## Arguments

### elder-type (required)
- `full` - Full council review (all elders)
- `database` - Database elder only
- `security` - Security elder only  
- `quality` - Quality elder only
- `performance` - Performance elder only
- `uiux` - UI/UX elder only
- `innovation` - Innovation elder only

### target (optional)
- `at <file-path>` - Review specific file
- `at <folder-path>` - Review all files in folder
- (no target) - Review entire application

## Examples
```
coe-check full                    # Full council reviews entire app
coe-check database at src/server  # Database elder reviews server folder
coe-check security at auth.ts     # Security elder reviews specific file
```

## Implementation

When this command is run:

1. **Invoke the appropriate elder(s)** based on elder-type parameter
2. **Target the review scope** based on the at parameter (file, folder, or entire app)
3. **Format each elder's response** with clear sections and emojis:

### Elder Response Format

**🧙 [Elder Name] Review**

**✅ Good Practices**
- Detailed explanation of what's done well
- Specific examples of good patterns
- Acknowledgment of best practices followed

**⚠️ Suggestions for Improvement**  
- Areas that could be enhanced
- Alternative approaches to consider
- Non-critical optimizations

**❌ Critical Issues**
- Must-fix problems
- Security vulnerabilities
- Breaking bugs or anti-patterns

### Multi-Elder Summary (for full council)

After all elders provide feedback:

**📋 Consolidated Action Items**

1. **Critical Fixes** (ordered by dependency)
   - Database issues that block other fixes come first
   - Security vulnerabilities 
   - Breaking functionality

2. **Recommended Improvements**
   - High-value suggestions
   - Performance optimizations
   - Code quality enhancements

3. **Optional Enhancements**
   - Nice-to-have improvements
   - Future considerations

**⚖️ Mediator's Note**
- Flag any over-engineering suggestions
- Identify unnecessarily complex solutions
- Balance ideal vs practical recommendations

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

## Implementation Notes

- Use emojis liberally in output for visual clarity
- Be concise yet detailed in explanations
- Order action items by dependency (DB → Backend → Frontend → UI)
- Act as mediator to prevent over-engineering
- Clearly separate each elder's feedback
- Provide actionable, specific recommendations
- Consider the project's current patterns and conventions and always make sure to check against the CLAUDE.md file in the root directory for additional project context.