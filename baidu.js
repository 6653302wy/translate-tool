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
        resolve(res.data?.access_token || "");
      })
      .catch((err) => {
        // console.log("token accessed err: ", err);
      });
  });
};

const showResult = (result) => {
  //   console.log("showResult ========: ", result?.dict);
  if (!result?.dict) result;

  const dict = JSON.parse(result.dict);
  const isEn = dict.lang === "1"; // 0 中文， 1 英文 ，不同的值，返回的数据结构也不同

  const dictMeans = dict.word_result.simple_means.symbols[0];

  let trans = dictMeans?.ph_en
    ? `英/${dictMeans?.ph_en}/     美/${dictMeans?.ph_am}/` + "\n\n"
    : "";
  if (dictMeans.parts.length) {
    dictMeans.parts.forEach((item) => {
      if (isEn) {
        trans += `${item.part} ${item.means.join("; ")}` + "\n";
      } else {
        // 源语言为中文
        item?.means?.forEach((mean) => {
          console.log("mean: ", mean);
          if (mean?.means?.length) {
            trans +=
              `${mean.text} ${mean.part} ${mean.means.join("; ")}` + "\n\n";
          }
        });
      }
    });
  }

  const exchange = dict.word_result.simple_means?.exchange;
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

  //   console.log("dcit: ", text, from, to);
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
        console.log(" dict err: ", data);
      } else {
        showResult(data?.result?.trans_result?.[0]);
      }
    })
    .catch(function (error) {
      //   console.log("http err==: " + error);
    });
};

module.exports = baidu;
