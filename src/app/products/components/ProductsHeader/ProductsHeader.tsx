import classNames from 'classnames';
import Filter from 'components/Filter';
import Input from 'components/Input';
import type { Option } from 'components/MultiDropdown';
import Text from 'components/Text';
import { useDebouncedCallback } from 'hooks/useDebouncedCallback';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRootStore } from 'stores';
import customStyles from 'styles/customStyles.module.scss';
import type { ProductCategory } from 'types/product';

import styles from './ProductsHeader.module.scss';
import custom from "styles/customStyles.module.scss";

const SEARCH_DEBOUNCE_MS = 800;

function toCategoryOptions(categories: ProductCategory[]): Option[] {
  return categories.map((c) => ({ key: String(c.id), value: c.name }));
}

const ProductsHeader: React.FC = observer(() => {
  const { productsStore, categoriesStore } = useRootStore();
  const [searchInput, setSearchInput] = useState(productsStore.search);
  const categoryOptions = toCategoryOptions(categoriesStore.categories);

  const debouncedSetSearch = useDebouncedCallback(
    (value: string) => productsStore.setSearchQuery(value),
    SEARCH_DEBOUNCE_MS
  );

  useEffect(() => {
    setSearchInput(productsStore.search);
  }, [productsStore.search]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSetSearch(value);
  };

  const title = 'Products';
  const description =
    'We display products based on the latest products we have. Search by name and filter below.';

  return (
    <div className={classNames({
        [custom['padding_hor']]: true,
    })}>
      <Text
        tag="h2"
        view="title"
        color="primary"
        className={classNames({
          [customStyles['text-align-center']]: true,
          [customStyles['text-responsive']]: true,
        })}
      >
        {title}
      </Text>
      <Text
        tag="div"
        view="p-20"
        color="secondary"
        className={classNames({
          [customStyles['text-align-center']]: true,
          [customStyles['text-responsive']]: true,
        })}
      >
        {description}
      </Text>
      <div className={classNames(customStyles['margin_top'], styles.filterContainer)}>
        <Input
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search products..."
          aria-label="Search products"
        />
        <div className={styles.filterWrap}>
          <Filter
          categoryOptions={categoryOptions}
          categoryValue={categoryOptions.filter((o) =>
            productsStore.categoryIds.includes(Number(o.key))
          )}
          onCategoryChange={(value) =>
            productsStore.setCategoryIds(value.map((o) => Number(o.key)))
          }
          inStockOnly={productsStore.inStockOnly}
          onInStockOnlyChange={(v) => productsStore.setInStockOnly(v)}
          sortBy={productsStore.sortBy}
          onSortByChange={(v) => productsStore.setSortBy(v)}
        />
        </div>
      </div>
    </div>
  );
});

export default ProductsHeader;
