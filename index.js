#! /usr/bin/env node

// 👆使用 node 进行脚本的解释程序

const tencnet = require("./tencent");
const baidu = require("./baidu");

const cmdIndex = 1; // 本地测试为1， 线上为0
const cmdargs = process.argv;

const binstr = cmdargs[cmdIndex + 1];
const cmd =
  cmdIndex === 0 ? binstr.substring(binstr.lastIndexOf("/") + 1) : binstr; // 'fy' | 'dict'
// console.log("cmdargs: ", cmdargs);

const iszh = (str) => {
  return /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/.test(
    str
  );
};

const getInputQuery = () => {
  let queryStart = cmdIndex + 2;
  // 翻译命令下，检查是否有 -f -t 等参数
  let paramIndex = cmdargs.indexOf("-t");

  let query =
    cmd === "fy"
      ? paramIndex !== -1
        ? cmdargs?.slice(queryStart, paramIndex).join(" ")
        : cmdargs?.slice(queryStart).join(" ") ?? ""
      : cmdargs?.[queryStart]; // 词典只支持查询单词

  if (!query) return "";

  return query.length > 2000 ? query.slice(0, 2000) : query; // 不能超xx个字符
};

const checkLan = (str) => {
  // 检测输入的文本是否是中文
  const querySource = iszh(str) ? "zh" : "en";

  let from = querySource;
  // const fromIndex = cmdargs.indexOf("-f");
  // if (fromIndex !== -1) {
  //   const fromlan = cmdargs?.[fromIndex + 1];
  //   from = fromlan ? fromlan : "auto";
  // }

  let to = querySource === "zh" ? "en" : "zh";
  const toIndex = cmdargs.indexOf("-t");
  if (toIndex !== -1) {
    const tolan = cmdargs?.[toIndex + 1];
    to = tolan ? tolan : to;
  }

  return { from, to };
};

const getTranslateStr = () => {
  const query = getInputQuery();
  if (!query) {
    console.log("warning: 无法识别要翻译的内容，请重新输入");
    return;
  }
  // console.log("query: ", query);

  // query = utf8.decode(query);
  // const curtime = Math.round(new Date().getTime() / 1000);
  // const salt = new Date().getTime();
  // input的计算方式为：input=q前10个字符 + q长度 + q后10个字符（当q长度大于20）或 input=q字符串（当q长度小于等于20）
  // const input =
  //   query?.length > 20
  //     ? `${query.substring(0, 10)}${query.length}${query.substring(
  //         query.length - 10
  //       )}`
  //     : query;
  // console.log("input: ", input);
  // // sha256(应用ID+input+salt+curtime+应用密钥)
  // const sign = sha256(
  //   `${appKey}${input}${salt}${curtime}Vh8UL4hyCMle9ULqX3YrV31t2CFG0H2w`
  // );

  const { from, to } = checkLan();

  if (cmd === "fy") {
    // 腾讯翻译
    tencnet(query, "auto", to);
  } else if (cmd === "dict") {
    // 百度词典
    baidu(query, from, to);
  }
};

getTranslateStr();
