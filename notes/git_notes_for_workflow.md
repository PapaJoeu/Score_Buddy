# Git Workflow for Personal Projects

## Branch Strategy

### Main Branch
- This branch should always be in a deployable state. Only tested and stable code should be merged here.
- Use this branch for hosting on a website.

### Production Branch
- This branch is used for production releases. It should be stable and reflect the live production environment.
- Create release tags on this branch.

### Development Branch
- All new features, bug fixes, and other changes should be made in separate branches created from the main branch. Once changes are tested and ready, they can be merged back into the main branch.

## Using Branches and Issues

### Creating Branches for Features or Fixes
- For each new feature or bug fix, create a separate branch from the main branch. Use a naming convention that makes it clear what the branch is for:
```bash
git checkout -b feature/your-feature-name
git checkout -b fix/your-fix-name
```

### Merging Changes
After making changes and committing them to your feature or fix branch, create a pull request (PR) to merge these changes back into the main branch. Review the changes and ensure everything works correctly before merging.
Merge the feature branch into the main branch:
```bash
git checkout main
git merge feature/your-feature-name
git push origin main
```

### Managing Issues
Use GitHub issues to track bugs, enhancements, and other tasks. Create issues without automatically creating branches.
When you start working on an issue, manually create a branch from the main branch and reference the issue number in the branch name for clarity:
```bash
git checkout -b issue-123-description
```

### Deploying to Production
Once changes in the main branch are stable and tested, merge them into the production branch to reflect the live environment:
```bash
git checkout production
git merge main
git push origin production
```

## Workflow Example
1. Create an Issue
    - Go to your GitHub repository and create a new issue describing the task or bug.

2. Create a Branch for the Issue
```bash
git checkout main
git pull origin main
git checkout -b issue-123-description
```

3. Make Changes and Commit
    - Make your code changes and commit them:
```bash
git add .
git commit -m "Fix issue #123: Description of the fix"
git push origin issue-123-description
```

4. Create a Pull Request
    - On GitHub, create a PR to merge your branch into the main branch. Review and merge the PR.

5. Merge to Production
    - After thorough testing, merge the main branch into the production branch:
```bash
git checkout production
git merge main
git push origin production
```

By following this workflow, you can keep your project organized, maintain a clear history of changes, and ensure stability in your main and production branches.

```csharp
You can save this content into a file named `git_workflow.md` for easy reference.
```
