import { makeObservable, observable, action } from 'mobx';
import * as qs from 'qs';

type PrivateFields = '_params';

export default class QueryParamsStore {
  private _params: qs.ParsedQs = {};
  private _search: string = '';
  private _type: string = '';

  constructor() {
    makeObservable<QueryParamsStore, PrivateFields>(this, {
      _params: observable.ref,
      setType: action,
      setSearch: action,
    });
  }

  getParam(key: string): undefined | string | string[] | qs.ParsedQs | qs.ParsedQs[] {
    return this._params[key];
  }

  setType(type: string) {
    type = type.startsWith('&') ? type.slice(1) : type;

    if (this._type !== type) {
      this._type = type;
      this._params = qs.parse(type);
    }
  }

  setSearch(search: string) {
    if (this._search === search) {
      return;
    }
    search = search.startsWith('?') ? search.slice(1) : search;
    this._search = search;
    this._params = qs.parse(search);
  }
}
