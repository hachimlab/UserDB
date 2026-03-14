# CodemaoUserDB

**明日は もっと君のそばへ | 编程猫公开用户数据库**

公共API服务：https://udbapi.hachimlab.top/

公共查询服务：https://userdb.hachimlab.top/

[社区集成油猴插件（发布页）](https://greasyfork.org/zh-CN/scripts/567810-codemaouserdb-%E7%A4%BE%E5%8C%BA%E9%9B%86%E6%88%90%E6%8F%92%E4%BB%B6-%E7%BC%96%E7%A8%8B%E7%8C%AB%E6%98%B5%E7%A7%B0%E6%90%9C%E7%B4%A2) | [一键安装集成插件（需要有油猴）](https://github.com/hachimlab/UserDB/raw/refs/heads/main/codemao-userdb.user.js)

## 什么是UserDB？

为了弥补编程猫没有按昵称找用户的不足，HachimLab选择直接扫描用户的公开数据并整合于一个数据库内，因此出此仓库，方便各位访问

## UserDB统计了什么？

在个人主页能看见的，除了作品都会记录，以下是数据库记录的内容：

- id：训练师编号
- nickname：昵称
- sex：性别
- description：签名
- doing：正在做什么
- level：等级
- avatar：头像链接
- collectionTimes：作品被收藏次数
- forkedTimes：作品被再创作次数
- praiseTimes：作品被点赞次数
- viewTimes：作品被浏览次数
- attention_total：该用户关注的人总数
- fans_total：该用户的粉丝总数
- work_shop_name：用户工作室名

## 最近统计的数据

最近一次统计于**2026.02.27 02:08**完成，准备获取**157198**个用户数据，实际获取到了**79511**个用户数据

其中，EDU账号共**70084**个，异常账号**3143**个

## 如何统计？

因为编程猫的UID顺序很难判断，因此只能通过 **神射手** 以及 **蜜桃** 的粉丝列表来进行扫描

1. 获取粉丝列表

   通过脚本获取两人的粉丝UID，写入到一个文本文件内

2. 判断EDU账号

   统计EDU账号只会增加数据库的压力，因此根据最新的随机昵称规则，得出以下正则表达式：

   `[\u4e00-\u9fa5]{2}的[\u4e00-\u9fa5]{2,4}[A-Za-z0-9]{4}$`

   通过正则表达式，即可初步判断EDU账号，跳过记录

3. 通过API获取数据

   `https://api.codemao.cn/api/user/info/detail/{*uid*}`

   `https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id={*uid*}`

   获取的数据看上面

4. 二次判断EDU账号

   由于早期编程猫默认昵称规则与现在不同，因此通过以下方式判断早期EDU/默认账号（全符合）

   - `collectionTimes`、`forkedTimes`、`praiseTimes`、`viewTimes` 均为 0
   - `description（签名）` 无内容
   - `doing（正在做）` 无内容
   - `attention_total` 和 `fans_total` 小于十个
   - `avatar` 为缺省URL

## 其他

因为是从粉丝列表出发，所以如果你没有关注过蜜桃/神射手，数据库就不会记录你的信息

同时，由于部分用户长得确实像EDU号，也有误杀可能性，敬请谅解

后期将会开放快速上传数据（提供UID即可），欢迎各位积极上传

## 使用

在Release里下载数据库文件并在本地恢复，这是一个MySQL数据库

如果要使用API，请点击[这里](API.md)

## 免责声明

**本项目收集的数据均来自该网站官方提供的公共 API 及公开可访问的用户页面，所有信息均为公开数据，用户可在个人主页查看相同内容。**

**本项目严格遵守网站服务条款，不涉及任何未经授权的访问或私人数据收集。所收集的数据仅用于研究、分析和展示目的，禁止用于商业营销、骚扰或侵犯用户隐私的行为。使用本项目数据的用户需自行承担相应责任。**
