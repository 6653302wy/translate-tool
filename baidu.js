const axios = require("axios");
const { Base64 } = require("js-base64");
const keys = require("./key.json");

const ak = Base64.atob(keys.client_id);
const sk = Base64.atob(keys.client_key);

// const apiurl = "https://fanyi-api.baidu.com/api/trans/vip/translate";

const getToken = () => {
  const options = {
    method: "POST",
    url:
      "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" +
      ak +
      "&client_secret=" +
      sk,
  };
  return new Promise((resolve, reject) => {
    axios(options)
      .then((res) => {
        // console.log("res.data: ", res.data);
        resolve(res.data?.access_token || "");
      })
      .catch((err) => {
        // console.log("token accessed err: ", err);
        // reject(err);
      });
  });
};

const showResult = (result) => {
  console.log("showResult ========: ", result?.dict);
  if (!result?.dict) result;

  const dict = JSON.parse(result.dict);
  //   console.log(
  //     "dict===: ",
  //     // dict,
  //     dict.word_result
  //     // dict.simple_means,
  //     // dict.symbols.parts
  //   );

  const yinbiao = dict.word_result.simple_means.symbols[0];

  let trans = `英/${yinbiao?.ph_en}/ 美/${yinbiao?.ph_am}/` + "\n\n";
  if (yinbiao.parts.length) {
    yinbiao.parts.forEach((item) => {
      console.log("yinbiao: ", item);
      trans += `${item.part} ${item.means.join("")}` + "\n";
    });
  }

  const exchange = dict.word_result.simple_means.exchange;
  if (exchange) {
    trans +=
      "\n" +
      `${exchange?.word_third ? `第三人称单数: ${exchange?.word_third}` : ""}` +
      `  ${exchange?.word_pl ? `复数: ${exchange?.word_pl}` : ""}` +
      `  ${exchange?.word_ing ? `进行时: ${exchange?.word_ing}` : ""}` +
      `  ${exchange?.word_done ? `完成时: ${exchange?.word_done}` : ""}` +
      `  ${exchange?.word_past ? `过去时: ${exchange?.word_done}` : ""}`;
  }
  //   if (dict.word_result?.edict?.item?.length) {
  //     dict.word_result?.edict?.item.forEach((tr) => {
  //       trans += "\n\n" + dict.word_result?.edict?.item?.join("\n");
  //     });
  //   }

  console.log(trans);
};

const baidu = async (text, from, to) => {
  let token = await getToken();
  if (!token) return;

  console.log("baidu: ", text, from, to);
  axios({
    method: "POST",
    url:
      "https://aip.baidubce.com/rpc/2.0/mt/texttrans-with-dict/v1?access_token=" +
      token,
    data: {
      from,
      to,
      q: text,
    },
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Accept: "application/json",
    },
  })
    .then(function (res) {
      const data = res.data;
      if (data?.error_code) {
        console.log("baidu dict err: ", data);
      } else {
        showResult(data?.result?.trans_result?.[0]);
      }
    })
    .catch(function (error) {
      //   console.log("http err==: " + error);
    });
};

module.exports = baidu;
