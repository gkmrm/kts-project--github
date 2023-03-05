import React, { useState, KeyboardEvent, useEffect } from 'react';

import Button from '@components/Button';
import { Card } from '@components/Card';
import { Dropdown } from '@components/Dropdown';
import { Input } from '@components/Input';
import { Loader } from '@components/Loader';
import { IRepositoriesGithubModel } from '@models/RepositoriesGitHub';
import rootStore from '@rootStore/instance';
import { RepositiriesStore } from '@store/RepositiriesStore';
import { useQueryParamsStoreInit } from '@store/RootStore/hooks/useQueryParamsStoreInit';
import { useLocalStore } from '@store/useLocalStore';
import { Meta } from '@utils/meta';
import { observer } from 'mobx-react-lite';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'react-router-dom';

import styles from './Repositories.module.scss';

export type Option = {
  key: string;
  name: string;
};

const optionsType: Option[] = [
  { key: 'all', name: 'All' },
  { key: 'public', name: 'Public' },
  { key: 'private', name: 'Private' },
  { key: 'forks', name: 'Forks' },
  { key: 'sources', name: 'Sources' },
  { key: 'member', name: 'Member' },
];

const Repositories: React.FC = () => {
  useQueryParamsStoreInit();
  const root = rootStore;
  const [, setParams] = useSearchParams();
  const [selectType, setSelectType] = useState(root.query.getParam('type')?.toString() || 'all');
  const [inputValue, setInputValue] = useState(root.query.getParam('search')?.toString() || '');
  const store = useLocalStore(() => new RepositiriesStore());

  useEffect(() => {
    setParams({ search: inputValue, type: selectType });
  }, [inputValue, selectType, setParams]);

  const getRepositoriesList = React.useCallback(
    () => store.getOrganiztionRepositoriesList({ org: inputValue, type: selectType }),
    [inputValue, selectType, store]
  );

  React.useEffect(() => {
    if (inputValue !== '') {
      getRepositoriesList();
    }
  }, []);

  const handleClick = () => {
    store.reset();
    getRepositoriesList();
  };

  const keyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      store.reset();
      getRepositoriesList();
    }
  };

  const onChangeHandler = (value: string): void => {
    setInputValue(value);
  };

  const onChangeDropdown = (select: string): void => {
    setSelectType(select);
    store.reset();
    getRepositoriesList();
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.inputContainer}>
        <Input
          placeholder="Enter organization name"
          value={inputValue}
          onChange={onChangeHandler}
          onKeyPress={keyPressHandler}
        />
        <Button onClick={handleClick} />
      </div>
      <div className={styles.DropdownTypes}>
        <span className={styles.DropdownTypesTitle}>Repositories</span>
        <Dropdown options={optionsType} value={selectType} onChange={onChangeDropdown} title={'Type:'} />
      </div>
      <InfiniteScroll
        style={{ fontSize: '40px' }}
        className={styles.Item}
        dataLength={store.list.length}
        next={() => getRepositoriesList()}
        hasMore={store.hasMore}
        loader={
          store.meta === Meta.loading && (
            <div className={styles.loader}>
              <Loader />
            </div>
          )
        }
        endMessage={
          <p className={styles.ending_text}>
            <b>You looked at all the repositories!</b>
          </p>
        }
      >
        {store.list.map((repo: IRepositoriesGithubModel) => (
          <Card key={repo.id} {...repo} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default observer(Repositories);
