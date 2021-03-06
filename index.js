const request = require('request');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
var topic = 'PTT topic';
const web = 'https://www.ptt.cc/bbs/' + topic + '/index.html';
const keyword = 'keyword'

var crawler = () => {
    request(web, function (error, response, body) {
        if (error || !body) {
            return;
        } else {
            var $ = cheerio.load(body)
            // find ariticle code start index
            var topic_index = topic.length + 8;
            // get index page articles
            var list = $('.r-ent a').map((index, obj) => {
                return {
                    title: $(obj).text(),
                    link: $(obj).attr('href'),
                    timestamp: $(obj).attr('href').substr(topic_index, 10),
                }
            }).get()
            console.log(list);

            // mail
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'xxx@gmail.com',
                    pass: 'xxx'
                }
            });

            for (let i = 0; i < list.length; i++) {
                let curTime = Math.round(Date.now() / 1000);
                let postTime = Math.round(list[i].timestamp);

                // convert to minute
                if (Math.round((curTime - postTime) / 60) <= 60 * 24 * 10) {
                    if (list[i].title.indexOf(keyword) != -1) {
                        console.log(list[i].title);

                        var mailOptions = {
                            from: '"ptt文章訂閱通知" xxx@google.com',
                            to: 'yyy@gmail.com',
                            subject: '新文章來啦',
                            html: '<h3 style="color:blue">' + list[i].title + '</h3>'
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            } else {
                                console.log('Message sent: ' + info.response);
                            }
                        });
                    }
                }
            }
        }
    })
};

crawler();
setInterval(crawler, 1000 * 60 * 61);
