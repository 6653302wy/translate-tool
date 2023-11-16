#! /usr/bin/env node
const axios = require("axios");
const sha256 = require("sha256");
const utf8 = require("utf8");
const tencnet = require("./tencent");

// const cmdargs = process.argv;
const cmdargs = [
  "",
  "",
  "book",
  // "-f",
  // "en",
  // "-t",
  // "zh",
];
// console.log("cmdargs: ",  cmdargs);
let query = cmdargs?.[2] ?? ""; // 获取命令行参数
if (!query) {
  console.log("warning: 无法识别要翻译的内容，请重新输入");
  return;
}
if (query.length > 2000) query = query.slice(0, 2000); // 不能超xx个字符

// const showResult = (data) => {
//   let result = "\n" + data.query + ": " + data.translation.join(",");
//   if (data?.basic) {
//     result += "\n" + data.basic.explains.join("\n");
//   }
//   if (data?.web) {
//     result += "\n\n" + "网络释义: ";
//     let webStr = "";
//     data.web.forEach((item) => {
//       webStr += "\n" + `${item.key}: ${item.value.join(",")}`;
//     });
//     result += webStr;
//   }

//   console.log(result);
// };

const iszh = (str) => {
  return /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/.test(
    str
  );
};

const checkLan = () => {
  // 检测输入的文本是否是中文
  const querySource = iszh(query) ? "zh" : "en";

  let from = querySource;
  const hasfromkey = cmdargs.indexOf("-f");
  if (hasfromkey !== -1) {
    const fromlan = cmdargs?.[hasfromkey + 1];
    from = fromlan ? fromlan : "auto";
  }

  let to = querySource === "zh" ? "en" : "zh";
  const hastokey = cmdargs.indexOf("-t");
  if (hastokey !== -1) {
    const tolan = cmdargs?.[hastokey + 1];
    to = tolan ? tolan : to;
  }

  return { from, to };
};

const getTranslateStr = () => {
  if (!query) return;

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

  // 腾讯api
  tencnet(query, from, to).then((result) => {
    console.log(result);
  });
  // 腾讯api
  // axios
  //   .post(
  //     url,
  //     {
  //       Action: "TextTranslate",
  //       Version: "2018-03-21",
  //       Region: "ap-shanghai",
  //       SourceText: query,
  //       Source: from,
  //       Target: to,
  //       ProjectId: 0,
  //     }
  //     // {
  //     //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     // }
  //   )
  //   .then(function (response) {
  //     const data = response.data;
  //     if (data?.errorCode !== "0") {
  //       console.log("error", response);
  //     } else {
  //       // console.log("response: ", data);
  //       showResult(data);
  //     }
  //   })
  //   .catch(function (error) {
  //     console.log("error==: " + error);
  //   });
};

getTranslateStr();
