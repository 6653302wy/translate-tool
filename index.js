#! /usr/bin/env node
const axios = require("axios");
const sha256 = require("sha256");
const utf8 = require("utf8");

const cmdargs = [
  "",
  "",
  "无法识别要翻译的内容，请重新输入",
  // "-f",
  // "en",
  // "-t",
  // "zh-CHT",
]; // process.argv;
console.log("cmdargs: ", process.argv);
let query = cmdargs?.[2] ?? ""; // 获取命令行参数
if (!query) {
  console.log("warning: 无法识别要翻译的内容，请重新输入");
  return;
}
if (query.length > 200) query = query.slice(0, 200); // 不能超xx个字符

const showResult = (data) => {
  let result = "\n" + data.query + ": " + data.translation.join(",");
  if (data?.basic) {
    result += "\n" + data.basic.explains.join("\n");
  }
  if (data?.web) {
    result += "\n\n" + "网络释义: ";
    let webStr = "";
    data.web.forEach((item) => {
      webStr += "\n" + `${item.key}: ${item.value.join(",")}`;
    });
    result += webStr;
  }

  console.log(result);
};

const checkLan = () => {
  let from = "";
  const hasfromkey = cmdargs.indexOf("-f");
  if (hasfromkey !== -1) {
    const fromlan = cmdargs?.[hasfromkey + 1];
    from = fromlan ? fromlan : "auto";
  }

  let to = "";
  const hastokey = cmdargs.indexOf("-t");
  if (hastokey !== -1) {
    const tolan = cmdargs?.[hastokey + 1];
    if (!tolan) {
      // 检测要翻译的文字是中文/英文，设置目标语言为英文/中文
      const iszh =
        /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/.test(
          str
        );
      to = iszh ? "en" : "zh-CHS";
    } else to = tolan;
  }

  return { from, to };
};

const url = "https://openapi.youdao.com/api";
const appKey = "43c9579332d95d7f";
const getTranslateStr = () => {
  if (!query) return;

  // query = utf8.decode(query);
  const curtime = Math.round(new Date().getTime() / 1000);
  const salt = new Date().getTime();
  // input的计算方式为：input=q前10个字符 + q长度 + q后10个字符（当q长度大于20）或 input=q字符串（当q长度小于等于20）
  const input =
    query?.length > 20
      ? `${query.substring(0, 10)}${query.length}${query.substring(
          query.length - 10
        )}`
      : query;
  console.log("input: ", input);
  // sha256(应用ID+input+salt+curtime+应用密钥)
  const sign = sha256(
    `${appKey}${input}${salt}${curtime}Vh8UL4hyCMle9ULqX3YrV31t2CFG0H2w`
  );
  axios
    .post(
      url,
      { q: query, appKey, salt, sign, signType: "v3", curtime, ...checkLan() }
      // {
      //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // }
    )
    .then(function (response) {
      const data = response.data;
      if (data?.errorCode !== "0") {
        console.log("error", response);
      } else {
        // console.log("response: ", data);
        showResult(data);
      }
    })
    .catch(function (error) {
      console.log("error" + error);
    });
};

getTranslateStr();
