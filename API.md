# API服务

**我们已提供公共API，架设在美国虚拟主机，未做任何人机验证等限制，请手下留情**

## 全局URL

`https://udbapi.hachimlab.top`

## 查询用户

`GET` `/search`

| **KEY**  |   **VALUE**    | **TYPE** | **NEED** |
| :------: | :------------: | :------: | :------: |
| nickname |      昵称      |  string  |   必须   |
|   page   |      分页      |   int    |   可选   |
|  limit   | 每页的结果数量 |   int    |   可选   |

### 返回内容

- 成功请求时，返回状态码为 `200`

| **KEY** |      **VALUE**       | **TYPE** |
| :-----: | :------------------: | :------: |
| status  |         状态         |  string  |
|  user   |   查询到的用户数量   |   int    |
|  item   | 查询到的用户（列表） |   json   |
|  page   | 当前页面（若已携带分页参数） |   int   |
|  limit   | 当前页面结果数量（若已携带分页参数） |   int   |

### item

|       key       |         value          |  type  |
| :-------------: | :--------------------: | :----: |
|       id        |       训练师编号       |  int   |
|    nickname     |          昵称          | string |
|       sex       | 性别（0 为女，1 为男） |  int   |
|   description   |        自我描述        | string |
|      doing      |       正在做什么       | string |
|   avatar_url    |        头像链接        | string |
| collectionTimes |     作品被收藏次数     |  int   |
|   forkedTimes   |    作品被再创作次数    |  int   |
|   praiseTimes   |     作品被点赞次数     |  int   |
|    viewTimes    |     作品被浏览次数     |  int   |
| attention_total |        关注数量        |  int   |
|   fans_total    |        粉丝数量        |  int   |
| work_shop_name  |       工作室名称       | string |

- 此昵称无结果时，返回状态码为 `404`:
  
  `{"status":"not found"}`

## 查询用户（只查询ID）

`GET` `/search/onlyid`

| **KEY**  |   **VALUE**    | **TYPE** | **NEED** |
| :------: | :------------: | :------: | :------: |
| nickname |      昵称      |  string  |   必须   |
|   page   |      分页      |   int    |   可选   |
|  limit   | 每页的结果数量 |   int    |   可选   |

### 返回内容

- 成功请求时，返回状态码为 `200`

| **KEY** |      **VALUE**       | **TYPE** |
| :-----: | :------------------: | :------: |
| status  |         状态         |  string  |
|  user   |   查询到的用户数量   |   int    |
|  item   | 查询到的用户（列表） |   json   |
|  page   | 当前页面（若已携带分页参数） |   int   |
|  limit   | 当前页面结果数量（若已携带分页参数） |   int   |

### item

|       key       |         value          |  type  |
| :-------------: | :--------------------: | :----: |
|       id        |       训练师编号       |  int   |
|    nickname     |          昵称          | string |

- 此昵称无结果时，返回状态码为 `404`:
  
  `{"status":"not found"}`

## 添加用户

`GET` `/user/add`

| **KEY** | **VALUE**  | **TYPE** | **NEED** |
| :-----: | :--------: | :------: | :------: |
|   id    | 训练师编号 |   int    |   必须   |

### 返回内容

- 成功请求时，返回状态码为 `200`
  
  `{"status":"ok","message":"用户已收录"}`

- 用户如果已被收录，返回状态码 `409`
  
  `{"status":"exist","message":"已收录过此用户"}`

- 用户如果疑似EDU账户，返回状态码 `422`
  
  `{"status":"edu","message":"此账号疑似EDU批量注册"}`

## 更新用户信息

`GET` `/user/update`

| **KEY** | **VALUE**  | **TYPE** | **NEED** |
| :-----: | :--------: | :------: | :------: |
|   id    | 训练师编号 |   int    |   必须   |

### 返回内容

- 成功请求时，返回状态码为 `200`
  
  `{"status":"ok","message":"用户信息已更新"}`


- 未收录此ID时，返回状态码为 `404`
  
  `{"status":"not found","message":"找不到此用户"}`

## 获得已收录用户总数

`GET` `/status`

### 返回内容

- 成功请求时，返回状态码为 `200`
  
| **KEY** |      **VALUE**       | **TYPE** |
| :-----: | :------------------: | :------: |
| status  |         状态         |  string  |
|  total_users   |   总共收录的用户数量   |   int    |
