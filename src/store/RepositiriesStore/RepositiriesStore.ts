import { urls } from '@config/urlsCreator';
import { IRepositoriesGithubModel, normalizeRepositoriesGitHub } from '@models/RepositoriesGitHub';
import { Meta } from '@utils/meta';
import axios from 'axios';
import { makeObservable, observable, computed, action, runInAction } from 'mobx';

import { ILocalStore } from '../useLocalStore';

export type Option = {
  key: string;
  name: string;
};

export type GetOrganiztionRepositoriesListParams = {
  org: string;
  type: string;
};

interface IRepositiriesStore {
  getOrganiztionRepositoriesList(params: GetOrganiztionRepositoriesListParams): Promise<void>;
}

type PrivateFields = '_list' | '_hasMore' | '_meta' | '_nextPage';

export class RepositiriesStore implements ILocalStore, IRepositiriesStore {
  private _list: IRepositoriesGithubModel[] = [];
  private _meta: Meta = Meta.initial;
  private _hasMore: boolean = true;
  private _nextPage: number = 1;
  private readonly _length: number = 30;

  constructor() {
    makeObservable<RepositiriesStore, PrivateFields>(this, {
      _list: observable.ref,
      _meta: observable,
      _hasMore: observable,
      _nextPage: observable,
      list: computed,
      meta: computed,
      hasMore: computed,
      getOrganiztionRepositoriesList: action,
      reset: action,
    });
  }

  get list(): IRepositoriesGithubModel[] {
    return this._list;
  }

  get meta(): Meta {
    return this._meta;
  }

  get hasMore(): boolean {
    return this._hasMore;
  }

  reset(): void {
    this._hasMore = true;
    this._nextPage = 1;
    this._list = [];
    this._meta = Meta.initial;
  }
  async getOrganiztionRepositoriesList(params: GetOrganiztionRepositoriesListParams): Promise<void> {
    const response = await axios.get(urls.orgs(params) + this._nextPage);

    runInAction(() => {
      try {
        this._meta = Meta.loading;
        const data = response.data.map(normalizeRepositoriesGitHub);
        this._list = [...this._list, ...data];
        this._nextPage = this._nextPage + 1;

        if (data.length < this._length) {
          this._hasMore = false;
        }
        this._meta = Meta.success;
      } catch (error) {
        this._meta = Meta.error;
        throw error;
      }
    });
  }

  destroy(): void {}
}
