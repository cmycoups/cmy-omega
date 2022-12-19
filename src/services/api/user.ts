import { apiService } from '#/services/BaseService';
import { IUserInfo, LoginByTokenParams, LoginParams, LoginResult } from '#/types/service/user';

// 登录后刷新 token
export async function login(body: LoginParams) {
  return apiService.post<LoginResult>('v1/login', body);
}

// 获取登录用户信息
export async function getUserInfo() {
  return apiService.get<IUserInfo>('v1/users/me');
}

export async function loginByToken(body: LoginByTokenParams) {
  return apiService.post<LoginResult>('v1/login/iam', body);
}
