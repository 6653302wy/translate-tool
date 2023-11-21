命令行翻译工具，提供简单翻译。

### 安装

    $ npm install translate-tool -g

mac 环境下，有可能需要加上 sudo，即

    $ sudo npm install translate-tool -g

### 使用

1. 支持多种语言翻译。未设置语言，则默认 中/英 互译。

- **文本模式**  
  `fy ` 后跟上需要翻译的文本。长度为最大**2000**字符(包含空格)。此命令为普通文本翻译：
  例：`fy this is a book`
   
- **词典模式** (只支持中英/英英， 即目标语言均为英语)    
  `dict ` 后跟上需要翻译的单词，执行后输出单词词性，音标，释义，例句等：
  例：`dict book`
   

 
2. 设置目标语言（只支持翻译模式） -t [lan]
   例：`fy this is a book -t zh`

<br>

### 常见语种列表

| 语言     | 代码  |
| -------- | ----- |
| 简体中文 | zh    |
| 繁体中文 | zh-TW |
| 英语     | en    |
| 法语     | fr    |
| 德语     | de    |
| 日语     | ja    |
| 韩语     | ko    |
| 泰语     | th    |
| 俄语     | ru    |
| 荷兰语   | nl    |
| 西班牙语 | es    |
| 阿拉伯语 | ar    |
| 葡萄牙语 | pt    |
| 意大利语 | it    |

更多语言参照：[支持语言](https://cloud.tencent.com/document/product/551/15619)
