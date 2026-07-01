---
source: "https://mp.weixin.qq.com/s/CaJWRfLfNN8zECYZNqFQkg"
media_id: "wechatarticle_55bb46d67e4ff52d864f1acd89192f15_e0cc45404a1d9b310b039e10d2443cd07320270712873459"
author:
  - "欧巴聊AI"
published: 2026-02-15T19:55:54
created: 2026-06-20T03:16:19
---
# Kimi正式接入OpenClaw，实测和教程看这一篇就够了

朋友们过年好。

说真的，我现在的心情就两个字，炸裂。

因为，今年的赛博年味越来越冲了。

就在刚刚，Kimi 居然把最近全球火爆的龙虾 OpenClaw 给接入了。

名字叫 Kimi Claw。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-e751af47.png|图片]]

实测了一下，接入飞书的体验非常丝滑，5 分钟就能搞定。

这，就是普通人心心念念的贾维斯时刻。

不用买服务器，不用买 Mac mini，不用学 AI 编程，不用折腾任何高门槛的技术。

而且，无论你是用电脑还是躺在被窝里刷手机。

只要在飞书里喊一嗓子，AI 就开始 24 小时无休的为你卖命打工。

彻底让你突破时间维度的限制。

更炸裂的是。

Kimi 不仅集成了 ClawHub 的 5000 多个 Skills，还免费送了 40GB 的云存储。

想用哪个用哪个，串起来一起跑也没问题。

这波，属于赛博财神爷提前发红包了。

那么话不多说，开始咱们的保姆级接入教程实测。

## 实测

地址在这。

> www.kimi.com/bot

进来之后，点击创建。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-3b1ae045.png|图片]]

然后，泡杯茶，等待 1 分钟。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-04d95c87.png|图片]]

这个带上龙虾的 Kimi 头像还怪萌的，我强烈建议产品经理出门左转，找泡泡玛特联名出个盲盒。

我第一个买，肯定会卖爆。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-d6fef53b.png|图片]]

叮，茶还没喝几口，Kimi Claw 就已经建好了。

就是这么简单粗暴。

不用你折腾任何硬件，环境和代码。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-4522e31b.png|图片]]

接下来，是接头环节。

你可以直接问他，如何配置飞书机器人。

没有飞书账号的朋友们，需要先注册一下，选择个人版就好。

通过 Kimi Claw 提供的链接，直接跳进下面的飞书开放平台。

别被这名字吓到了，全是点点鼠标的事儿。

点击中间的蓝色按钮，创建企业自建应用。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-7be21954.png|图片]]

然后随便输入个应用名称，应用描述和应用图标。

点击创建。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-69f731b7.png|图片]]

接着，找到第一个叫做机器人的卡片，点击添加。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-117a1e6f.png|图片]]

然后在左侧找到权限管理，然后点击批量导入/导出权限。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-57bb7be0.png|图片]]

先别管这段代码啥意思，直接完整的复制粘贴进去。

```
{
  "scopes": {
    "tenant": [
      "aily:file:read",
      "aily:file:write",
      "application:application.app_message_stats.overview:readonly",
      "application:application:self_manage",
      "application:bot.menu:write",
      "contact:user.employee_id:readonly",
      "corehr:file:download",
      "event:ip_list",
      "im:chat.access_event.bot_p2p_chat:read",
      "im:chat.members:bot_access",
      "im:message",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:message:send_as_bot",
      "im:message.reactions:read",
      "im:resource"
    ],
    "user": ["aily:file:read", "aily:file:write", "im:chat.access_event.bot_p2p_chat:read"]
  }
}
```

其实，上面代码对应着飞书的权限，粘贴进去后会看到具体有哪些权限。

别犹豫，点击申请开通。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-ef92faf8.png|图片]]

之后，去左侧菜单栏，找到凭证与基础信息。

这里有两个关键的东西，分别复制 AppID 和 App Secret，来到网页版一块发送给 Kimi Claw。

他们相当于你机器人的身份证和银行卡密码。

千万记得保护好 App Secret，不要泄漏。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-8d6f30a6.png|图片]]

发送给 Kimi Claw 之后，点击右上角的配置按钮，手动重启一下。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-099db905.png|图片]]

接着，再回到飞书开放平台，找到左侧的事件与回调。

在事件配置的订阅方式中，选择使用长连接接收事件，点击保存。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-4835377e.png|图片]]

点击添加事件，添加一个叫做 im.message.receive\_v1 的事件。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-4b82e61e.png|图片]]

最后一步，来到版本管理与发布，点击创建版本。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-ee0d1ef1.png|图片]]

