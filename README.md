命令行翻译工具，使用有道翻译 API，提供简单翻译。

### 安装

    $ npm install translate-tool -g

mac 环境下，有可能需要加上 sudo，即

    $ sudo npm install translate-tool -g

### 使用

支持多种语言翻译，可自动检测语言。未设置目标语言，则默认 中英 互译

简单翻译命令：
`fy book`

设置源语言（-f [lan]）， 目标语言（-t [lan]）命令：
`fy book -f en -t zh`

#### 常见语种列表

| 语言     | 代码   |
| -------- | ------ |
| 简体中文 | zh-CHS |
| 繁体中文 | zh-CHT |
| 英语     | en     |
| 法语     | fr     |
| 德语     | de     |
| 日语     | ja     |
| 韩语     | ko     |
| 泰语     | th     |
| 俄语     | ru     |
| 荷兰语   | nl     |
| 西班牙语 | es     |
| 阿拉伯语 | ar     |
| 葡萄牙语 | pt     |
| 意大利语 | it     |

更多语言参照：[支持语言](https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html)
