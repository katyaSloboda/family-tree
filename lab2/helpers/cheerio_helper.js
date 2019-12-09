"use strict";
const cheerio = require("cheerio");
const rp = require("request-promise");

module.exports = {
  getTextFromWiki: async(url) => {
    const html = await rp(url);
    let ps = [];
    let $ = cheerio.load(html);
    $("p").each((i, p) => {
      ps.push($(p).text());
    });
    return { url: decodeURI(url), ps: ps };
  },

  getPersonInfo: async(url) => {
    let links = [];
    const html = await rp(url);
    let $ = cheerio.load(html);
    $('div.g').each((i, element) => {
      let title = $(this).find('.r').text();
      let link = $(this).find('.r').find('a').attr('href').replace('/url?q=', '').split('&')[0];
      let text = $(this).find('.st').text();
      links.push({
        title: title,
        link: link,
        text: text
      });
    });
    return Promise.all(links);
  }
}