随便输入一个应用版本号和更新说明。

然后直接发布即可。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-dba05738.png|图片]]

恭喜你，你的专属贾维斯智能体，诞生了。

现在打开你的手机或者电脑版飞书，搜索 Kimi Claw 就能看到创建好的机器人了。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-7f570a94.png|图片]]

你可以对他进行私人定制，比如定义身份，调教语气，甚至是与你逐渐对齐三观。

因为他的记忆是长期的，永远会记得你说过的话。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-943b00bc.png|图片]]

最简单的用法，就是让他帮你执行各种定时任务。

你可以定义好目标时间，输出格式和约束条件。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-4b2066ee.png|图片]]

接收到任务的第一时间，Kimi Claw 就回复了一个正在干活儿的小表情。

非常专业，这不比你那些已读不回的同事靠谱多了？

没一会儿，带着摘要和来源的资讯就整理好了，质量非常高。

毕竟，Kimi 的搜索能力，可是相当能打的。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-b76c3e81.png|图片]]

你以为这就完了？

不。

更绝的是，Kimi 集成了 ClawHub 的 5000 多个 Skills。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-47d98061.png|图片]]

这时候，肯定有朋友就要问了。

5000 多个？我哪知道哪个好用？我就想偷个懒，还得先看说明书？

不。

真正的懒人神器，是不需要动脑子的。

如果你懒得自己搜索，那就直接把需求甩给他，让 Kimi Claw 自己找。

比如，让他自己找到专业的技能包，分析下投资机会。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-c9950132.png|图片]]

这里找到了两个，一个搞数据源，一个搞数据分析。

实现一个全自动的盯盘机器人，现在就是一句话的事儿。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-23aed663.png|图片]]

再比如，做自媒体的朋友们。

天天愁跟不上热点，找不到选题，写不出稿子。

现在，你可以让他全网抓取热点信息，然后批量创作。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-aeddc11e.png|图片]]

他能一边爬数据，一边帮你把稿子写了。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-9da6b508.png|图片]]

一份 4000 字的初稿，也就一根烟的功夫，就搞定了。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-025f6812.png|图片]]

当然，你也可以把自己的写作工作流封装成 Skills，直接扔给他学习。

说白了，跟咱们人干活儿的工作流一样。

把你做事儿的标准和流程，最佳实践和专业经验，统统固定成模板，喂给 AI 让他去干。

这就是 Skills。

这生产力，生产队的驴看了都得羡慕。

最爽的是，这玩意儿完全不会占用你的时间。

那些需要长时间执行的任务，不用你一直在电脑前傻等。

直接批量甩给他就行。

比如 Anthropic 官方最近发布的 Claude Skills 指南，一共 33 页，可以直接扔给他翻译。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-e455849f.png|图片]]

回头等你有空了，随时都能掏出手机查看。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-31586195.png|图片]]

整整有 7000 多字。

![[Kimi正式接入OpenClaw，实测和教程看这一篇就够了-1fcbbca9.png|图片]]

这，就是异步工作的快乐。

更多内容，可以参考下面这个官方的使用教程。

> https://kimiclaw.feishu.cn/wiki/W2o6wf94ViOrLnklVsvcCB2CnPd

## 尾声

如果你第一次接触 Agent，看完可能会感觉有点荒诞。

但，这就是此时此刻的现实。

当你关上电脑，躺在床上入睡时。

你的专属 Agent 可以在云端为你收集资讯，阅读报告，分析数据，嗅探机会。

这，就是我们梦寐以求的贾维斯呀。

它可以延伸你的意志，帮你脱离肉体和时间的限制。

你负责享受碳基生物的快乐，它负责承担硅基世界的重担。

真的要感谢 Kimi Claw，把原本属于极客的能力，交到了我们每一个普通人手里。

最后，给欧巴聊 AI 的朋友们，拜个年。

这个新年红包封面送给你。

祝大家 2026 年，都能驯服 AI 这匹千里马。

在新的一年里。

平安喜乐身体好，万事无忧无烦恼。

算力爆棚，马到成功。

#### 往期文章

[字节Seedance 2.0实测教程，老外为了用它开始恶补中文](https://mp.weixin.qq.com/s?__biz=MzYzNTI4NjUwOA==&mid=2247504715&idx=1&sn=5ba239e1e9ef2e55c430da117f9327ea&scene=21\#wechat_redirect)

既然你看到这里了，如果觉得不错，请帮我一键三连，转发给你的朋友，这真的对我很重要。

另外如果想第一时间收到推送，请将本公众号加个星标🌟

谢谢你看我的文章，祝你有财安康，我们下期见。