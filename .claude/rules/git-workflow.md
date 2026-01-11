# Git Workflow Rules

## Before Pushing

**ALWAYS pull and merge before pushing.** Never force push without explicit user permission.

### Required Steps

1. **Fetch latest changes**
   ```bash
   git fetch origin
   git fetch othentic
   ```

2. **Check for divergence**
   ```bash
   git status
   ```

3. **Pull and merge if needed**
   ```bash
   git pull origin master --no-rebase
   git pull othentic main --no-rebase
   ```

4. **If conflicts occur:**
   - Review each conflict carefully
   - Preserve both sets of changes when possible
   - Ask user if unsure which version to keep
   - Test build after resolving conflicts
   - Commit the merge with clear message

5. **Push to both remotes**
   ```bash
   git push origin master
   git push othentic master:main
   ```

### Conflict Resolution Guidelines

| Scenario | Action |
|----------|--------|
| Code conflicts | Merge both changes if compatible |
| Formatting conflicts | Use the newer version |
| Feature conflicts | Ask user which to keep |
| Package.json conflicts | Merge dependencies, bump version |

### Never Do

- `git push --force` without explicit user approval
- `git reset --hard` on shared branches
- Overwrite others' commits without review
- Skip conflict resolution

### Commit Messages for Merges

```
Merge branch 'main' from othentic

Resolved conflicts:
- file1.ts: kept both feature implementations
- file2.ts: used newer formatting
```
