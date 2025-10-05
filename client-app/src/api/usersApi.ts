import { IUser, IUserFormValues } from "../models";

import { requests } from "./baseRequests";

export const usersApi = {
  getCurrentUser: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/user/login", user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/user/register", user),
  getRefreshToken: (): Promise<IUser> =>
    requests.post(`/user/refreshToken`, {}),
  verifyEmail: (token: string, email: string): Promise<void> =>
    requests.post(`/user/verifyEmail`, { token, email }),
  resendEmailVerification: (email: string): Promise<void> =>
    requests.get(`/user/resendEmailVerification?email=${email}`),
};
