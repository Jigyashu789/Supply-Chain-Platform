---
description: How to push code to GitHub
---

1. Initialize Git (if not already done)
```bash
git init
```

2. Add all files to staging
```bash
git add .
```

3. Commit the changes
```bash
git commit -m "feat: implemented phase 2 microservices and UI updates"
```

4. Add the remote repository (replace URL with your actual repository URL)
```bash
# Example: git remote add origin https://github.com/username/repo-name.git
# If origin already exists, you can skip this or set a new url
```

5. Push to the main branch
```bash
git branch -M main
git push -u origin main
```
