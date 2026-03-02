# Repository Rename Instructions

## ⚠️ Action Required: Rename GitHub Repository

The local git remote has been updated to point to the new repository name. You need to rename the repository on GitHub.

---

## Steps to Rename on GitHub

### 1. Go to Repository Settings

1. Navigate to: https://github.com/rafatocantins/ia-design-system
2. Click **Settings** tab
3. Scroll down to **Danger Zone**

### 2. Rename Repository

1. Click **Change repository name**
2. Enter new name: `fluxxis`
3. Click **Rename**

**GitHub will automatically:**
- Redirect old URLs to new URLs
- Update git remote URLs for clones
- Preserve all issues, PRs, stars, etc.

---

## After Renaming

### Verify Remote URL

```bash
cd C:\Users\Integer\projects\ia-design-system
git remote -v
```

**Expected output:**
```
origin	https://github.com/rafatocantins/fluxxis.git (fetch)
origin	https://github.com/rafatocantins/fluxxis.git (push)
```

### Update Local Folder Name (Optional)

```bash
# Navigate to parent directory
cd C:\Users\Integer\projects

# Rename folder
ren ia-design-system fluxxis

# Navigate to new folder
cd fluxxis

# Verify git still works
git status
```

### Update Documentation Links

Update these files with new repository URL:

| File | Current URL | New URL |
|------|-------------|---------|
| README.md | `github.com/rafatocantins/ia-design-system` | `github.com/rafatocantins/fluxxis` |
| FLUXXIS-MASTER-PLAN.md | `github.com/rafatocantins/ia-design-system` | `github.com/rafatocantins/fluxxis` |
| package.json | `github.com/rafatocantins/ia-design-system` | `github.com/rafatocantins/fluxxis` |

---

## NPM Package Name

The npm package will be `@fluxxis/core` and `@fluxxis/react`, which is independent of the GitHub repository name.

**No changes needed to:**
- npm package names (already set to `@fluxxis/*`)
- package.json name fields (already updated)

---

## Checklist

- [ ] Rename repository on GitHub
- [ ] Verify remote URL (`git remote -v`)
- [ ] Update README.md links
- [ ] Update FLUXXIS-MASTER-PLAN.md links
- [ ] Update package.json repository field
- [ ] Test `git push` and `git pull`
- [ ] Update any bookmarks/favorites
- [ ] Notify team members of new URL

---

## New Repository URL

**After rename:**
- **Web:** https://github.com/rafatocantins/fluxxis
- **Git:** https://github.com/rafatocantins/fluxxis.git
- **SSH:** git@github.com:rafatocantins/fluxxis.git

---

## Questions?

If you encounter issues:
1. Check GitHub's rename documentation: https://docs.github.com/en/repositories/configuring-managing-and-administering-your-repositories/renaming-a-repository
2. GitHub support: https://support.github.com
3. Check redirect: Old URLs should redirect to new URLs automatically

---

**Status:** ⏳ Pending  
**Priority:** 🔴 High (do before next push)
