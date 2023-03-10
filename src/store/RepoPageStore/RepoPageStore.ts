import { urls } from '@config/urlsCreator';
import { IRepoPageGithubApi, IRepoPageGithubModel, normalizeRepoGithub } from '@models/RepoPageGitHub';
import { Meta } from '@utils/meta';
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

type PrivateFields = '_info' | '_isLoading' | '_metaReadme';

export class RepoPageStore implements ILocalStore, IRepositiriesStore {
  private _info: IRepoPageGithubModel | null = null;
  private _isLoading: boolean = false;
  private _metaReadme: Meta = Meta.initial;
  constructor() {
    makeObservable<RepoPageStore, PrivateFields>(this, {
      _info: observable.ref,
      _isLoading: observable,
      _metaReadme: observable,
      info: computed,
      isLoading: computed,
      getRepoInfo: action.bound,
      reset: action,
    });
  }

  get info(): IRepoPageGithubModel | null {
    return this._info;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get metaReadme(): Meta {
    return this._metaReadme;
  }

  reset(): void {
    this._info = null;
    this._isLoading = false;
    this._metaReadme = Meta.initial;
  }

  async getRepoInfo(params: GetRepoParams): Promise<void> {
    this._isLoading = true;
    try {
      const response = await axios.get(urls.repos({ ...params }));
      this._metaReadme = Meta.loading;
      const readmeResponse = await axios
        .get(urls.readme({ ...params }), {
          headers: {
            accept: 'application/vnd.github.html',
          },
        })
        .catch((error) => {
          // Handle README request error
          if (error.response && error.response.status === 404) {
            this._metaReadme = Meta.error;
          } else {
            throw error;
          }
        });

      runInAction(() => {
        const data: IRepoPageGithubApi = response.data;
        this._info = normalizeRepoGithub(data);
        if (readmeResponse) {
          this._metaReadme = Meta.success;
          const readme = readmeResponse.data;
          this._info.readme = readme;
        }
      });
    } catch (error) {
      throw error;
    } finally {
      this._isLoading = false;
    }
  }

  destroy(): void {
    this.reset();
  }
}
