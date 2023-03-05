import { urls } from '@config/urlsCreator';
import { IRepoPageGithubApi, IRepoPageGithubModel, normalizeRepoGithub } from '@models/RepoPageGitHub';
import axios from 'axios';
import { makeObservable, observable, computed, action, runInAction } from 'mobx';

import { ILocalStore } from '../useLocalStore';

export type GetRepoParams = {
  owner: string;
  name: string;
};

interface IRepositiriesStore {
  getRepoInfo(params: GetRepoParams): Promise<void>;
}

type PrivateFields = '_info' | '_isLoading';

export class RepoPageStore implements ILocalStore, IRepositiriesStore {
  private _info: IRepoPageGithubModel | null = null;
  private _isLoading: boolean = false;
  constructor() {
    makeObservable<RepoPageStore, PrivateFields>(this, {
      _info: observable.ref,
      _isLoading: observable,
      info: computed,
      isLoading: computed,
      getRepoInfo: action.bound,
    });
  }

  get info(): IRepoPageGithubModel | null {
    return this._info;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  async getRepoInfo(params: GetRepoParams): Promise<void> {
    this._isLoading = true;
    try {
      const response = await axios.get(urls.repos({ ...params }));
      const data: IRepoPageGithubApi = response.data;
      const readmeResponse = await axios.get(urls.readme({ ...params }), {
        headers: {
          accept: 'application/vnd.github.html',
        },
      });
      const readme = readmeResponse.data;

      runInAction(() => {
        this._info = normalizeRepoGithub(data);
        this._info.readme = readme;
      });
    } catch (error) {
      throw error;
    } finally {
      this._isLoading = false;
    }
  }

  destroy(): void {}
}
