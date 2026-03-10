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
  sortBy: SortBy | null;
  onSortByChange: (value: SortBy | null) => void;
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
    const sortValue: Option[] =
      sortBy != null
        ? [SORT_OPTIONS_AS_OPTIONS.find((o) => o.key === sortBy)!].filter(Boolean)
        : [];

    const handleSortChange = (value: Option[]) => {
      if (value.length === 0) {
        onSortByChange(null);
        return;
      }
      onSortByChange(value[value.length - 1].key as SortBy);
    };

    const categoryTitle = (v: Option[]) =>
      v.length === 0 ? 'Categories' : v.map((o) => o.value).join(', ');

    return (
      <div className={styles.filterRow}>
        {categoryOptions.length > 0 && onCategoryChange && (
          <MultiDropdown
            options={categoryOptions}
            value={categoryValue}
            onChange={onCategoryChange}
            getTitle={categoryTitle}
          />
        )}
        <MultiDropdown
          options={SORT_OPTIONS_AS_OPTIONS}
          value={sortValue}
          onChange={handleSortChange}
          getTitle={(v) => (v.length > 0 ? v[0].value : 'Sort by')}
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
