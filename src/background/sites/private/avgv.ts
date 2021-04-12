/**
 * 使用TJUPT的 progress 和 status 解析，未作检查
 * Rhilip, 2021.4.12
 */
import { SiteMetadata } from '@/shared/interfaces/sites'
import { selectorSearchProgress, selectorSearchStatus } from '@/background/sites/private/tjupt'

export const siteMetadata: SiteMetadata = {
  name: '爱薇网',
  timezoneOffset: '+0800',
  schema: 'NexusPHP',
  url: 'https://avgv.cc/',
  description: '新加坡华人PT站，很有特色。',
  tags: ['成人', 'AV', 'GAY', 'LES'],
  collaborator: ['xiazhou8', '匿名网友'],
  selector: {
    search: {
      progress: selectorSearchProgress,
      status: selectorSearchStatus
    }
  }
}
