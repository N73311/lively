import { IUser, IUserFormValues } from "../../models";
import { autorun, makeAutoObservable, reaction, runInAction } from "mobx";

import { RootStore } from "../index";
import { catchAsync } from "../../util/catch-async";
import { history } from "../../app/features/browser-history";
import { usersApi } from "../../api";

export default class UserStore {
  rootStore: RootStore;
  refreshTokenTimeoutFn: any;

  // * Observables
  user: IUser | null = null;
  token: string | null = null;
  getRefreshToken = catchAsync(async () => {
    this.stopRefreshTokenTimer();
    const user = await usersApi.getRefreshToken();
    runInAction(() => {
      this.user = user;
      this.token = user.token;
      this.startRefreshTokenTimer(user);
    });
  });
  register = catchAsync(async (values: IUserFormValues) => {
    await usersApi.register(values);
    this.rootStore.modalStore.closeModal();
    history.push(`/user/registerSuccess?email=${values.email}`);
  });

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    autorun(() => {
      runInAction(() => {
        this.token = window.localStorage.getItem("jwt");
      });
    });

    reaction(
      () => this.token,
      (token) => {
        runInAction(() => {
          token
            ? window.localStorage.setItem("jwt", token)
            : window.localStorage.removeItem("jwt");
        });
      }
    );
  }

  // * Computed
  get isUserLoggedIn() {
    return !!this.user;
  }

  get isTokenValid() {
    const token = window.localStorage.getItem("jwt");
    return !!token;
  }

  logout = () => {
    this.setToken(null);
    this.user = null;
    history.push("/");
  };

  setUserToNull = () => {
    this.user = null;
  };

  setToken = (token: string | null) => {
    window.localStorage.setItem("jwt", token || "");
    this.token = token;
  };

  getUser = catchAsync(async () => {
    const user = await usersApi.getCurrentUser();
    runInAction(() => {
      this.user = user;
      this.setToken(user.token);
      this.startRefreshTokenTimer(user);
    });
  });

  private setUserTokenAndContinue = (user: IUser | null) => {
    runInAction(() => {
      if (user?.token) {
        this.user = user;
        this.setToken(user.token);
        this.startRefreshTokenTimer(user);
        this.rootStore.modalStore.closeModal();
        history.push("/events");
      }
    });
  };

  login = catchAsync(async (values: IUserFormValues) => {
    const user = await usersApi.login(values);
    this.setUserTokenAndContinue(user);
  });

  private startRefreshTokenTimer(user: IUser) {
    const jwtToken = JSON.parse(atob(user.token.split(".")[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeoutFn = setTimeout(this.getRefreshToken, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeoutFn);
  }
}
