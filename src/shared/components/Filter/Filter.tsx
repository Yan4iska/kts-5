import CheckBox from 'components/CheckBox';
import MultiDropdown, { type Option } from 'components/MultiDropdown';
import type { SortBy } from 'config/api';
import { observer } from 'mobx-react-lite';
import { SORT_OPTIONS } from 'stores';

import styles from './Filter.module.scss';

const SORT_OPTIONS_AS_OPTIONS: Option[] = SORT_OPTIONS.map((o) => ({ key: o.key, value: o.value }));

type FilterProps = {
  categoryOptions?: Option[];
  categoryValue?: Option[];
  onCategoryChange?: (value: Option[]) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (value: boolean) => void;
  sortBy: SortBy[];
  onSortByChange: (value: SortBy[]) => void;
};

const Filter = observer(
  ({
    categoryOptions = [],
    categoryValue = [],
    onCategoryChange,
    inStockOnly,
    onInStockOnlyChange,
    sortBy,
    onSortByChange,
  }: FilterProps) => {
    const sortValue: Option[] = sortBy
      .map((key) => SORT_OPTIONS_AS_OPTIONS.find((o) => o.key === key))
      .filter((o): o is Option => o != null);

    const handleSortChange = (value: Option[]) => {
      // At most one price and one rating: keep the last selected of each type
      const priceOpts = value.filter((o) => o.key.startsWith('price_'));
      const ratingOpts = value.filter((o) => o.key.startsWith('rating_'));
      const lastPrice = priceOpts[priceOpts.length - 1];
      const lastRating = ratingOpts[ratingOpts.length - 1];
      const normalized = [lastRating, lastPrice].filter(Boolean);
      onSortByChange(normalized.map((o) => o.key as SortBy));
    };

    const categoryTitle = (v: Option[]) =>
      v.length === 0 ? 'Categories' : v.map((o) => o.value).join(', ');

    return (
      <div className={styles.filterRow}>
        {categoryOptions.length > 0 && onCategoryChange && (
          <MultiDropdown
            className={styles.dropdownFullWidth}
            options={categoryOptions}
            value={categoryValue}
            onChange={onCategoryChange}
            getTitle={categoryTitle}
          />
        )}
        <MultiDropdown
          className={styles.dropdownFullWidth}
          options={SORT_OPTIONS_AS_OPTIONS}
          value={sortValue}
          onChange={handleSortChange}
          getTitle={(v) => (v.length > 0 ? v.map((o) => o.value).join(', ') : 'Sort by')}
        />
        <label className={styles.inStock}>
          <CheckBox checked={inStockOnly} onChange={onInStockOnlyChange} />
          <span>In stock</span>
        </label>
      </div>
    );
  }
);

export default Filter;
