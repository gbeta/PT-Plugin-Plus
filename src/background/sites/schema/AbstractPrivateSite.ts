// 适用于PT站点
import { UserInfo } from '@/shared/interfaces/sites'
import { AxiosResponse } from 'axios'
import BittorrentSite from '@/background/sites/schema/AbstractBittorrentSite'
import userDataRecords from '@/background/service/storage/userDataRecords'

export default class PrivateSite extends BittorrentSite {
  public async getLastUserInfo (): Promise<UserInfo | null> {
    return await userDataRecords.getUserData(this.config.host!) as UserInfo | null
  }

  /**
   * 获得当前站点最新的用户信息用于更新
   * 因为此处仅抛出 Error，所以所有继承的子类应该完全覆写
   * 这里不用考虑保存问题，保存/更新 UserInfo 由调用的上层完成
   */
  public async flushUserInfo (): Promise<UserInfo> {
    throw new Error('尚不支持') // FIXME
  }

  /**
   * 这是一个比较通用的检查是否登录方法，如果不行请考虑覆写扩展
   * @param {AxiosResponse} res
   */
  protected loggedCheck (res: AxiosResponse): boolean {
    const request = res.request as XMLHttpRequest
    try {
      if (/login|verify|checkpoint|returnto/ig.test(request.responseURL)) {
        return false // 检查最终的URL看是不是需要登陆
      } else if (res.headers.refresh && /\d+; url=.+(login|verify|checkpoint|returnto).+/ig.test(res.headers.refresh)) {
        return false // 检查responseHeader有没有重定向
      } else {
        const responseText = request.responseType === 'document' ? request.responseXML?.documentElement.outerHTML : request.responseText
        if (typeof responseText === 'undefined') {
          return false // 检查最终的Text，如果什么都没有也可能说明需要登陆
        } else if (responseText.length < 800 && /login|not authorized/.test(responseText)) {
          return false // 对Text进行检查，断言 “过短，且中间出现login等字段“ 说明可能需要登陆
        }
      }
    } catch (e) {
      // Catch Nothing
    }

    return true
  }
}
