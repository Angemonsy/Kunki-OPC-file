---
source: "https://mp.weixin.qq.com/s/8kBZjoV1bQSFLk3_ZClyMw"
media_id: "wechatarticle_55bb46d67e4ff52d864f1acd89192f15_f8a8062b40137aad761e78bdcd6e8b317320270712873459"
author:
  - "袋鼠帝AI客栈"
published: 2025-12-01T00:20:00
created: 2026-06-20T03:22:37
---
# Gemini3+飞书多维表格，批量扒抖音爆款&自动二创，太爽了！【喂饭级教程】

你好，我是袋鼠帝

我最近几乎天天都在用飞书多维表格，使用频率贼高，这玩意儿用起来是真滴爽。

我用它打造了一个一键批量获取抖音爆款视频所有数据（包含文案）的多维表格，还可以配合最近新出的Gemini3进行二创。

*飞书多维表格天然就是存储数据的，结合各种处理数据的节点（包含AI节点，API节点等等..）数据存储+处理一体之后，那个感觉太妙了  
*

<video src="https://mpvideo.qpic.cn/0b2ec4aauaaajmafqyjmbzuvaf6dbilqacqa.f10002.mp4?dis_k=a2cda40e208e8dfc0b6a2b44df39e17a&amp;dis_t=1781925747&amp;play_scene=10120&amp;auth_info=X5TppMsGPmVT/7vw4RhnQARvGRVvDHI1N1kZZH9LM2N5TD4zUg5jCjE0GgtFOXB6Dg==&amp;auth_key=e20a667de2465bbac82925c9a4ea0009&amp;vid=wxv_4276849200974708752&amp;format_id=10002&amp;support_redirect=0&amp;mmversion=false" controls="">您的浏览器不支持 video 标签</video>

*飞书多维表格还有仪表盘，视图等功能，方便可视化的向我展示抖音在AI领域的热点趋势，以及分析哪些防线的内容是大众喜欢的、更容易爆。  
*

对于我来说，主要是方便帮我找选题，和增加创作灵感。

不清楚飞书多维表格的朋友，可以先看看下面这篇小白教程

