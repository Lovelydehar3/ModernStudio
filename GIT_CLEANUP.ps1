# Git Repository Cleanup Script for Modern Studio
# This script will identify large files in history and prune the repository.

Write-Host "--- Git Repository Diagnosis ---" -ForegroundColor Cyan
git count-objects -vH

Write-Host "`n--- Finding Top 10 Largest Objects in History ---" -ForegroundColor Cyan
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sort -nr -k 3 | head -n 10

Write-Host "`n--- Recommended Cleanup Steps ---" -ForegroundColor Yellow
Write-Host "1. If you see node_modules or dist in the list above, run:"
Write-Host "   git filter-repo --path node_modules --invert-paths"
Write-Host "   git filter-repo --path client/node_modules --invert-paths"
Write-Host "   git filter-repo --path server/node_modules --invert-paths"
Write-Host "   git filter-repo --path client/dist --invert-paths"

Write-Host "`n2. Alternatively, run a deep garbage collection:"
Write-Host "   git gc --prune=now --aggressive"

Write-Host "`n3. After cleanup, try to push again:"
Write-Host "   git push origin main --force"

Write-Host "`nNOTE: If git-filter-repo is not installed, install it via 'pip install git-filter-repo' or 'brew install git-filter-repo'."
