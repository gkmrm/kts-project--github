import React from 'react';

import Button from '@components/Button';
import { Card } from '@components/Card';
import { Dropdown } from '@components/Dropdown';
import { Input } from '@components/Input';
import { Loader } from '@components/Loader';
import { IRepositoriesGithubModel } from '@models/RepositoriesGitHub';
import { RepositiriesStore } from '@store/RepositiriesStore';
import { useLocalStore } from '@store/useLocalStore';
import { Meta } from '@utils/meta';
import { observer } from 'mobx-react-lite';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  const store = useLocalStore(() => new RepositiriesStore());
  const [params, setParams] = useSearchParams();

  const onChange = React.useCallback(
    (str: string) => {
      store.setValue(str);
      setParams({ search: str || '', type: params.get('type') || 'all' });
    },
    [setParams, params]
  );

  const onChangeType = React.useCallback(
    (type: Option) => {
      store.setType(type);
      setParams({ search: params.get('search') || '', type: type.key });
    },
    [store, params, setParams]
  );

  React.useEffect(() => {
    if (params.get('search')) {
      store.setValue(params.get('search') || '');
      if (params.get('type')) {
        store.setType(optionsType.find((obj) => obj.key === params.get('type')) || { key: 'all', name: 'All' });
      }
    }
  }, []);

  const handleClick = React.useCallback(() => {
    store.getOrganiztionRepositoriesList();
  }, []);

  const keyPressHandler = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      store.getOrganiztionRepositoriesList();
    }
  }, []);

  const navigate = useNavigate();
  const onClickCard = React.useCallback(
    (owner: string, title: string) => {
      navigate(`/repo/${owner}/${title}`);
    },
    [navigate]
  );

  return (
    <div className={styles.gridContainer}>
      <div className={styles.inputContainer}>
        <Input
          placeholder="Enter organization name"
          value={store.value}
          onChange={onChange}
          onKeyPress={keyPressHandler}
        />
        <Button onClick={handleClick} />
      </div>
      <div className={styles.DropdownTypes}>
        <span className={styles.DropdownTypesTitle}>Repositories</span>
        <Dropdown options={optionsType} value={store.type} onChange={onChangeType} title={'Type:'} />
      </div>
      <InfiniteScroll
        style={{ fontSize: '40px' }}
        className={styles.Item}
        dataLength={store.list.length}
        next={() => store.getNextRepositoriesList()}
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
        {store.meta === Meta.error ? (
          <div className={styles.ending_text}>
            <p>Unfortunately, there is no such organization :(</p>
            <p>Try changing the name of the organization! :)</p>
          </div>
        ) : (
          store.list.map((repo: IRepositoriesGithubModel) => <Card key={repo.id} {...repo} onClick={onClickCard} />)
        )}
      </InfiniteScroll>
    </div>
  );
};

export default observer(Repositories);
