#!/usr/bin/env bash
# Organize project changes into logical conventional commits.
# Run from project root: ./scripts/organize-commits.sh
# Ensure you have no uncommitted changes you want to keep as one blob; otherwise
# this script assumes current state is to be split into the commits below.

set -e
cd "$(dirname "$0")/.."

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository. Run: git init"
  exit 1
fi

# Optional: create initial commit so we can split (skip if you already have commits)
# git add -A && git commit -m "chore: initial state before history reorganization" || true
# git reset --soft HEAD~1

echo "Staging and committing in order..."

# 1. ENV CLEANUP
git add .env.example README.md 2>/dev/null || true
git commit -m "chore(env): remove NEXT_PUBLIC_STRAPI_API_TOKEN from env and docs" --allow-empty 2>/dev/null || true

# 2. API INTEGRATION
git add src/shared/config/api.ts src/shared/config/escuelajs.ts src/shared/adapters/productAdapter.ts 2>/dev/null || true
git commit -m "feat(api): remove STRAPI token from code and integrate Escuela API with normalization" --allow-empty 2>/dev/null || true

# 3. CODE CLEANUP (comments; api/escuelajs/adapter already in commit 2)
git add src/app/layout.tsx src/app/page.tsx src/app/account/page.tsx src/app/cart/page.tsx \
  src/app/error.tsx src/app/login/page.tsx src/app/register/page.tsx \
  src/app/about/AboutPage.module.scss src/app/products/components/ProductsList/ProductsList.tsx \
  src/app/products/components/ProductsClient/ProductsClient.tsx \
  src/app/products/\[id\]/components/ProductClient/ProductClient.tsx \
  src/app/products/\[id\]/components/RelatedItems/RelatedItems.module.scss \
  src/app/shares/components/CaseOpeningSlider/CaseOpeningSlider.tsx \
  src/app/shares/components/CaseOpeningSlider/prizes.ts \
  src/shared/stores/StoreContext.tsx src/shared/stores/ProductsStore/ProductsStore.ts \
  src/shared/stores/ProductStore/ProductStore.ts src/shared/stores/DiscountStore/DiscountStore.ts \
  src/providers/StoreProvider.tsx src/shared/styles/variables.scss src/shared/styles/media.scss 2>/dev/null || true
git commit -m "chore(code): remove comments except in shared components" --allow-empty 2>/dev/null || true

git add package.json 2>/dev/null || true
git commit -m "chore(code): remove unused dependencies and fix lint script" --allow-empty 2>/dev/null || true

# 3. STORE ARCHITECTURE (if you have dedicated dirs with index/types, add them)
# git add src/shared/stores/
# git commit -m "refactor(stores): move stores into dedicated directories with index and types" --allow-empty

# 4. BUTTON SYSTEM
git add src/shared/components/Button/Button.tsx src/shared/components/Button/Button.module.scss \
  src/shared/components/Button/index.ts 2>/dev/null || true
git commit -m "feat(ui): add shared Button component with variants, sizes and icons" --allow-empty 2>/dev/null || true

git add src/app/shares/page.tsx src/app/shares/Shares.module.scss \
  src/shared/components/Header/Header.tsx src/shared/components/MultiDropdown/MultiDropdown.tsx \
  src/shared/components/MultiDropdown/MultiDropdown.module.scss 2>/dev/null || true
git commit -m "style(button): replace raw buttons with Button component across app" --allow-empty 2>/dev/null || true

# 5. CATEGORIES / SSR
git add src/app/layout.tsx src/providers/StoreProvider.tsx src/shared/stores/StoreContext.tsx 2>/dev/null || true
git commit -m "feat(categories): load categories globally with SSR support" --allow-empty 2>/dev/null || true

# 6. PRODUCTS FIXES
git add src/shared/stores/ProductsStore/ 2>/dev/null || true
git commit -m "fix(products): implement global sorting and infinite scroll loading" --allow-empty 2>/dev/null || true

# 7. RELATED ITEMS
git add src/app/products/\[id\]/page.tsx \
  src/app/products/\[id\]/components/RelatedItems/RelatedItems.tsx \
  src/app/products/\[id\]/components/RelatedItems/RelatedItems.module.scss 2>/dev/null || true
git commit -m "feat(product): add related items slider with Swiper and unified card" --allow-empty 2>/dev/null || true

# 9. IMAGE FIX
git add next.config.ts 2>/dev/null || true
git commit -m "fix(images): add external domains for next/image (gstatic, pravatar)" --allow-empty 2>/dev/null || true

# 10. CARD CONSISTENCY
git add src/shared/components/Card/Card.tsx 2>/dev/null || true
git commit -m "refactor(card): add image fallback and unify product card layout" --allow-empty 2>/dev/null || true

# 11. ABOUT PAGE
git add src/app/about/page.tsx src/app/about/AboutPageContent.tsx src/app/about/AboutPage.module.scss 2>/dev/null || true
git commit -m "feat(about): add about page with section animations" --allow-empty 2>/dev/null || true

# 12. FINAL
git add .gitignore README.md 2>/dev/null || true
git add -A 2>/dev/null || true
git status
git commit -m "chore: final cleanup and project documentation" --allow-empty 2>/dev/null || true

echo "Done. Run 'git log --oneline' to view history."
