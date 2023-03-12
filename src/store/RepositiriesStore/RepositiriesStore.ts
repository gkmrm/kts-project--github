import { urls } from '@config/urlsCreator';
import { IRepositoriesGithubModel, normalizeRepositoriesGitHub } from '@models/RepositoriesGitHub';
import rootStore from '@store/RootStore/instance';
import { Meta } from '@utils/meta';
import axios from 'axios';
import _ from 'lodash';
import { makeObservable, observable, computed, action, runInAction, reaction } from 'mobx';

import { ILocalStore } from '../useLocalStore';

export type Option = {
  key: string;
  name: string;
};

export type GetOrganiztionRepositoriesListParams = {
  value: string;
  type: string;
  nextPage: number;
};

interface IRepositiriesStore {
  getOrganiztionRepositoriesList(params: GetOrganiztionRepositoriesListParams): Promise<void>;
}

type PrivateFields = '_list' | '_hasMore' | '_meta' | '_nextPage' | '_type' | '_value';

export class RepositiriesStore implements ILocalStore, IRepositiriesStore {
  private _list: IRepositoriesGithubModel[] = [];
  private _meta: Meta = Meta.initial;
  private _hasMore: boolean = true;
  private _nextPage: number = 1;
  private readonly _length: number = 30;
  private _type: Option = {
    key: 'all',
    name: 'All',
  };
  private _value: string = '';

  constructor() {
    makeObservable<RepositiriesStore, PrivateFields>(this, {
      _list: observable.ref,
      _meta: observable,
      _hasMore: observable,
      _nextPage: observable,
      _type: observable.ref,
      _value: observable,
      list: computed,
      meta: computed,
      hasMore: computed,
      type: computed,
      setType: action,
      setValue: action,
      getOrganiztionRepositoriesList: action.bound,
      getNextRepositoriesList: action.bound,
      reset: action,
    });
  }

  get list(): IRepositoriesGithubModel[] {
    return this._list;
  }

  get meta(): Meta {
    return this._meta;
  }

  get value(): string {
    return this._value;
  }

  get hasMore(): boolean {
    return this._hasMore;
  }

  get type(): Option {
    return this._type;
  }

  setValue = (value: string) => {
    this._value = value;
  };

  setType = (type: Option) => {
    this._type = type;
    if (this.value !== '') {
      this.getOrganiztionRepositoriesList();
    }
  };

  reset(): void {
    this._meta = Meta.initial;
    this._list = [];
    this._hasMore = true;
    this._nextPage = 1;
  }

  getRepositoriesList = async (nextPage: number): Promise<void> => {
    this._meta = Meta.loading;

    try {
      const response = await axios.get(urls.orgs({ value: this._value }), {
        params: { type: this._type.key, page: nextPage },
      });

      runInAction(() => {
        const data = response.data.map(normalizeRepositoriesGitHub);

        if (nextPage === 1) {
          this._list = [...data];
        } else {
          this._list = [...this._list, ...data];
        }

        this._nextPage = nextPage + 1;

        if (data.length < this._length) {
          this._hasMore = false;
        }

        this._meta = Meta.success;
      });
    } catch (e) {
      this._meta = Meta.error;
    }
  };

  getOrganiztionRepositoriesList = async (): Promise<void> => {
    this.reset();

    await this.getRepositoriesList(this._nextPage);
  };

  getNextRepositoriesList = async (): Promise<void> => {
    if (!this._hasMore) {
      return;
    }

    await this.getRepositoriesList(this._nextPage);
  };

  private _debounceSearch = _.debounce(action(this.getOrganiztionRepositoriesList), 1000);

  private _queryReaction = reaction(
    () => rootStore.query.getParam('search'),
    () => {
      this._debounceSearch();
    }
  );

  destroy(): void {
    this._queryReaction();
    this.reset();
  }
}
