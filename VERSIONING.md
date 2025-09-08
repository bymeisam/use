# Versioning Process

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automatic versioning and publishing based on conventional commits.

## How It Works

When you push commits to the `master` branch, the GitHub Action will:

1. **Analyze commit messages** using conventional commit format
2. **Determine version bump** (patch, minor, major)
3. **Update package.json** with new version
4. **Generate CHANGELOG.md** with release notes
5. **Publish to npm** automatically
6. **Create GitHub release** with generated notes
7. **Commit changes back** to the repository

## Conventional Commit Format

Use this format for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types and Version Bumps

| Type | Description | Version Bump | Example |
|------|-------------|--------------|---------|
| `fix:` | Bug fixes | **Patch** (0.1.0 → 0.1.1) | `fix: resolve memory leak in useEffect` |
| `feat:` | New features | **Minor** (0.1.0 → 0.2.0) | `feat: add useLocalStorage hook` |
| `feat!:` | Breaking changes | **Major** (0.1.0 → 1.0.0) | `feat!: remove deprecated useCounter hook` |
| `BREAKING CHANGE:` | Breaking changes | **Major** (0.1.0 → 1.0.0) | Any commit with this in body/footer |

### Other Types (No Version Bump)

These types won't trigger a release but help organize commits:

- `docs:` - Documentation changes
- `style:` - Code formatting, whitespace
- `refactor:` - Code refactoring without feature changes
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates
- `ci:` - CI/CD configuration changes

## Examples

### Patch Release (Bug Fix)
```bash
git commit -m "fix: resolve infinite loop in useDebounce hook"
# Results in: 0.1.0 → 0.1.1
```

### Minor Release (New Feature)
```bash
git commit -m "feat: add useToggle hook for boolean state management"
# Results in: 0.1.0 → 0.2.0
```

### Major Release (Breaking Change)
```bash
git commit -m "feat!: change useCounter API to return object instead of array

BREAKING CHANGE: useCounter now returns { count, increment, decrement } 
instead of [count, increment, decrement]"
# Results in: 0.1.0 → 1.0.0
```

### Multiple Commits
```bash
git commit -m "docs: update README with new examples"
git commit -m "fix: handle edge case in useAsync hook"
git commit -m "feat: add useInterval hook"
# Results in: 0.1.0 → 0.2.0 (highest bump wins)
```

## Release Process

1. **Create feature branch**: `git checkout -b feature/new-hook`
2. **Make changes** with conventional commits
3. **Create pull request** to `master`
4. **Merge to master** - this triggers automatic release
5. **Check GitHub releases** - new version will be published automatically

## Manual Release

If needed, you can trigger a release manually:

1. Go to **Actions** tab in GitHub
2. Select **Publish to NPM** workflow  
3. Click **Run workflow** button
4. Choose the `master` branch and run

## Configuration

The versioning configuration is in `.releaserc.json`:

- **Branches**: Only `master` triggers releases
- **Plugins**: Handles analysis, changelog, npm publishing, GitHub releases
- **Assets**: Updates `package.json` and `CHANGELOG.md`

## Tips

- Use `fix:` for backward-compatible bug fixes
- Use `feat:` for backward-compatible new features  
- Use `feat!:` or `BREAKING CHANGE:` for breaking changes
- Be descriptive in commit messages - they become release notes
- Group related changes in single commits when possible
- Use scopes for better organization: `feat(hooks): add useLocalStorage`