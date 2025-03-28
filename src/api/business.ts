import Taro from '@tarojs/taro'
import { ResponseInfoType } from 'types/common';

export interface NotifySubscribeParams {
  open_code: string;
  phone: string;
  password: string;
}

/**
  公众号推送订阅
  POST /api/business/notify/subscribe
  接口ID：252366877
  接口地址：https://app.apifox.com/link/project/5084807/apis/api-252366877      
 */
export const subscribeNotify = (params: NotifySubscribeParams) => {
  return Taro.request<ResponseInfoType<null>>({
    url: '/api/business/notify/subscribe',
    method: 'POST',
    data: params
  })
} 