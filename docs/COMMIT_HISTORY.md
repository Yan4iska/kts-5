# Commit History Guide

Use this to create a clean, conventional commit history. Run from project root: `cd /Users/yanmatveev/Projects/2026/kts-3/kts-5`

If the repo root is your home directory and `git status` is slow, consider initializing a new repo here:

```bash
cd /Users/yanmatveev/Projects/2026/kts-3/kts-5
rm -rf .git  # only if you want a fresh repo
git init
git add -A
git commit -m "chore: baseline before organizing history"
git reset --soft HEAD~1
```

Then run each block below in order (or use `./scripts/organize-commits.sh` and adjust paths).

---

## 1. ENV CLEANUP

```bash
git add .env.example README.md
git commit -m "chore(env): remove NEXT_PUBLIC_STRAPI_API_TOKEN from env and docs"
```

---

## 2. API INTEGRATION

```bash
git add src/shared/config/api.ts src/shared/config/escuelajs.ts src/shared/adapters/productAdapter.ts
git commit -m "feat(api): remove STRAPI token from code and integrate Escuela API with normalization"
```

## 3. CODE CLEANUP

```bash
git add src/app/layout.tsx src/app/page.tsx src/app/account/page.tsx src/app/cart/page.tsx \
  src/app/error.tsx src/app/login/page.tsx src/app/register/page.tsx \
  src/app/about/AboutPage.module.scss \
  src/app/products/components/ProductsList/ProductsList.tsx \
  src/app/products/components/ProductsClient/ProductsClient.tsx \
  src/app/products/\[id\]/components/ProductClient/ProductClient.tsx \
  src/app/products/\[id\]/components/RelatedItems/RelatedItems.module.scss \
  src/app/shares/components/CaseOpeningSlider/CaseOpeningSlider.tsx \
  src/app/shares/components/CaseOpeningSlider/prizes.ts \
  src/shared/stores/StoreContext.tsx src/shared/stores/ProductsStore/ProductsStore.ts \
  src/shared/stores/ProductStore/ProductStore.ts src/shared/stores/DiscountStore/DiscountStore.ts \
  src/providers/StoreProvider.tsx src/shared/styles/variables.scss src/shared/styles/media.scss
git commit -m "chore(code): remove comments except in shared components"
```

```bash
git add package.json
git commit -m "chore(code): remove unused dependencies and fix lint script"
```

---

## 4. BUTTON SYSTEM

```bash
git add src/shared/components/Button/Button.tsx src/shared/components/Button/Button.module.scss src/shared/components/Button/index.ts
git commit -m "feat(ui): add shared Button component with variants, sizes and icons"
```

```bash
git add src/app/shares/page.tsx src/app/shares/Shares.module.scss \
  src/shared/components/Header/Header.tsx \
  src/shared/components/MultiDropdown/MultiDropdown.tsx src/shared/components/MultiDropdown/MultiDropdown.module.scss
git commit -m "style(button): replace raw buttons with Button component across app"
```

---

---

## 5. CATEGORIES / SSR

```bash
git add src/app/layout.tsx src/providers/StoreProvider.tsx src/shared/stores/StoreContext.tsx
git commit -m "feat(categories): load categories globally with SSR support"
```

---

## 6. PRODUCTS FIXES

```bash
git add src/shared/stores/ProductsStore/
git commit -m "fix(products): implement global sorting and infinite scroll loading"
```

---

## 7. RELATED ITEMS

```bash
git add src/app/products/\[id\]/page.tsx \
  src/app/products/\[id\]/components/RelatedItems/RelatedItems.tsx \
  src/app/products/\[id\]/components/RelatedItems/RelatedItems.module.scss
git commit -m "feat(product): add related items slider with Swiper and unified card"
```

---

## 8. IMAGE FIX

```bash
git add next.config.ts
git commit -m "fix(images): add external domains for next/image (gstatic, pravatar)"
```

---

## 9. CARD CONSISTENCY

```bash
git add src/shared/components/Card/Card.tsx
git commit -m "refactor(card): add image fallback and unify product card layout"
```

---

## 10. ABOUT PAGE

```bash
git add src/app/about/page.tsx src/app/about/AboutPageContent.tsx src/app/about/AboutPage.module.scss
git commit -m "feat(about): add about page with section animations"
```

---

## 11. FINAL CLEANUP

```bash
git add .gitignore README.md
git add -A
git status
git commit -m "chore: final cleanup and project documentation"
```

---

## Verify

```bash
git log --oneline
npm run build
```

Note: If a file was changed in multiple logical steps, it will appear in the first commit that touches it. For finer-grained history, use `git add -p` to stage hunks per commit.