> 飞书多维表格小白教程
> 
> 袋鼠帝，公众号：袋鼠帝AI客栈 [放弃n8n！飞书多维表格才是效率的神，确实太好用了～【附喂饭级教程】](http://mp.weixin.qq.com/s?__biz=MzkwMzE4NjU5NA==&mid=2247512356&idx=1&sn=b5f6749a6050c91ed658453ccbee2f23&chksm=c098e0e9f7ef69ffa3b19f069c3b57e30596cfa506accbdcdfdb58a031a7dafde5b3fce98fb3\#rd)

这篇教程还收到了朋友的好评，值得一读～

![[Gemini3+飞书多维表格，批量扒抖音爆款&自动二创，太爽了！【喂饭级教程】-2aaadb8c.png|图片]]

事情是这样的，上周群里小伙伴看完教程之后，给了我一个选题：用飞书多维表格获取抖音和小红书的内容。

哈哈，感觉大家对这块还挺感兴趣，或者说有强烈需求。

正好，我最近也想把短视频再捡起来做一做，搭一套工作流也可以帮我自己提效，于是花了不少时间和精力：

摸索出了这套可以根据关键词，一键获取N（自定义）条相关爆款视频，并通过Gemini3进行二创的多维表格（我称之为批量工作流）。

在这篇文章里，把过程和方法全部免费分享给大家，当然，过程中用到的工具也都是免费的。

*PS：授人以渔，大家可以根据这篇内容，结合自己的需求或者场景，扩展更多的使用方式。*

*还有大家多次提到使用飞书多维表格要花钱，我只能说，我从用飞书开始就没花过钱.. 飞书赚的是企业的钱，对于个人来说，免费版够用了*

篇幅原因，先教大家获取抖音的内容

再立个flag：如果这篇阅读量破万，我把小红书的也补上（大家多多三连啊）

好了，话不多说，我们直接开始喂饭！

**一键批量获取抖音爆款视频数据（通过关键词）  
**

飞书多维表格里面有一款插件「抖音数据小助手」，非常好用，还免费。

直接点击飞书多维表格右上角，插件图标->探索插件市场

搜抖音数据小助手，就能找到了

看下图，这个插件可以获取18个维度的视频数据！

关键词我填AI（因为我要抓AI领域的爆款视频），一次采集50条（可自定义），需要一个Cookie（抖音的登录凭证）。

这个cookie有两种方式获取

一个是它本身提供了一个教程，通过安装一个插件来获取

但我觉得太麻烦，我就直接使用了原始方式：浏览器里面获取

先在浏览器登录自己的抖音账号

按F12打开 开发者工具，在network（网络）选中Fetch/XHR，搜索框搜索"list/?"。

这时候需要再刷新一次页面，下图展示的四个请求都可以找到cookie，随便选一个，在Headers往下滑，把cookie的内容全部复制

cookie粘过去之后，点击插件的数据获取按钮。

等个1分多钟，50条AI领域的爆款视频数据就躺在多维表格里面啦～

<video src="https://mpvideo.qpic.cn/0bc3nuakuaaa2uapt6rmhzuva3odvjwqbkqa.f10002.mp4?dis_k=8ed717bdeb971aae0229297f01b3bbc0&amp;dis_t=1781925747&amp;play_scene=10120&amp;auth_info=B6GerJxSaTRZ+OiksEEwR1c/GkduWyA0ZVAcY3lLY2chTGUwAFo0WzszSV8UYCd9XQ==&amp;auth_key=e8537c427b6d916ec3dd4b8c2dc81ccd&amp;vid=wxv_4276855035704999946&amp;format_id=10002&amp;support_redirect=0&amp;mmversion=false" controls="">您的浏览器不支持 video 标签</video>

抓下来的视频，都是点赞量比较高的爆款，也都是AI领域的内容，第一步完成的相当nice。

**获取抖音视频文案，并用AI分类  
**

「抖音数据小助手」插件并不能一键获取到视频对应的文案，但能获取到视频的原始链接（可以下载原视频）

我们可以用飞书多维表格的字段捷径来获取视频的文案。

新建一个字段「提取文案」，在编辑里面设置字段类型为文本，在字段捷径中心找到一个叫「音视频转文字」的工具添加为字段捷径。

音视频链接下拉选择「下载链接」这个字段

「音视频转文字」这个工具需要配置一个阿里百炼平台的apikey，它自带获取教程，这里就不重复赘述了。

https://bailian.console.aliyun.com/?tab=model\#/api-key

每月有36000秒（600分钟），即10小时的免费额度。

在阿里百炼的【模型广场】，搜「Paraformer语音识别-v2」，点击查看详情，就能看到（已经使用了多少，也可在这里查看）：

600分钟的免费额度，如果一个短视频按2分钟算，那么一个月也够分析300个短视频，对于个人来说够够的了。

配置好之后，这个自动更新可以勾选上，后续检测到「下载链接」字段有新增，或者更新，都会自动提取文案，非常方便。

有了短视频文案后，我们还可以根据文案内容，让AI给视频分类（打标签）。

新增一个「内容分类」字段，字段类型我选择单选，字段捷径选择「分类」。

我们需要先添加好类别，可以手动添加，也可以让AI帮我们生成类别（如下图）。

我是先让AI帮我生成分类选项，然后我在手动调整。

配置 根据「提取文案」字段，进行分类

这玩意儿原理是这样的：

我们预设了所有的分类，并设置根据「提取文案」分类，「分类」这个字段捷径，就会获取文案，用AI来判断当前文案属于哪个分类。

<video src="https://mpvideo.qpic.cn/0bc3jiakwaaanaap2bjmf5uvaswdvnfabkya.f10002.mp4?dis_k=9bf159845a4a73476403608e09f6144d&amp;dis_t=1781925747&amp;play_scene=10120&amp;auth_info=d9Kv1BJobwysu/O0HWxBBj8YHDIKd2xmAEoxKExnYShNajdeDzUAbmcaCBA8e3sM&amp;auth_key=c661148a74868e25651b9a58dde54330&amp;vid=wxv_4276865408084475916&amp;format_id=10002&amp;support_redirect=0&amp;mmversion=false" controls="">您的浏览器不支持 video 标签</video>

**接入Gemini3 将内容二次创作  
**

进行二创只是其中一个使用方式，对我来说，可以提供一些创作思路。

至于为什么选择Gemini3，因为它🐂🍺

大家可能听得最多的还是Gemini3的前端代码能力超强，但是Gemini3的写作能力也是一流的，所以用它来二创。

要接入Gemini3到飞书多维表格，需要借助一个叫「API接口请求器」的字段捷径

而飞书多维表格是没办法直接调用国外Gemini3官方API的。

这里推荐一个全球化的API中转站叫APIMart

https://apimart.ai/zh

优点是国内可用，比官方便宜，具体信息见下图

当然，大家也可以选择KG中转站，同样有Gemini3和NanoBananaPro

https://kg-api.cloud/

PS：上面两个API中转站都兼容OpenAI API接口

我这次以APIMark为例，给大家演示接入

先创建一个apikey

在APIMark首页往下拉，搜Gemini就能找到，gemini-3-pro-preview就是Gemini3，gemini-3-pro-perview就是NanoBanana Pro

接下来给字段的「API接口请求器」配置Gemini3的API请求

大模型API三件套：API地址，apikey，模型Id

API地址：

https://api.apimart.ai/v1/chat/completions

模型Id：gemini-3-pro-preview

按照下图的顺序配置，apikey添加到Authorization，值是Bearer空格apikey

请求参数，选请求体，填json格式的请求参数（Prompt也放进去了）体填json格式：

注意：要把提取的文案嵌入请求内容里面

{

"model": "gemini-3-pro-preview",

"messages": \[

{

"role": "user",

"content": "角色：你是抖音科技区金牌编导。任务：深入分析输入文案【】，从以下4个二创方向中智能筛选出最合适的几个方向：1.小白逆袭流（侧重简单、省时、搞钱）；2.硬核避坑流（侧重专业、批判、深度）；3.场景故事流（侧重职场、生活、代入感）；4.趋势观点流（侧重宏观、行业变革、未来）。规则：1.绝对不要使用不恰当的比喻，如需解释，只能用类比，且类比对象必须来自日常生活，禁止抽象或情感化比喻，否则扣分。2.不需要输出思考过程或分析步骤，直接输出最终短视频脚本。3.文案必须口语化，包含黄金3秒开头，字数200-300字。4.严格按照下方示例格式输出。输出格式示例：\[方向名称\] 文案：这里是你的脚本内容... 画面：这里是画面建议... --- \[下一个方向名称\] 文案：这里是你的脚本内容... 画面：这里是画面建议..."

}

\]

}

ok，最后效果就是下面这样，看着多维表格全自动处理数据，把数据拼图一块一块填满，莫名有种爽感～

<video src="https://mpvideo.qpic.cn/0b2ec4aauaaajmafqyjmbzuvaf6dbilqacqa.f10002.mp4?dis_k=a2cda40e208e8dfc0b6a2b44df39e17a&amp;dis_t=1781925747&amp;play_scene=10120&amp;auth_info=X5TppMsGPmVT/7vw4RhnQARvGRVvDHI1N1kZZH9LM2N5TD4zUg5jCjE0GgtFOXB6Dg==&amp;auth_key=e20a667de2465bbac82925c9a4ea0009&amp;vid=wxv_4276849200974708752&amp;format_id=10002&amp;support_redirect=0&amp;mmversion=false" controls="">您的浏览器不支持 video 标签</video>

这套批量工作流识别出来的短视频文案还是会有某些关键词错误的情况，不过整体的准确度还是挺高的。Gemini3二创出来的文案也很棒，口语化，长度适中，也比较符合爆款视频的文案逻辑。除了二创，结合各种字段捷径，和外部API接口还有非常非常多的玩法，大家可以发掘一下。

同时，我也想过搞定时监控抖音博主的工作流，但是吧，监控到又如何呢，也不清楚会不会成为爆款内容，还得做后续的爆款分析，有点麻烦。

还不如直接抓最近的相关爆款，只是需要手动点击一下才能执行，插件貌似不能定时自动执行，但不确定，这块还得研究一下，有懂的朋友可以评论区告知，感谢～

另外，大家还有什么好点子也欢迎评论区交流哦

能看到这里的都是凤毛麟角的存在！

如果觉得不错，随手点个赞、在看、转发三连吧~

如果想第一时间收到推送，也可以给我个星标⭐

谢谢你耐心看完我的文章~