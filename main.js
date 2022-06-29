const Innertube = require('youtubei.js');
const youtubei = require('youtubei.js');
const cheerio = require('cheerio');
const request = require('request');
const FormData = require('form-data');
const path = require('path');
const fs = require("fs");
const { keep_alive } = require("./keep_alive.js");
const http = require('https'); // or 'https' for https:// URLs
const login = require("fca-unofficial");
const axios = require("axios");
const YoutubeMusicApi = require('youtube-music-api')
const google = require("googlethis");
const ytdl = require('ytdl-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const ffmpegs = require('fluent-ffmpeg');
ffmpegs.setFfmpegPath(ffmpeg.path);
const musicApi = new YoutubeMusicApi();
const translate = require('@vitalets/google-translate-api');
const numItemsToGenerate = 5; 
const NLPCloudClient = require('nlpcloud');
const { Configuration, OpenAIApi } = require("openai");
const GoogleImages = require('google-images');
// GLOBAL MESSAGE STORAGE
let msgs = {};
let vips = ['100044362560006', '100078347222408', '100002098923668','100025444269484'];
let cd = {};
let bots = ["100038878990276"];
let prefix = ">";
let on = "";
let off = "";
let commands = on;
let autoreply = on;
/*==================================== LEECH tiktok FUNC ====================================*/

async function leechTT(link) {
    out = await axios.get("https://www.tiktokdownloader.org/check.php?v=" + link).then((response) => { return response.data.download_url }).catch((error) => { return "err" })
    return out
}
/*==================================== LEECH tiktok FUNC ====================================*/

/*==================================== LEECH MP3 FUNC ====================================*/
async function conv(v, t, e) {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-Key': 'de0cfuirtgf67a'
    }
    results = await axios.post("https://backend.svcenter.xyz/api/convert-by-45fc4be8916916ba3b8d61dd6e0d6994", "v_id=" + v + "&ftype=mp3&fquality=128&token=" + t + "&timeExpire=" + e + "&client=yt5s.com", { headers: headers }).then((response) => { return response.data.d_url }).catch((error) => { return error.message });
    return results
}
async function fetch(query) {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    results = await axios.post("https://yt5s.com/api/ajaxSearch", "q=" + query + "&vt=mp3", { headers: headers }).then((response) => { return response.data }).catch((error) => { return error.message });
    return results
}

async function leechmp3(query) {
    var songs = fetch(query);
    let resp = await songs.then((response) => {
        let slist = response;
        if (slist == "err") {
            return "err"
        }
        else if (slist.t < 1300) {
            let d_url = conv(slist.vid, slist.token, slist.timeExpires).then((response) => {
                return [response, slist.title]
            });
            return d_url
        }
        else if (slist.p == "search") {
            return 'err'
        }
        else if (slist.mess.startsWith("The video you want to download is posted on TikTok.")) {
            return 'tiktok'
        }
        else {
            return 'pakyo'
        }
    });
    return resp
}

/*==================================== LEECH MP3 FUNC ====================================*/

/*==================================== RANDOM QOUTES FUNC ====================================*/

async function getWiki(q) {
    out = await axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/" + q).then((response) => { return response.data }).catch((error) => { return error })
    return out
}
async function qt() {
    let qoute = await axios.get("https://zenquotes.io/api/random").then((response) => { return response.data[0] }).catch((err) => { return "err " });
    return qoute
}
/*==================================== RANDOM QOUTES FUNC ====================================*/

/*====================================  SAIKIIWRAP FUNC ===========================================*/

async function saikiiWrap(ctx, text, maxWidth) {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        const words = text.split(' ');
        const lines = [];
        let line = '';
        while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width >= maxWidth) {
                const temp = words[0];
                words[0] = temp.slice(0, -1);
                if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                else {
                    split = true;
                    words.splice(1, 0, temp.slice(-1));
                }
            }
            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
            else {
                lines.push(line.trim());
                line = '';
            }
            if (words.length === 0) lines.push(line.trim());
        }
        return resolve(lines);
    });
}

/*====================================  SAIKIIWRAP FUNC ===========================================*/

async function saikiiWrap(ctx, text, maxWidth) {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        const words = text.split(' ');
        const lines = [];
        let line = '';
        while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width >= maxWidth) {
                const temp = words[0];
                words[0] = temp.slice(0, -1);
                if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                else {
                    split = true;
                    words.splice(1, 0, temp.slice(-1));
                }
            }
            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
            else {
                lines.push(line.trim());
                line = '';
            }
            if (words.length === 0) lines.push(line.trim());
        }
        return resolve(lines);
    });
}

/*======================================== BIBLE VERSE ============================================*/

async function verse() {
    let v = await axios.get("http://labs.bible.org/api/?passage=random&type=json").then((response) => {
        return response.data[0]
    }).catch((err) => {
        return "Error"
    })
    return v
}

/*====================================== BIBLE VERSE ==============================================*/
/*==================================== ANIMELIST ====================================*/
async function wholesome() {
    let req = axios("https://wholesomelist.com/api/random");
    return req;
}
/*==================================== ANIMELIST ====================================*/


login({ appState: JSON.parse(fs.readFileSync('fbstate.json', 'utf8')) }, (err, api) => {
    if (err) return console.error(err);
    api.setOptions({ listenEvents: true, selfListen: true });


    /*====================================== AUTO ACCEPT THREAD ==============================================*/
    function getThread(){
        let taggs = ["OTHER", "unread"];
        let tagg = ["PENDING", "unread"];
        api.getThreadList(1, null, taggs, (err, list) => {
            if (err) return console.error("error getting list");
            if (list.length != 0) {
                try {
                    api.handleMessageRequest(list[0]['threadID'], true, (err) => {
                        if (err) return console.log("HANDLE MESSAGE REQUEST ERROR");
                        console.log('Thread Accepted')


                        api.sendMessage(`*=================================*\n\n💠Hello This is Axczel Bot at your service how can I help you?\n\nI'm here to monitor and serve.\n💠For more info and to know me further just type >help to know me further\n\nA friendly message from the Creator💕\n\n*=================================*`, list[0]['threadID']);
    
                        api.changeNickname("Axczel Bot", list[0]['threadID'], "100038878990276", (err) => {
                            if (err) return console.error("CHANGE NICKNAME ERROR");
                        });
                    });
                } catch(err) {

                }
            }
        });
        api.getThreadList(1, null, tagg, (err, list) => {
            if (err) return console.error("error getting list");
            if (list.length != 0) {
                try {
                    api.handleMessageRequest(list[0]['threadID'], true, (err) => {
                        if (err) return console.log("HANDLE MESSAGE REQUEST ERROR");
                        console.log('Thread Accepted')
                        api.sendMessage("Hello This is Axczel Bot at your service how can I help you?\n\nI'm here to monitor and serve. For more info and to know me further just type >help\n\nA friendly message from the Creator💕", list[0]['threadID']);
    
                        api.changeNickname("Axczel Bot", list[0]['threadID'], "100038878990276", (err) => {
                            if (err) return console.error("CHANGE NICKNAME ERROR");
                        });
                    });
                } catch(err) {

                }
            }
        }); 
    }
    var x = setInterval(getThread, 90000);
/*====================================== AUTO ACCEPT THREAD ==============================================*/


    const listenEmitter = api.listen(async (err, event) => {
        if (err) return console.error(err);
        let sdrid = event.senderID;
        let trid = event.threadID;
        let msgid = event.messageID
        let input = event.body;
        /*====================================== AUTO CHANGE NICKNAME ==============================================*/
        function changeNN() {
            api.getThreadInfo(trid, (err, call) => {
              try {
                if (call.nicknames.hasOwnProperty('100038878990276')) {
                    if (call.nicknames['100038878990276'] != "Axczel Bot") {
                        api.changeNickname("Axczel Bot", trid, "100038878990276", (err) => {
                            if (err) return console.error(err);
                        });
                    }
                } else {

                    api.changeNickname("Axczel Bot", trid, "100038878990276", (err) => {
                        if (err) return console.error(err);
                    });
                }
              } catch(err) {
                
              }
            })
        }
/*====================================== AUTO CHANGE NICKNAME ==============================================*/
switch (event.type) {        
case "event":
                switch (event.logMessageType) {
                    case "log:subscribe":

                        api.getThreadInfo(trid, (err, call) => {
                            console.log(call);
                            if (call.isGroup) {
                                let mess = {
                                    body: `*=================================*\n💠Hello I am Axczel Bot in charge of monitoring and providing service in this group💠\n*=================================*\n\n*=================================*\nWelcome😍 @${event.logMessageData.addedParticipants[0].fullName}, You're the ${call.participantIDs.length} Member of ${call.threadName}\n\nPlease follow the terms of use, respect all members and admins. Hope that you enjoy and find friends here.\n💠For more info about me just type " >help " to know my function.\n⚠️Please don't spam using command to avoid the bot from being muted as much as possible request again after finishing the other requests\n💠Use Responsibly\nLet the bot do there job💕\n\n~Axczel (Axl Chan)\nA friendly message from the Creator💕\n*=================================*`,
                                    mentions: [{
                                        tag: event.logMessageData.addedParticipants[0].fullName,
                                        id: event.logMessageData.addedParticipants[0].userFbId
                                    }]
                                }
                                api.sendMessage(mess, trid);
                            }
                        })
                        break;
                        case "log:unsubscribe":
                            var id = event.logMessageData.leftParticipantFbId;

                            api.getThreadInfo(event.threadID, (err, gc) => {
                                if (err) done(err);
                                console.log(gc)
                                api.getUserInfo(parseInt(id), (err, data) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        console.log(data)
                                        for (var prop in data) {
                                            if (data.hasOwnProperty(prop) && data[prop].name) {
                                                var gcn = gc.threadName;
                                                api.sendMessage({
                                                    body: "Hanggang sa muli, @" + data[prop].name + " senpai🥺😥\n\nKaming lahat ng " + gcn + " ay mamimiss ka🥺😭", mentions: [{ tag: '@' + data[prop].name, id: id, }], attachment:
                                                        fs.createReadStream(__dirname + "/goodbye.mp3")
                                                }, event.threadID)
                                            }
                                        }
                                    }
                                })
                            })
                            await new Promise(resolve => setTimeout(resolve, 7500));
                            api.getThreadInfo(event.threadID, (err, gc) => {
                                if (err) done(err);
                                var gcn = gc.threadName;
                                var arr = gc.participantIDs;
                                var Tmem = arr.length;
                                api.sendMessage(gcn + "\n\n💠Total Member(Updated)💠\n\n =>" + Tmem, event.threadID, event.messageID)
                            })
                        break;
                }
                break;
            
            case "message_reply":
                let replysid = event.messageReply.senderID;
                let replytid = event.messageReply.threadID;
                if (vips.includes(event.senderID)) {
                    api.setMessageReaction("😍", event.messageID, (err) => {
                    }, true);
                }
                // else {
                // api.setMessageReaction("🥱", //event.messageID, (err) => {
                //   }, true);
                //  }
                msgs[msgid] = input;
                if (input.startsWith(">redeem")) {
                    let data = input.split(" ");
                    if (data.length < 3) {
                        api.sendMessage("❌Invalid Use Of Command!\n💡Usage: >redeem id vcode", event.threadID);
                    } else {
                        try {
                            let gameid = data[1];
                            let vcode = data[2];
                            let code = event.messageReply.body;
                            function redeem(gameid, vcode, code) {
                                (async () => {
                                    try {
                                        const response = await axios.post('https://api.mobilelegends.com/mlweb/sendCdk', { "redeemCode": code, "roleId": gameid, "vCode": vcode, "language": "en" });
                                        const msgs = ('{"-20023": "Invalid Game ID","-20027":"Request too Frequent!...","-20010":"Invalid Verification Code!","0":"Redeemed Successfully!","1401":"redeem in specified zone","1402":"This CDKey does not exist","1403":"CDKey expired","1404":"Incorrect format of CDKey","1405":"This CDKey has been redeemed.","1406":"Bound Account CDKey. Incorrect account.","1407":"Exceeds exchange amount limit.","1408":"Can only redeem in specified zone.","1409":"Restriction Requirement Configuration Error","1410":"This CDKey is being redeemed by many players. The Server is processing... Please try again later.","1411":"It\'s not exchange time, please wait.","1412":"Limit reached for number of people exchanging.","1413":"You are not a new user","1414":"You haven\'t purchased yet","1415":"Your level is too high","1416":"You can not redeem the CDKey through your channel","1036":"The amount limitation of CDKey redeemption"}');
                                        let responses = JSON.parse(msgs);
                                        let resp = response.data.code;
                                        let respcode = resp.toString();
                                        let msg = responses[respcode];
                                        let stat = response.data.status;
                                        api.sendMessage("💠Axczel Bot x Redeemer💠\n\n🆔Game Id: " + gameid + "\n🔰Status: " + stat + "\n📧Message: " + msg + "", event.threadID);
                                    } catch (error) {
                                        console.log(error.message);
                                    }
                                })();
                            }
                            api.sendMessage("🔁Trying to Redeem...(" + code + ")", event.threadID);
                            redeem(gameid, vcode, code);
                        } catch (err) {
                            api.sendMessage("❌Error: " + err.message, event.threadID);
                        }
                    }
                }


                if (input.startsWith(">sendvc")) {
                    let data = input.split(" ");
                    if (data.length < 1) {
                        api.sendMessage("❌Invalid Use Of Command!\n💡Usage: >sendvc id", event.threadID);
                    } else {
                        try {
                            let gameid = event.messageReply.body;
                            function sendvc(gameid) {
                                (async () => {
                                    try {
                                        const response = await axios.get('https://api.mobilelegends.com/mlweb/sendMail?roleId=' + gameid.toString() + '&language=en');
                                        const msgs = ('{"9601": "Error sending and receiving vcode","-20023": "Invalid Game ID","-20027":"Request too Frequent!...","-20028":"Verification code already sent...","-20010":"Invalid Verification Code!","0":"Verification Code Sent Successfully!","1401":"redeem in specified zone","1402":"This CDKey does not exist","1403":"CDKey expired","1404":"Incorrect format of CDKey","1405":"This CDKey has been redeemed.","1406":"Bound Account CDKey. Incorrect account.","1407":"Exceeds exchange amount limit.","1408":"Can only redeem in specified zone.","1409":"Restriction Requirement Configuration Error","1410":"This CDKey is being redeemed by many players. The Server is processing... Please try again later.","1411":"It\'s not exchange time, please wait.","1412":"Limit reached for number of people exchanging.","1413":"You are not a new user","1414":"You haven\'t purchased yet","1415":"Your level is too high","1416":"You can not redeem the CDKey through your channel","1036":"The amount limitation of CDKey redeemption"}');
                                        let responses = JSON.parse(msgs);
                                        let resp = response.data.code;
                                        let respcode = resp.toString();
                                        let msg = responses[respcode];
                                        let stat = response.data.status;
                                        api.sendMessage("💠Axczel Bot x Redeemer💠\n\n🆔Game Id: " + gameid + "\nStatus: " + stat + "\nMessage: " + msg + "", event.threadID);
                                    } catch (error) {
                                        console.log(error.response.body);
                                    }
                                })();
                            }
                            api.sendMessage("🔁Sending Verification Code...(" + gameid + ")", event.threadID);
                            sendvc(gameid);
                        } catch (err) {
                            api.sendMessage("❌Error: " + err.message, event.threadID);
                        }
                    }
                }
                
                
                if (input.startsWith(">removebg")) {
          const { threadID, messageID, type, messageReply } = event;
if (type != "message_reply") return           
	if (messageReply.attachments.length < 1){
	api.sendMessage("[ERR]⚠️No Image Detected!", event.threadID,event.messageID);
	} else if (messageReply.attachments.length > 1){
	api.sendMessage("[ERR]❌Cannot use bulk bg remover at multiple image at same time, Select 1 Image Only!", event.threadID,event.messageID);
	}
	else if ((messageReply.attachments.length === 1)&&(messageReply.attachments[0].type == 'photo')){
const url = messageReply.attachments[0].url;
request(url).pipe(fs.createWriteStream("SharedFilesphoto.png")).on('finish',() => {
const inputPath = 'SharedFilesphoto.png';
const formData = new FormData();
formData.append('size', 'auto');
formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

axios({
  method: 'post',
  url: 'https://api.remove.bg/v1.0/removebg',
  data: formData,
  responseType: 'arraybuffer',
  headers: {
    ...formData.getHeaders(),
    'X-Api-Key': 'vnn9nXmgUPzSaV3sYsnwSGdv',
  },
  encoding: null
})

.then((res) => {
  if(res.status != 200) return console.error('Error:', res.status, res.statusText);
  fs.writeFileSync("SharedFilesphoto.png", res.data);
  var message = {
         body:("KEVZ BG Remover"),
         attachment: 
fs.createReadStream(__dirname + "/SharedFilesphoto.png")}  
  api.sendMessage(message, event.threadID,event.messageID);
})
.catch((error) => {
api.sendMessage("[ERR]❌Request Failed\n\n"+error, event.threadID,event.messageID);
    return console.error('Request failed:', error);
});
})}

}
if (input.startsWith(">add")) {    
                                api.addUserToGroup(replysid, (err,data) => {
                                if (err) return api.sendMessage("User not Found",trid,msgid);
                                
                            });
}

if (input.startsWith(">fb")) {

                    api.getUserInfo(replysid, (err, data) => {
                        if (err) return console.log(err);

                        let name = data[replysid]['name'];
                        let vanity = data[replysid]['vanity'];
                        let profileUrl = data[replysid]['profileUrl'];
                        let profileBio = data[replysid]['profileBio'];
                        

                        request(`https://graph.facebook.com/${replysid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`).pipe(fs.createWriteStream('files.jpg')).on('finish', function () {
                            console.log('finished downloading files..');
                            var message = {
                                body: `👤Name: ${name}\n💳NameID: ${vanity}\n🆔Id: ${replysid}\n🔗Profile: ${profileUrl}`,
                                attachment: fs.createReadStream(__dirname + '/files.jpg')
                                    .on("end", async () => {
                                        if (fs.existsSync(__dirname + '/files.jpg')) {
                                            fs.unlink(__dirname + '/files.jpg', function (err) {
                                                if (err) console.log(err);
                                                console.log(__dirname + '/files.jpg is deleted');
                                            })
                                        }
                                    })
                            }
                            
                            api.sendMessage(message, replytid);

                        })

                    })

                    }
                    if (input.startsWith("Unsend") && vips.includes(event.senderID)) {
            api.unsendMessage(event.messageReply.messageID, (err) => {
              if (err) {
api.sendMessage("Note: Unsend Command can only used by VIP user.", event.threadID, event.messageID);
              } else {console.log("Unsend Done");
              }
            })
            }
                    break;


            case "message":
                if (vips.includes(event.senderID)) {
                    api.setMessageReaction("😍", event.messageID, (err) => {
                    }, true);
                }
                //  else {
                // api.setMessageReaction("🥱", //event.messageID, (err) => {
                //  }, true);
                //    }
                if (event.attachments.length != 0) {
                    if (event.attachments[0].type == "photo") {
                        msgs[event.messageID] = ['img', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "animated_image") {
                        msgs[event.messageID] = ['gif', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "sticker") {
                        msgs[event.messageID] = ['sticker', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "video") {
                        msgs[event.messageID] = ['vid', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "audio") {
                        msgs[event.messageID] = ['vm', event.attachments[0].url]
                    }
                } else {
                    msgs[event.messageID] = event.body
                }
                if (event.body != null) {
                    let input = event.body;




                    // THIS BOT WAS CREATED BY Axl Chan! DO NOT STEAL WITHOUT PROPER CREDITS!
                    if (input.startsWith(">help")) {

                        let data = input.split(" ");
                        if (data.length < 2) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠List of Commands Sort by Category💠\n\nPrefix: >\n\n>fun - to show the list of fun and entertainment commands\n\n>education - to show the list of educational commnds\n\n>ml - to show the mobile legends command\n\n>tts - to show the text to speech commands\n\n>fbtools - to show the Facebook tools commands\n\n>Track - to show the list of tracking commands\n\n>cs - customer service commands to contact the creator\n\n>info - to show the Bot and Creator' message\n\n💠AI Chat Bot💠\n🔰Kevin (an AI with interesting but sarcastic behavior.\nmore detailed info and paragraph length\nIf you feel you're alone, looking for chat mates He's here for you)\n\n🔰Joyce (An interesting AI with attitude same as Kevin.\nIf ever you feel that you're you can chat her by typing her name and say anything.)\n\n💠This function well if the command goes well\n💠Upon using this bot\nDo not Spam to avoid getting error\nand to provide your request\nUse responsibly\n💠Message from the Creator💕\n\nMade by:  " + '@Axczel' + "" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });
                        }       
                        }
                    if (input.includes(">contact mk") || input.includes(">send mk ") && !bots.includes(event.senderID)) {
                        api.getUserInfo(event.senderID, (err, data) => {
                            if (err) {
                                console.log(err)
                            } else {
                                api.sendMessage(("Hello senpai " + data[event.senderID]['name'] + " your message has been successfully delivered, please wait for the creator's response.\nIf no response received kindly try again or check your message request\nThank you..."), event.threadID, event.messageID)
                            }
                        })
                        }
                    if (input.startsWith(">landscape")){
                   request("https://source.unsplash.com/1600x900/?landscape").pipe(fs.createWriteStream(__dirname + '/landscape.png')).on('finish',() =>{
                   var message = {
                   attachment: 
fs.createReadStream(__dirname + '/landscape.png')}
api.sendMessage(message ,event.threadID,event.messageID)
                   })
                    }
                    if (input.startsWith(">saytag")) {
                        let data = input.split(" ");
                        if (data.length < 2) {
                            api.sendMessage("Invalid Use of Command:>saytag message", trid, msgid);
                        } else {
                            try {
                                data.shift();
                                let responses = "https://texttospeech.responsivevoice.org/v1/text:synthesize?text=" + encodeURIComponent(data.join(" ")) + "&lang=fil-PH&engine=g1&rate=0.5&key=0POmS5Y2&gender=female&pitch=0.5&volume=1";
                                var file = fs.createWriteStream(__dirname + '/say.mp3');
                                var gifRequest = http.get(responses, function (gifResponse) {
                                    gifResponse.pipe(file);
                                    file.on('finish', function () {
                                        console.log('finished downloading')
                                        var message = {
                                            attachment: fs.createReadStream(__dirname + '/say.mp3')
                                                .on("end", async () => {
                                                    if (fs.existsSync(__dirname + '/say.mp3')) {
                                                        fs.unlink(__dirname + '/say.mp3', function (err) {
                                                            if (err) console.log(err);
                                                            console.log(__dirname + '/say.mp3 is deleted');
                                                        })
                                                    }
                                                })
                                        }
                                        api.sendMessage(message, trid, msgid);
                                    });
                                });

                            } catch {
                                api.sendMessage("Unexpected Error", trid, msgid);
                            }
                        }
                        }
                        if (input.startsWith(">sayjap")) {
                        let data = input.split(" ");
                        if (data.length < 2) {
                                api.sendMessage("Invalid Use of Command: >sayjap message", trid, msgid);
                            } else {
                                try {    
                                    data.shift();
                                    let responses = "https://texttospeech.responsivevoice.org/v1/text:synthesize?text="+encodeURIComponent(data.join(" "))+"&lang=ja&engine=g1&rate=0.5&key=0POmS5Y2&gender=female&pitch=0.5&volume=1";
                                    var file = fs.createWriteStream(__dirname + '/sayjap.mp3');
                                    var gifRequest = http.get(responses, function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading')
                                            var message = {
                                                attachment: fs.createReadStream(__dirname + '/sayjap.mp3')
                                                .on("end", async () => {
                                                    if (fs.existsSync(__dirname + '/sayjap.mp3')) {
                                                        fs.unlink(__dirname + '/sayjap.mp3', function (err) {
                                                            if (err) console.log(err);
                                                            console.log(__dirname + '/sayjap.mp3 is deleted');  
                                                        })
                                                    }
                                                })
                                            }
                                            api.sendMessage(message, trid, msgid);
                                        });
                                    });
                                } catch {
                                    api.sendMessage("Unexpected Error", trid, msgid);
                                }

                            }
                        }
                        if (input.startsWith(">hsouce")) {
                         let data = input.split(" ");
                         let dls = wholesome();
                            dls.then((response) => {
                                let tags = response.data.entry.tags.join(', ');
                                try {    
    
                                    let responses = response.data.entry.image;
                                    var file = fs.createWriteStream(__dirname + '/hsouce.png');
                                    var gifRequest = http.get(responses, function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading')
                                            
                var messages = {
                    body: `Title: ${response.data.entry.title}\nAuthor: ${response.data.entry.author}\nTag(s): ${tags}\nNote: ${response.data.entry.note}\nParody: ${response.data.entry.parody}\nTier: ${response.data.entry.tier}\nPages: ${response.data.entry.pages}\nLink: ${response.data.entry.link}`,
                    attachment: fs.createReadStream(__dirname + '/hsouce.png')
                    .on('end', async () => {
                        if (fs.existsSync(__dirname + '/hsouce.png')) {
                            fs.unlink(__dirname + '/hsouce.png', function (err) {
                                if (err) console.log(err);
                                console.log(__dirname + '/hsouce.png is deleted');  
                            })
                        }
                    })
                }
                api.sendMessage(messages, trid, msgid);
                                        });
                                    });
                                } catch {
                                    api.sendMessage("Unexpected Error", trid, msgid);
                                }
                                });
                    }
                    if (input.startsWith(">kick")) {
                        api.getThreadInfo(event.threadID, (err, gc) => {
                            var { mentions, senderID, threadID, messageID } = event;
                            var mentionid = `${Object.keys(mentions)[0]}`;
                            var admin = gc.adminIDs;
                            const res = [];
                            for (let i = 0; i < admin.length; i++) {
                                var gca = admin[i].id;
                                res.push(gca);
                            }
                            var admin = res;
                            if (admin.includes(event.senderID)) {
                                if (admin.includes("100038878990276")) {
                                    api.removeUserFromGroup(mentionid, threadID)
                                } else {
                                    api.sendMessage("[ERR]❌Possible Reasons\n\n1. Bot is not an Admin on GC.\n\nNote: To use !Kick @user feature make sure to add this bot on your group admin", threadID, messageID)
                                }
                            } else {
                                api.sendMessage("[ERR]⚠️User is not a Group Admin", threadID, messageID)
                            }
                        })
                    }
                    if (/(goodmorning|good morning|magandang umaga|magandangumaga)/ig.test(input.toLowerCase())) {
                        api.getUserInfo(event.senderID, (err, data) => {
                            api.sendMessage({
                                body: "Good Morning😘💕" + '@' + data[event.senderID]['name'] + "\nRise up, start fresh see the bright opportunity in each day💕\n\n~Axczel Bot Auto Greet",
                                mentions: [{
                                    tag: '@' + data[event.senderID]['name'],
                                    id: event.senderID,
                                    fromIndex: 0
                                }],
                            }, event.threadID, event.messageID)
                        })
                    }
                    else if (/(goodafternoon|good afternoon|magandang hapon|magandanghapon)/ig.test(input.toLowerCase())) {
                        api.getUserInfo(event.senderID, (err, data) => {
                            api.sendMessage({
                                body: "Good Afternoon😘💕" + '@' + data[event.senderID]['name'] + "\nThe afternoon is that time in the day when you can fulfill that big dream of yours.\nHave the best afternoon💕\n\n~Axczel Bot Auto Greet ",
                                mentions: [{
                                    tag: '@' + data[event.senderID]['name'],
                                    id: event.senderID,
                                    fromIndex: 0
                                }],
                            }, event.threadID, event.messageID)
                        })
                    }
                    else if (/(goodevening|good evening|magandang gabi|magandanggabi)/ig.test(input.toLowerCase())) {
                        api.getUserInfo(event.senderID, (err, data) => {
                            api.sendMessage({
                                body: "Good Evening😘💕" + '@' + data[event.senderID]['name'] + "\nEvenings are ways to end the days stress and struggle. I hope you didn't give yourself too much stress.\nHave a great evening💕\n\n~Axczel Bot AutoGreet",
                                mentions: [{
                                    tag: '@' + data[event.senderID]['name'],
                                    id: event.senderID,
                                    fromIndex: 0
                                }],
                            }, event.threadID, event.messageID)
                        })
                    }
                    else if (/(goodnight|good night|gnight|nyt)/ig.test(input.toLowerCase())) {
                        api.getUserInfo(event.senderID, (err, data) => {
                            api.sendMessage({
                                body: "Good Night😘💕" + '@' + data[event.senderID]['name'] + "\nTonight, It will be your most colorful dream and your sweetest sleep in life. Just let me in when I knock on the door of your heart. Again Good night💕\n\n~Axczel Bot AutoGreet",
                                mentions: [{
                                    tag: '@' + data[event.senderID]['name'],
                                    id: event.senderID,
                                    fromIndex: 0
                                }],
                            }, event.threadID, event.messageID)
                        })                  
                    }
                    
                    else if (input.startsWith(">info")) {

                        let data = input.split(" ");
                        if (data.length < 2) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠Axczel Bot Information💠\n\n💠Created by:  " + '@Axczel' + "\n💠Description: Axczel Bot is a Facebook messenger chat bot made using NodeJS, Axios and the Unofficial Facebook Chat API.\n\n\n💠Thanks to:\n©️Earl and Company, Hack Me  Senpai and to all We are Bot's Dev's Team Labyu all mga boss\n\n💠special thanks💠\n🔰Boss Jet\n🔰Boss Justine\n\nFor fixing error and fixing bugs\nMade with💕 by: Axczel with the help of the mentioned above\n\n💠Upon using this bot make sure to used responsibly\nto avoid getting muted or malfunction\n\n" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                    }

                    if (input.startsWith(">verse")) {
                        let v = verse()
                        v.then((response) => {
                            api.sendMessage("From the book of " + response.bookname + " chapter " + response.chapter + " verse " + response.verse + "\n\n" + response.text, event.threadID)
                        }).catch((err) => {
                            console.log(err)
                        })

} 
  
else if (input.startsWith(">brainly")) {
var text = input;     
text = text.substring(7)
const r = await google.search("Brainly"+text);
const url = r.results[0].url;
    const { data } = await axios.get(url);
    //console.log(data)
    //fs.writeFileSync("Axios.txt", data, "utf8");
    const $ = cheerio.load(data);
    const mainClass = $("h1[data-testid='question_box_text']");
    const mainClass2 = $("div[class='brn-qpage-next-answer-box__content js-answer-content-section'] div div div");
    const res = [];
    mainClass.each((idx, el) => {
    const total = {};
      total.question = $(el).children("span[class='sg-text sg-text--large sg-text--bold sg-text--break-words brn-qpage-next-question-box-content__primary']").text();
      res.push(total);
      });
      const res2 = [];
      mainClass2.each((idx, el) => {
      const total2 = {};
      total2.answer = $(el).children("p").text();
      res2.push(total2);
    });
    if ((res.length < 1) && (res2.length < 1)){
    api.sendMessage("[ERR]❌There's no available anwers for this question on brainly. try different one.",event.threadID,event.messageID)
    }else{
    var q = res[0].question;
    var a = res2[0].answer;
    api.sendMessage("💠Brainly Ft. KevzBot💠\n\n🔰Question: "+q+"\n"+a,event.threadID,event.messageID)}
    }

else if (input.startsWith(">dsearch")) {
        let data = input.split(" ");
         if (data.length < 2) {
            api.sendMessage("❌Invalid Use Of Command!\n💡Usage: >dsearch (powered by duckduckgo)", event.threadID);
        }else{
            data.shift()
        let texts = data.join(" ");
        let text = data.join(" ");
            axios.get('https://api.duckduckgo.com/?q='+text+'&format=json&pretty=1')
                 .then(response => {
                    api.sendMessage("🔎You search for: " + text + "\nTopic: " +response.data.Heading + "\n\n" + response.data.Abstract + "\n\n" + response.data.Image + "", event.threadID, event.messageID);
                         })
                         .catch(error => {
                        api.sendMessage(`❌ ${err.message}`, event.threadID, event.messageID);
                       });
                     }
                     }
                     else if (input.startsWith(">summarize")) {
var {mentions, senderID, threadID, messageID} = event;
                    if (input.split(" ").length < 2){
                    api.sendMessage("⚠️Invalid Use Of Command!\n💡Usage: >summarize <text/paragraph>",threadID,messageID)
                    }else{
                    var text = input.substring(11);
                    const client = new NLPCloudClient('bart-large-cnn','515b430b172c93d62dd9f149c3274037839083ff')
client.summarization(text).then(function ({data}) {
    api.sendMessage("💠Axczel Bot x Summarizer💠: \n\n"+data.summary_text,threadID,messageID)
  }).catch(function (err) {
    api.sendMessage("⚠️[ERR]: Status:"+err.response.status+"\nError Details: "+err.response.data.detail,threadID,messageID)
  });
}
}
else if (input.startsWith("Secre")){
                   var {mentions, senderID, threadID, messageID} = event;
                    if (input.split(" ").length < 2){
                    api.sendMessage("yun lang? walang lambing?🥺🙄",threadID,messageID)
                    }else{
                    var text = input.substring(6)
                    const configuration = new Configuration({
  apiKey: "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",
});
                    const openai = new OpenAIApi(configuration);
const {data} = await openai.createCompletion("text-curie-001", {
  prompt: text,
  temperature: 0.5,
  max_tokens: 2000,
  top_p: 0.3,
  frequency_penalty: 0.5,
  presence_penalty: 0.0,
});
          api.sendMessage(data.choices[0].text, threadID, messageID)
                    }
}
else if (input.startsWith("Axl")){
                   var {mentions, senderID, threadID, messageID} = event;
                    if (input.split(" ").length < 2){
                    api.sendMessage("yun lang sasabihin mo? ang cold naman😑🙄",threadID,messageID)
                    }else{
                    var text = input.substring(6)
                    const configuration = new Configuration({
  apiKey: "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",
});
                    const openai = new OpenAIApi(configuration);
const {data} = await openai.createCompletion("text-davinci-002", {
  prompt: text,
  temperature: 0.5,
  max_tokens: 4000,
  top_p: 0.3,
  frequency_penalty: 0.5,
  presence_penalty: 0.0,
});
          api.sendMessage(data.choices[0].text, threadID, messageID)
                    }
                    }
                    else if (input.startsWith(">contact")){
                   var text = input;
                   text = text.substring(9)
                   const threadid = text.split(' ');
    let gc;
                   const message = text.substring(text.indexOf(' ')+1);
var {senderID, threadID, messageID} = event;
           api.getUserInfo(parseInt(senderID), (err, data) => {   
                 switch(threadid[0]){
                     case "mk":
                     gc = "5428396640538543";
                     break;
                   case "MLECTV1":
                     gc = "4168499269905657";
                     break;
                 }                       
                   if(err){console.log(err)
                   }else{
                   var id = Object.keys(data);
                   var name = data[id].name;
                   api.sendMessage({body: "💠 Customer Service Message💠\n@"+name+"\n"+id+"\n\n"+message, mentions: [{tag: '@'+name, id: senderID,}]}, gc)  
                    }
                    })
                    }
                    else if (input.startsWith(">gc")){
                   var text = input;
                   text = text.substring(4)
                   const threadid = text.split(' ');
                   const message = text.substring(text.indexOf(' ')+1);
var {senderID, threadID, messageID} = event;
                   api.getUserInfo(parseInt(senderID), (err, data) => {
                   if(err){console.log(err)
                   }else{
                   var id = Object.keys(data);
                   var name = data[id].name;
                   api.sendMessage({body: "💠 MESSAGE FROM THE CREATOR💠\n@"+name+"\n\n"+message, mentions: [{tag: '@'+name, id: senderID,}]}, threadid[0])}
                   })
                   }
                    else if (input.startsWith(">reply")){
                   var text = input;
                   text = text.substring(7)
                   const threadid = text.split(' ');
                   const message = text.substring(text.indexOf(' ')+1);
var {senderID, threadID, messageID} = event;
                   api.getUserInfo(parseInt(senderID), (err, data) => {
                   if(err){console.log(err)
                   }else{
                   var id = Object.keys(data);
                   var name = data[id].name;
                   api.sendMessage({body: "🟢Customer Service Message Response 🟢\nby the creator @"+name+"\n\nto @"+message, mentions: [{tag: '@'+name, id: senderID,}]}, threadid[0])}
                   })
                   }
                   else if (input.startsWith(">trace")) {
                    var { threadID, messageID} = event;
                    if (input.split(" ").length < 2){
                    api.sendMessage("⚠️Invalid Use Of Command!\n💡Usage: >trace <country code> <zip/postal/area code>",threadID,messageID)
                    }else{
  var text = input.substring(7)
  const c_code = text.split(' ');
const zip = text.substring(text.indexOf(' ')+1);
                    const {data} = await axios.get("https://api.zippopotam.us/"+c_code[0]+"/"+zip).catch((err)=> api.sendMessage("⚠️[ERR]: "+err,threadID,messageID));
    var obj = Object.values(data);
    var obj2 = Object.values(data.places[0]);
    var postal = obj[0];
    var country = obj[1];
    var countryCode = obj[2];
    var place = obj2[0];
    var long = obj2[1];
    var lat = obj2[4];
    /*var state = obj2[2];
    var stateCode = obj2[3];*/
    api.sendMessage({
          body:"==================="+"\nZip Code Information\n===================\nZip/Postal: "+postal+"\nCountry: "+country+"\nAbreviation: "+countryCode+"\nPlace Name: "+place+"\nLongitude: "+long+"\nLatitude: "+lat , location: {
				latitude: lat,
				longitude: long,
				current: true
			}
    }, threadID, messageID)
    }    
    }
                   else if (input.startsWith(">trackip")) {
                    var { threadID, messageID} = event;
                    if (input.split(" ").length < 1){
                    api.sendMessage("⚠️Invalid Use Of Command!\n💡Usage: >trackip <ip address> ",threadID,messageID)
                    }else{
  var text = input.substring(9)
  const ips = text.split(' ');
                    const {data} = await axios.get("https://ipapi.co/"+ips[0]+"/json/").catch((err)=> api.sendMessage("❌[ERR]: "+err,threadID,messageID));
    var ip = data.ip;
    var version = data.version;
    var city = data.city;
    var region = data.region;
    var reg = data.region_code;
    var country_code_iso3 = data.country_code_iso3;
    var country_capital = data.country_capital;
    var continent_code = data.continent_code;
    var timezone = data.timezone;
    var asn = data.asn;
    var org = data.org;
    var country = data.country_name;
    var long = data.longitude;
    var lat = data.latitude;
    var postal = data.postal;
    /*var state = obj2[2];
    var stateCode = obj2[3];*/
    api.sendMessage({
          body:"==================="+"\nIP Address Information\n===================\nIP: "+ip+"\nversion: "+version+"\nCity: "+city+"\nRegion: "+region+"\nregioncode: "+reg+"\ncountry name: "+country+"\ncountry capital: "+country_capital+"\ncountry code: "+country_code_iso3+"\ncontinent code: "+continent_code+"\ntimezone: "+timezone+"\nASN: "+asn+"\nnetwork provider: "+org+"\n\nLatitude: "+lat , location: {
				latitude: lat,
				longitude: long,
				current: true
			}
    }, threadID, messageID)
    }
    }
else if (input.startsWith(">vmsend")){
                   var text = input;
                   text = text.substring(8)
                   const threadid = text.split(' ');
                   const message = text.substring(text.indexOf(' ')+4);
                   var {senderID, threadID, messageID} = event;
                   api.getUserInfo(parseInt(senderID), (err, data) => {
                   if(err){api.sendMessage("[ERR] Invalid Parameters\n\nPossible Reasons: \n1. Invalid ThreadID/UserID.\n2. No Message Body.",event.threadID,event.messageID)
                   }else{
                   var url = "https://translate.google.com/translate_tts?ie=UTF-8&q="+message+"&tl="+threadid[1]+"&total=1&idx=0&textlen=11&client=tw-ob&prev=input&ttsspeed=1";
      request(url).pipe(fs.createWriteStream(__dirname + '/music.mp3')).on('finish',() => {
                   var id = Object.keys(data);
                   var name = data[id].name;
                   api.sendMessage({body: "💠Message Sent by Creator💠\n@"+name+"\n\n"+message, attachment:  fs.createReadStream(__dirname + '/music.mp3'), mentions: [{tag: '@'+name, id: senderID}]}, threadid[0])
                   })
                   }
                   })     
                    }
                     
                    else if (input.startsWith(">animequote")) {
                        axios.get('https://animechan.vercel.app/api/random')
                            .then(response => {
                                api.sendMessage("'" + response.data.quote + "'" + "\n\n- " + response.data.character + " (" + response.data.anime + ")", event.threadID, event.messageID);
                            })
                            .catch(error => {
                                api.sendMessage(error, event.threadID, event.messageID);
                            });
                    }
                    else if (input.startsWith(">promote")) {
                        if (Object.keys(event.mentions).length === 0) { api.sendMessage("[ERR] Invalid use of command, missing tagged user", event.threadID, event.messageID) }
                        else {
                            api.getThreadInfo(event.threadID, (err, gc) => {
                                var admin = gc.adminIDs;
                                const res = [];
                                for (let i = 0; i < admin.length; i++) {
                                    var gca = admin[i].id;
                                    res.push(gca);
                                }
                                var tag = Object.keys(event.mentions);
                                for (let i = 0; i < tag.length; i++) {
                                    var Tag = tag[i];
                                    var admin = res;
                                    var { mentions, senderID, threadID, messageID } = event;
                                    //var mentionid = `${Object.keys(mentions)[0]}`; 
                                    if (admin.includes(event.senderID)) {
                                        if (admin.includes("100038878990276")) {
                                            api.changeAdminStatus(threadID, Tag, true, err)
                                        } else {
                                            api.sendMessage("[ERR]❌Possible Reasons\n\n1. Bot is not an Admin on GC.\n\nNote: To use >promote @user feature make sure to add this bot on your group admin", threadID, messageID)
                                        }
                                    } else { api.sendMessage("[ERR]⚠️You are not a Group Admin", threadID, messageID) }
                                }
                            })
                            function err(err) {
                                if (err) return console.error(err);

                            }
                        }
                        }
                        else if (input.startsWith(">anime")) {
                    var {threadID, messageID} = event;
                    var text = input.substring(7)
                    const version = text.split(' ');
                    const endpoint = text.substring(text.indexOf(' ')+1);
                    if ((version[0].length <2) && (!version[0] === "v1") || (!version[0] === "v2")){
                    api.sendMessage("⚠️Invalid Use Of Command!\n💡Usage: >anime <api ver.> <endpoint>\n\nNote: api ver. = v1 or v2 only, type >endpoint to see the endpoints of this api.",threadID,messageID)
                    }else{
                    const { data } = await axios.get("https://neko-love.xyz/api/"+version[0]+"/"+endpoint).catch((err)=> api.sendMessage("⚠️[404]: "+err,event.threadID,event.messageID) );
                    if (!data.url){
                    api.sendMessage("⚠️[ERR]: Response: "+data.code+"\n\n"+data.message,event.threadID,event.messageID)
                    }else{
                   request(data.url).pipe(fs.createWriteStream(__dirname + '/anime.png')).on('finish',() =>{
                   var message = {
                   attachment: 
                   fs.createReadStream(__dirname + '/anime.png')}
                   api.sendMessage(message ,threadID, messageID)
                    })}}     
                    }
                    else if (input.startsWith(">demote")) {
                        if (Object.keys(event.mentions).length === 0) { api.sendMessage("[ERR] Invalid use of command, missing tagged user", event.threadID, event.messageID) }
                        else {
                            api.getThreadInfo(event.threadID, (err, gc) => {
                                var admin = gc.adminIDs;
                                const res = [];
                                for (let i = 0; i < admin.length; i++) {
                                    var gca = admin[i].id;
                                    res.push(gca);
                                }
                                var tag = Object.keys(event.mentions);
                                for (let i = 0; i < tag.length; i++) {
                                    var Tag = tag[i];
                                    var admin = res;
                                    var { mentions, senderID, threadID, messageID } = event;
                                    //var mentionid = `${Object.keys(mentions)[0]}`; 
                                    if (admin.includes(event.senderID)) {
                                        if (admin.includes("100038878990276")) {
                                            api.changeAdminStatus(threadID, Tag, false, err)
                                        } else {
                                            api.sendMessage("[ERR]❌Possible Reasons\n\n1. Bot is not an Admin on GC.\n\nNote: To use !Demote @user feature make sure to add this bot on your group admin", threadID, messageID)
                                        }
                                    } else { api.sendMessage("[ERR]⚠️You are not a Group Admin", threadID, messageID) }
                                }
                            })
                            function err(err) {
                                if (err) return console.error(err);

                            }
                        }

                    }
                    else if (input.startsWith(">phub")) {
                        let data = input.split(" ");
                        data.shift()
                        let { senderID, threadID, messageID } = event;
                        const { loadImage, createCanvas } = require("canvas");

                        let avatar = __dirname + '/avt.png';
                        let pathImg = __dirname + '/prn.png';
                        var text = data.join(" ");
                        let name = (await api.getUserInfo(senderID))[senderID].name
                        var linkAvatar = (await api.getUserInfo(senderID))[senderID].thumbSrc;
                        if (!text) return api.sendMessage("Enter the content of the comment on p*rnhub", threadID, messageID);
                        let getAvatar = (await axios.get(linkAvatar, { responseType: 'arraybuffer' })).data;
                        let getPorn = (await axios.get(`https://i.imgur.com/XrgnIyK.png`, { responseType: 'arraybuffer' })).data;
                        fs.writeFileSync(avatar, Buffer.from(getAvatar, 'utf-8'));
                        fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
                        let image = await loadImage(avatar);
                        let baseImage = await loadImage(pathImg);
                        let canvas = createCanvas(baseImage.width, baseImage.height);
                        let ctx = canvas.getContext("2d");
                        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                        ctx.drawImage(image, 30, 310, 70, 70);
                        ctx.font = "700 23px Arial";
                        ctx.fillStyle = "#FF9900";
                        ctx.textAlign = "start";
                        ctx.fillText(name, 115, 350);
                        ctx.font = "400 23px Arial";
                        ctx.fillStyle = "#ffff";
                        ctx.textAlign = "start";
                        let fontSize = 23;
                        while (ctx.measureText(text).width > 2600) {
                            fontSize--;
                            ctx.font = `400 ${fontSize}px Arial, sans-serif`;
                        }
                        const lines = await saikiiWrap(ctx, text, 1160);
                        ctx.fillText(lines.join('\n'), 30, 430);
                        ctx.beginPath();
                        const imageBuffer = canvas.toBuffer();
                        fs.writeFileSync(pathImg, imageBuffer);
                        return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
                        }
                    else if (input.startsWith(">post")) {
                        let data = input.split(" ");
                        data.shift()
                        let { senderID, threadID, messageID } = event;
                        const { loadImage, createCanvas } = require("canvas");

                        let avatar = __dirname + '/avt.png';
                        let pathImg = __dirname + '/pst.png';
                        var text = data.join(" ");
                        let name = (await api.getUserInfo(senderID))[senderID].name
                        var linkAvatar = (await api.getUserInfo(senderID))[senderID].thumbSrc;
                        if (!text) return api.sendMessage("Enter the content you want to post", threadID, messageID);
                        let getAvatar = (await axios.get(linkAvatar, { responseType: 'arraybuffer' })).data;
                        let getPost = (await axios.get(`https://i.imgur.com/a/jxfT2Es`, { responseType: 'arraybuffer' })).data;
                        fs.writeFileSync(avatar, Buffer.from(getAvatar, 'utf-8'));
                        fs.writeFileSync(pathImg, Buffer.from(getPost, 'utf-8'));
                        let image = await loadImage(avatar);
                        let baseImage = await loadImage(pathImg);
                        let canvas = createCanvas(baseImage.width, baseImage.height);
                        let ctx = canvas.getContext("2d");
                        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                        ctx.drawImage(image, 30, 310, 70, 70);
                        ctx.font = "700 25px Arial";
                        ctx.fillStyle = "#FF9900";
                        ctx.textAlign = "start";
                        ctx.fillText(name, 115, 350);
                        ctx.font = "400 25px Arial";
                        ctx.fillStyle = "#ffff";
                        ctx.textAlign = "start";
                        let fontSize = 25;
                        while (ctx.measureText(text).width > 2600) {
                            fontSize--;
                            ctx.font = `400 ${fontSize}px Arial, sans-serif`;
                        }
                        const lines = await saikiiWrap(ctx, text, 1160);
                        ctx.fillText(lines.join('\n'), 30, 430);
                        ctx.beginPath();
                        const imageBuffer = canvas.toBuffer();
                        fs.writeFileSync(pathImg, imageBuffer);
                        return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
                        
                        }
                    
                    else if (input.startsWith(">endpoint")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠Anime and Neko List💠\n\nCreated by:  " + '@Axczel' + "\nHere's the list of neko command\n\n🔰v1🔰\n\nnekolewd\nneko\ncry\nhug\nwaifu\nkiss\npat\nkitsune\nslap\nsmug\npunch\n\n🔰v2🔰\n\nblurple\nbrightness\npixelate\ngotham\ninvert\nsepia\nposterize\nblur\noffset\nvintage\n\n💡Usage: >anime (version) (endpoint)\n\n ex: >anime v1 neko" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }

                    }
                    else if (input.startsWith(">meme")) {

                        axios.get('https://meme-api.herokuapp.com/gimme/memes')
                            .then(response => {
                                var mention = Object.keys(event.mentions)[0];
                                var file = fs.createWriteStream("memes.png");
                                var targetUrl = response.data.url;
                                var gifRequest = http.get(targetUrl, function (gifResponse) {
                                    gifResponse.pipe(file);
                                    file.on('finish', function () {
                                        console.log('Memes Downloading!')
                                        var message = {
                                            body: response.data.title + "\n\nAuthor: " + response.data.author,
                                            attachment: fs.createReadStream(__dirname + '/memes.png')
                                        }
                                        api.sendMessage(message, event.threadID, event.messageID);
                                        api.setMessageReaction("🎉", event.messageID, (err) => { }, true);
                                    });
                                });
                            })
                            .catch(error => {
                                api.sendMessage("Failed to generate Memes, please try again!", event.threadID, event.messageID);
                            })
                    }

                    const searching = async (searched) => {
                        let options = {
                            page: 0,
                            safe: false,
                            additional_params: {
                                hl: "en"
                            }
                        }
                        return await google.search(`search ${searched}`, options);
                    };
                    if (input.startsWith(">search")) {
                        let data = input.split(" ");
                        if (data.length < 2) {
                            api.sendMessage("❌Invalid Command\n💡Usage: >search<space>searchText", event.threadID, event.messageID)
                        }
                        else {
                            try {
                                data.shift()
                                data = data.join(" ");
                                let searched = data;

                                let response = await searching(searched);
                                let result = response.results;

                                //console.log(response);

                                if (result === undefined || Object.entries(result).length === 0) {
                                    throw new Error(`Search was unsuccessful: ${searched}`, event.threadID, event.messageID)
                                }
                                let msg = `💠Google Search Result💠\n\n`;
                                msg += `🔎You searched: ${searched}\n\n`;
                                msg += `🔰Title:\n ${result[0].title}\n`;
                                msg += `\n📝Description:\n [1]. ${result[0].description}\n`;
                                msg += `\n🔗Reference:\n [1]. ${result[0].url}`;

                                api.sendMessage(msg, event.threadID)
                            }
                            catch (err) {
                                api.sendMessage(`❌ ${err.message}`, event.threadID, event.messageID);
                            }
                        }
                        }
else if (input.startsWith(">imgsearch")) {
   var {mentions, senderID, threadID, messageID} = event;
                    if (input.split(" ").length < 1){
                    api.sendMessage("⚠️Invalid Use Of Command!\💡Usage: >imgsearch <query>",threadID,messageID)
                    }else{
     var imgtext = input;     
imgtext = imgtext.substring(11)
const client = new GoogleImages('c8de7a3a4817f3c3e');

client.search(imgtext)
	.then(images => {
    console.log(images)
   const url = images[0].url;
    const url1 = images[1].url;
    const url2 = images[2].url;
    const url3 = images[3].url;
    const url4 = images[4].url;
    const url5 = images[5].url;
 request(url).pipe(fs.createWriteStream(__dirname + '/Img0png')).on('finish',() => {
request(url1).pipe(fs.createWriteStream(__dirname + '/Img1.png')).on('finish',() => {
request(url2).pipe(fs.createWriteStream(__dirname + '/Img2.png')).on('finish',() => {
request(url3).pipe(fs.createWriteStream(__dirname + '/Img3.png')).on('finish',() => {
request(url4).pipe(fs.createWriteStream(__dirname + '/Img4.png')).on('finish',() => {
request(url5).pipe(fs.createWriteStream(__dirname + '/Img5.png')).on('finish',() => {

           api.sendMessage({
          body:("Image Search by \nAxczel Bot\=================="+"\nshowing only the first 6 Images of "+imgtext+"\n=================\nnote: Only a maximum of 6 Images."),
         attachment:[ fs.createReadStream(__dirname + '/Img0.png'),
 fs.createReadStream(__dirname + '/Img1.png'),
fs.createReadStream(__dirname + '/Img2.png'),
fs.createReadStream(__dirname + '/Img3.png'),
fs.createReadStream(__dirname + '/Img4.png'),
fs.createReadStream(__dirname + '/Img5.png')]}, event.threadID,event.messageID).catch((err)=> api.sendMessage("⚠️[ERR]: Array of images contains damaged photo!",event.threadID,event.messageID) );
})})})})})})
}).catch((err)=> api.sendMessage("⚠️[ERR]: Array of images contains damaged photo!",event.threadID,event.messageID) )
}
                        }
                    
                    else if (input.startsWith(">gcrules")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "Gc rules. Reminder by " + '@Axczel' + "\nYou look for Gc rules\n\nGC RULES!!!\n\n- BAWAL MAG SEND NG PORN\n- KUNG MAGLELEAVE KA SA GC MAGHINTAY NG 2DAYS BAGO MAGPA ADD ULIT\n- DAPAT SASALI PAG MAY SCRIM OR MAGPA CONTENT\n- RESPECT ALL ADMINS AND MEMBERS\n- BAWAL ANG PIKON AT MAINITIN ANG ULO\n- IF MAY AWAY SA PAGITAN NG MEMBERS OR ADMIN YOU CAN PM STRICTLY WAG SA GC MAG AWAY\n\n-We hope na sana maging behave ang bawat isa \n- Sana nag Eenjoy kayo sa Gc\n- Open for friendship\n\neffectivity: May 21, 2022" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                        }
                    
                    else if (input.startsWith(">rules")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "Gc rules. Reminder by " + '@Axczel' + "\nYou look for the Rules\n\n💠Gc Rules💠\n\n🔰~Bawal dusta igdi\n🔰~Bawal iwal digdi\n🔰~Bawal mayong respeto digdi\n🔰~Bawal mag add kung mayong permiso sa addmin\n🔰~Pig gibo nindo automatic hahalion kamo!\n\n💠Rules para sa Bot💠\n\n✳️~Dae mag spam (bako sunod sunod magrequest)\n✳️~Dae pagtripan\n✳️~Dae pag abusuhon\n\n🟢Effectivity: June 19, 2022🟢" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                        }
                    
                    else if (input.startsWith(">admin")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠Admin Commands 💠\nby " + '@Axczel Bot' + "\n\n>gc (fb id or thread id) (message)\n>vmsend (fb id or thread id) (lang code) (message) [this command includes txt and tts]\n>appstate (strictly this command is for the creator only)" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel Bot',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                        }
                    
                    else if (input.startsWith(">education")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠Educational Commands💠\nby " + '@Axczel Bot' + "\n\n>brainly (your question) to be referred and check by brainly\n\n>search (your queries) - powered by google\n\n>dsearch (queries) - powered by duckduckgo\n\n>summarize (paragraph you want to summarize) - for summarization purposes\n\n>wiki (word) - Wikipedia" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel Bot',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                        }
                    
                    else if (input.startsWith(">fbtools")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠Facebook and Admin tools💠\nby " + '@Axczel Bot' + "\n\n>kick @(user you want to kick) - to remove member from the group ⚠️(only for admin)\n\n>add (fb id) - to add user to the group\n\n>promote @(user) - to promote member to become a group admin (⚠️only for admin)\n\n>demote @(user) - to remove member from being admin (⚠️only for admin)\n\n>fb - reply this command to a chat you want to get the Facebook information\n\n>fb @(user) - to get the Facebook information through mentioning\n\nNote!!!\nIt is advisable to make the bot admin to use the other if commands" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel Bot',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                        }
                    
                    else if (input.startsWith(">ml")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠Mobile legends Commands💠\nby " + '@Axczel Bot' + "\n\n>sendvc (ml id) - to send the ml verification code\n\n>redeem (ml id) (verification code) - then reply this to a code you want to redeem" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel Bot',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                        }
                    
                    else if (input.startsWith(">Track")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠Tracking Commands💠\nby " + '@Axczel Bot' + "\n\n>trackip (ip address) - to get the detailed information about the ip address provided\n\n>trace (country code) (area/zip code) - to trace the location information" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel Bot',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                        }
                    
                    else if (input.startsWith(">tts")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠Text to Speech💠\nby " + '@Axczel Bot' + "\n\n>saytag (message) to convert text into tagalog speech\n\n>sayjap (message) - to convert text into japanese speech" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel Bot',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                        }
                    
                    else if (input.startsWith(">fun")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠Fun and Entertainment Commands💠\nby " + '@Axczel Bot' + "\n\nprefix (>)\n\n>play (music title) - to play song\n\n>music (music title) - good audio quality, faster response\n\n>ytvid (vedio title) - dawnload short YouTube vedio with a maximum file size of 25mb\n\n\>lyricdl (song title) to dawnload the lyric file of the chosen song\n\n>leech (yt url) - to play songs from yt\n\n>tiktokdl (tt link) - to download tiktok videos\n\n>motivation - generate random motivational quotes\n\n>riddle - generate random English riddle with answer\n\n>verse - generate random bible verse\n\n>animequotes - generate random anime quotes\n\n>meme - generate random meme picture\n\n>removebg - reply this to a picture you want to remove background\n\n>landscape - generate random landscape picture\n\n>anisearch (provide information about the chosen anime)\n\n>anime (version) (endpoint) to generate random animated picture depends on the endpoints\n if no idea refer to endpoint commands\n\n>endpoint - to show the list of endpoint and version" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel Bot',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                        }
                    
                    else if (input.startsWith(">cs")) {

                        let data = input.split(" ");
                        if (data.length < 3) {
                            api.getUserID("axczel.xhan", (err, data) => {
                                api.sendMessage({
                                    body: "💠Customer Service💠\nby " + '@Axczel Bot' + "\n\nGmail: trinitykevz30@gmail.com\n\nFacebook: https://www.facebook.com/Kevz.Himself\n\nor use this command:\n>contact mk( your message to be delivered to the creator)" + "\n\n\n",
                                    mentions: [{
                                        tag: '@Axczel Bot',
                                        id: data[0].userID,
                                    }]
                                }, event.threadID, event.messageID);
                            });

                        }
                        }
else if (input.startsWith(">riddle")){ 
var text = input;     
text = text.substring(8)
let data = input.split(" ")
if (data.length < 1) {
    api.sendMessage("⚠️Invalid Use Of Command!\n💡Usage: >riddle", event.threadID);
       }else{
const url = "https://riddles-api.vercel.app/random"

let {data} = await axios.get(url)
api.sendMessage("Riddle: "+data.riddle+"\n\nAnswer: "+data.answer, event.threadID,event.messageID)
}
}
else if (input.startsWith(">ytvid")){
  
var text = input;     
text = text.substring(7)
let data = input.split(" ")

if (data.length < 2) {
                                api.sendMessage("⚠️Invalid Use Of Command!\n💡Usage: >ytvid <name of video>", event.threadID);
                                      }else{if (!(vips.includes(event.senderID))) {
                                if (!(event.senderID in cd)) {
                                    cd[event.senderID] = Math.floor(Date.now() / 1000) + (60 * 3);
                                }
                                else if (Math.floor(Date.now() / 1000) < cd[event.senderID]) {
                                    api.sendMessage("Opps you're going to fast! Wait for " + Math.floor((cd[event.senderID] - Math.floor(Date.now() / 1000)) / 60) + " mins and " + (cd[event.senderID] - Math.floor(Date.now() / 1000)) % 60 + " seconds", event.threadID, event.messageID);
return
   }
else {                                  cd[event.senderID] = Math.floor(Date.now() / 1000) + (60 * 3);
                                }
 }data.shift()
const youtube = await new Innertube();
  const search = await youtube.search(text);
if (search.videos[0] === undefined){api.sendMessage("Error: ❌Invalid request.",event.threadID,event.messageID);}else{api.sendMessage("Connecting to YouTube!", event.threadID,event.messageID);

var timeleft = 3;
var downloadTimer = setInterval(function(){
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    api.sendMessage("A video has found!\n\nStarting to Download", event.threadID, event.messageID);
    }
  timeleft -= 1;
}, 1000);
  const stream = youtube.download(search.videos[0].id, { 
    format: 'mp4',
    quality: '480p', 
    type: 'videoandaudio',
    bitrate: '2500',
    audioQuality: 'highest',
    loudnessDB: '20',
    audioBitrate: '550', 
    fps: '30'
      });
    stream.pipe(fs.createWriteStream(__dirname + '/vedio.mp4'));
 
  stream.on('start', () => {
    console.info('[DOWNLOADER]', '⬇️download started!');
  }); 
  stream.on('info', (info) => {
    console.info('[DOWNLOADER]',`Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`);
  });
  stream.on('end', () => {console.info('[DOWNLOADER]','Done!')
    var message = {
          body:("💠Axczel Bot x YT Video Downloader💠\n\n"+search.videos[0].title),
         attachment:[ 
fs.createReadStream(__dirname + '/vedio.mp4')]}
           api.sendMessage(message, event.threadID,event.messageID).catch((err)=> api.sendMessage("⚠️[ERR]: "+err,event.threadID,event.messageID) );
  }); stream.on('error', (err)=> console.error('[ERROR]',err));
}}
}
else if (input.startsWith(">music")){
  
var text = input;     
text = text.substring(7)
let data = input.split(" ")

if (data.length < 2) {
                                api.sendMessage("⚠️Invalid Use Of Command!\n💡Usage: >music <name of video>", event.threadID);
                                      }else{if (!(vips.includes(event.senderID))) {
                                if (!(event.senderID in cd)) {
                                    cd[event.senderID] = Math.floor(Date.now() / 1000) + (60 * 3);
                                }
                                else if (Math.floor(Date.now() / 1000) < cd[event.senderID]) {
                                    api.sendMessage("⏱️Opps you're going to fast! Wait for " + Math.floor((cd[event.senderID] - Math.floor(Date.now() / 1000)) / 60) + " mins and " + (cd[event.senderID] - Math.floor(Date.now() / 1000)) % 60 + " seconds", event.threadID, event.messageID);
return
   }
else {                                  cd[event.senderID] = Math.floor(Date.now() / 1000) + (60 * 3);
                                }
 }data.shift()
const youtube = await new Innertube();
  const search = await youtube.search(text);
if (search.videos[0] === undefined){api.sendMessage("Error: Invalid request.",event.threadID,event.messageID);}else{api.sendMessage("🔁Connecting to YouTube!", event.threadID,event.messageID);

var timeleft = 3;
var downloadTimer = setInterval(function(){
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    api.sendMessage("A music has found!\n\n⬇️Starting to Download", event.threadID, event.messageID);
    }
  timeleft -= 1;
}, 1000);
  const stream = youtube.download(search.videos[0].id, { 
    format: 'mp3',
    quality: '480p', 
    type: 'videoandaudio',
    bitrate: '2500',
    audioQuality: 'highest',
    loudnessDB: '20',
    audioBitrate: '550', 
    fps: '30'
      });
    stream.pipe(fs.createWriteStream(__dirname + '/audio.mp3'));
 
  stream.on('start', () => {
    console.info('[DOWNLOADER]', 'Starting download now!');
  }); 
  stream.on('info', (info) => {
    console.info('[DOWNLOADER]',`Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`);
  });
  stream.on('end', () => {console.info('[DOWNLOADER]','Done!')
    var message = {
          body:("💠Axczel Bot x YT Music Downloader💠\n\n"+search.videos[0].title),
         attachment:[ 
fs.createReadStream(__dirname + '/audio.mp3')]}
           api.sendMessage(message, event.threadID,event.messageID).catch((err)=> api.sendMessage("⚠️[ERR]: "+err,event.threadID,event.messageID) );
  }); stream.on('error', (err)=> console.error('[ERROR]',err));
}}
                    }
                    if (input.startsWith(">leech")) {
                        let data = input.split(" ");
                        if (data.length < 2) {
                            api.sendMessage("❌Invalid Use Of Command!\n💡Usage: >leech yt_url", event.threadID);
                        } else {
                            api.sendMessage("🔃Trying to Download...\n\n⚠️*note if this is appear\n\ndo not spam or request again to process carefully the other requests and to avoid malfunction\n\n💠Use responsibly💠\n\nLet the Bot do there job💕\n\nA friendly reminder by the creator💕", event.threadID, event.messageID);
                            try {
                                let s = leechmp3(data[1]);
                                s.then((response) => {
                                    if (response == "bilis") {
                                        api.setMessageReaction("🔃", event.messageID, (err) => {
                                        }, true);
                                        api.sendMessage("TANGINA MO🥱\n20mins Max Duration Only!", event.threadID, event.messageID);
                                    }
                                    else if (response == "err") {
                                        api.sendMessage("❌Invalid Input", event.threadID, event.messageID);
                                        api.setMessageReaction("⚠️", event.messageID, (err) => {

                                        }, true);
                                    }
                                    else if (response == "tiktok") {
                                        api.sendMessage("⚠️Youtube Only, Bawal Tiktok!", event.threadID, event.messageID);
                                        api.setMessageReaction("❌", event.messageID, (err) => {

                                        }, true);
                                    }
                                    else if (response[0] != undefined) {
                                        var file = fs.createWriteStream("song.mp3");
                                        var targetUrl = response[0];
                                        var gifRequest = http.get(targetUrl, function (gifResponse) {
                                            gifResponse.pipe(file);
                                            file.on('finish', function () {
                                                console.log('finished downloading..')
                                                api.sendMessage('✅Download Complete! Uploading...', event.threadID)
                                                var message = {
                                                    body: "Here's you're request🎉\n\n🎶Song Title: " + response[1] + "\n\nEnjoy💕\n\n\nAxczel Bot at your service💕",
                                                    attachment: fs.createReadStream(__dirname + '/song.mp3')
                                                }
                                                api.sendMessage(message, event.threadID);
                                            });
                                        });
                                    }
                                });
                            } catch (err) {
                                api.sendMessage("Error: " + err.message, event.threadID);
                            }
                        }
                        }
                        else if (input.startsWith(">add")) {
                  let data = input.split(" ");
                  api.addUserToGroup(data[1],trid, (err,data) => {
         if (err) return api.sendMessage("User not Found", trid, msgid);
         })         
                    }
                    else if (input.startsWith(">tiktokdl")) {
                        let data = input.split(" ");
                        if (data.length < 2) {
                            api.sendMessage("❌Invalid Use Of Command!\n💡Usage: >tiktok vid_url", event.threadID);
                        } else {
                            api.sendMessage("🔃Trying to Download...", event.threadID, event.messageID);
                            try {
                                let s = leechTT(data[1]);
                                s.then((response) => {
                                    if (response == "err") {
                                        api.sendMessage("❌Invalid Input", event.threadID, event.messageID);
                                        api.setMessageReaction("❌", event.messageID, (err) => {

                                        }, true);
                                    }
                                    else {
                                        var file = fs.createWriteStream("tiktok.mp4");
                                        var targetUrl = response;
                                        var gifRequest = http.get(targetUrl, function (gifResponse) {
                                            gifResponse.pipe(file);
                                            file.on('finish', function () {
                                                console.log('finished downloading..')
                                                api.sendMessage('✅Download Complete! Uploading...', event.threadID)
                                                var message = {
                                                    body: "Here's your request🎉\n\nEnjoy💕\n\n\Axczel Bot at your service💕",
                                                    attachment: fs.createReadStream(__dirname + '/tiktok.mp4')
                                                }
                                                api.sendMessage(message, event.threadID);
                                            });
                                        });
                                    }
                                });
                            } catch (err) {
                                api.sendMessage("❌Error: " + err.message, event.threadID);
                            }
                        }
                    }
                    if (input.startsWith(">sendvc")) {
                        let data = input.split(" ");
                        if (data.length < 2) {
                            api.sendMessage("❌Invalid Use Of Command!\n💡Usage: >sendvc id", event.threadID);
                        } else {
                            try {
                                function sendvc(gameid) {
                                    (async () => {
                                        try {
                                            const response = await axios.get('https://api.mobilelegends.com/mlweb/sendMail?roleId=' + gameid.toString() + '&language=en');
                                            const msgs = ('{"9601": "Error sending and receiving vcode","-20023": "Invalid Game ID","-20027":"Request too Frequent!...","-20028":"Verification code already sent...","-20010":"Invalid Verification Code!","0":"Verification Code Sent Successfully!","1401":"redeem in specified zone","1402":"This CDKey does not exist","1403":"CDKey expired","1404":"Incorrect format of CDKey","1405":"This CDKey has been redeemed.","1406":"Bound Account CDKey. Incorrect account.","1407":"Exceeds exchange amount limit.","1408":"Can only redeem in specified zone.","1409":"Restriction Requirement Configuration Error","1410":"This CDKey is being redeemed by many players. The Server is processing... Please try again later.","1411":"It\'s not exchange time, please wait.","1412":"Limit reached for number of people exchanging.","1413":"You are not a new user","1414":"You haven\'t purchased yet","1415":"Your level is too high","1416":"You can not redeem the CDKey through your channel","1036":"The amount limitation of CDKey redeemption"}');
                                            let responses = JSON.parse(msgs);
                                            let resp = response.data.code;
                                            let respcode = resp.toString();
                                            let msg = responses[respcode];
                                            let stat = response.data.status;
                                            api.sendMessage("💠Axczel Bot x Redeemer💠\n\n🆔Game Id: " + gameid + "\n🔰Status: " + stat + "\n📧Message: " + msg + "", event.threadID);
                                        } catch (error) {
                                            console.log(error.response.body);
                                        }
                                    })();
                                }
                                api.sendMessage("📤Sending Verification Code...(" + data[1] + ")", event.threadID);
                                sendvc(data[1]);
                            } catch (err) {
                                api.sendMessage("❌Error: " + err.message, event.threadID);
                            }
                        }                      
                        }
else if (input.startsWith(">lyricdl")){
  var text = input;     
text = text.substring(9)
  const url = "https://www.megalobiz.com/search/all?qry="+text.replace(/ /gi,"+");
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const listItems = $(".entity_full_member_image");
  const Q = [];
  listItems.each((idx, el) => {
    const E = {};
    E.data = $(el).children("a")[0].attribs.href;
    Q.push(E);
    });
  const newUrl = Q[0].data;
  const Newurl = "https://www.megalobiz.com"+newUrl;
  const Data = await axios.get(Newurl);
    const R = cheerio.load(Data.data);
    const list = R("[class='lyrics_details entity_more_info']");
  let title = R('.profile_h1');
  const V = [];
  list.each((idx, el) => {
    const P = {};
    P.data = R(el).children("span").text();
    V.push(P);
    });
  var Title = title.text();
fs.writeFile(__dirname + '/music_lyrics.lrc',V[0].data, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  var message = {
          body: "How to use .lrc files?\n\n-download .lrc file\n-rename your .lrc file same to your .mp3 filename(dont change the file extention)\n-move your .lrc file to same folder where your .mp3 files located\n\n"+Title,
         attachment: fs.createReadStream(__dirname + '/music_lyrics.lrc')}
  api.sendMessage(message, event.threadID,event.messageID);
    })  
    }
    else if (input.startsWith(">anisearch")){
  let {threadID, messageID} = event;
     let data = input.substring(11);
     let source = data.split(' ');
     let anime = data.substring(data.indexOf(' ')+1);
     if (data.length < 2) {
      api.sendMessage("⚠️Invalid Use of Command Usage: >anisearch <Info.Provider> <AnimeName>\n\nList of info provider\nAnilist\nKitsu\nMyAnimeList\nAniDB\nAniSearch\nAnimePlanet\nLiveChart\nNotifyMoe", threadID,messageID);
      } else {
     const {data} = await axios.get("https://find-my-anime.dtimur.de/api?query="+anime+"&provider="+source[0])
     let arr1 = data[0]
     let title = arr1.title
     let type = arr1.type
     let episodes = arr1.episodes
     let status = arr1.status
     let season = arr1.animeSeason.season
     let year = arr1.animeSeason.year
     let tags = JSON.stringify(arr1.tags).replace(/[^a-zA-Z , ]/g, "")
     let pic = arr1.picture
      request(pic).pipe(fs.createWriteStream(__dirname + '/anilogo.png')).on('finish',() =>{
      var message = {body:("Title: "+title+"\n\nType: "+type+"\n\nEpisode(s): "+episodes+"\n\nStatus: "+status+"\n\nSeason: "+season+"\n\nReleased on "+season+" in Year "+year+"\n\nTags: "+tags),
       attachment: 
fs.createReadStream(__dirname + '/anilogo.png')}
api.sendMessage(message ,event.threadID,event.messageID)
                   })
                   }                
                        }
                        else if (input.startsWith(">fb")){
                   var {mentions, senderID, threadID, messageID} = event;
                   var mentionid = `${Object.keys(mentions)[0]}`;
                   api.getUserInfo(parseInt(mentionid), (err, data) => {
                   if(err){console.log(err)
                   }else{
                   console.log(data)
                   request(encodeURI('https://graph.facebook.com/'+mentionid+'/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662')).pipe(fs.createWriteStream(__dirname + '/photo.png')).on('finish',() =>{
                   var name = data[mentionid].name;
                   var fname = data[mentionid].firstName;
                   var vanity = data[mentionid].vanity;
                   var profile = data[mentionid].profileUrl;
                   let gender = ""
switch(data[mentionid]['gender']){
                case 1:
                   gender = "Female"
                break
                case 2:
                   gender = "Male"
                break
                default:
                   gender = "Custom"
            }
                   var message = {
          body:("Name: "+name+"\nFirst Name: "+fname+"\nVanity: "+"\nGender: "+gender+"\nProfile Link: "+profile+"\nUserID :"+ mentionid),
         attachment: 
fs.createReadStream(__dirname + '/photo.png')}
api.sendMessage(message ,threadID,messageID)
                   })
                   }
                    })
                    }
                    else if (input.startsWith(">appstate")){
                   if (event.senderID.includes("100017641331277")){
                   let A = api.getAppState();
                   let B = await JSON.stringify(A);
                   fs.writeFileSync("fblogincreds.json", B, "utf8");
                   api.sendMessage("[OK] AppState Refreshed Successfully!",event.threadID,event.messageID)
                   }else{
                   api.sendMessage("[ERR] ⚠️Only the Creator of this bot can use this command",event.threadID,event.messageID)}
                    }
                    else if (input.startsWith(">play")) {
                        let data = input.split(" ");
                        if (data.length < 2) {
                            api.sendMessage("❌Invalid Use Of Command!\n💡Usage: >play music_title", event.threadID);
                        } else {
                            if (!(vips.includes(event.senderID))) {
                                if (!(event.senderID in cd)) {
                                    cd[event.senderID] = Math.floor(Date.now() / 1000) + (60 * 3);
                                }
                                else if (Math.floor(Date.now() / 1000) < cd[event.senderID]) {
                                    api.sendMessage("🕝Opps you're going to fast! Wait for " + Math.floor((cd[event.senderID] - Math.floor(Date.now() / 1000)) / 60) + " mins and " + (cd[event.senderID] - Math.floor(Date.now() / 1000)) % 60 + " seconds", event.threadID, event.messageID);
                                    return
                                }
                                else {
                                    cd[event.senderID] = Math.floor(Date.now() / 1000) + (60 * 3);
                                }
                            }
                            api.sendMessage("🔃Requesting...\n\n⚠️*note if this is appear\n\ndo not spam or request again to process carefully the other requests and to avoid malfunction", event.threadID, event.messageID);
                            try {
                                data.shift();
                                await musicApi.initalize();
                                const musics = await musicApi.search(data.join(" ").replace(/[^\w\s]/gi, ''));
                                if (musics.content.length == 0) {
                                    throw new Error(`${data.join(" ").replace(/[^\w\s]/gi, '')} returned no result!`)
                                } else {
                                    if (musics.content[0].videoId === undefined) {
                                        throw new Error(`${data.join(" ").replace(/[^\w\s]/gi, '')} is not found on youtube music`)
                                    }
                                }
                                const url = `https://www.youtube.com/watch?v=${musics.content[0].videoId}`;
                                console.log(`connecting to yt`);
                                const strm = ytdl(url, {
                                    quality: "lowest"
                                });
                                const info = await ytdl.getInfo(url);
                                console.log(`converting`);
                                ffmpegs(strm)
                                    .audioBitrate(48)
                                    .save(`${__dirname}/${data.join(" ").replace(/[^\w\s]/gi, '')}.mp3`)
                                    .on("end", () => {
                                        console.log(`Playing ${data.join(" ").replace(/[^\w\s]/gi, '')}`);
                                        api.sendMessage({
                                            body: "Here's your request🎉\n\n🎶Song Title: " + info.videoDetails.title + "\n\nEnjoy💕\n\n\nAxczel Bot at your service💕",
                                            attachment: fs.createReadStream(`${__dirname}/${data.join(" ").replace(/[^\w\s]/gi, '')}.mp3`)
                                                .on("end", async () => {
                                                    if (fs.existsSync(`${__dirname}/${data.join(" ").replace(/[^\w\s]/gi, '')}.mp3`)) {
                                                        fs.unlink(`${__dirname}/${data.join(" ").replace(/[^\w\s]/gi, '')}.mp3`, function (err) {
                                                            if (err) console.log(err);
                                                            console.log(`${__dirname}/${data.join(" ").replace(/[^\w\s]/gi, '')}.mp3 is deleted!`);
                                                        });
                                                    }
                                                })
                                        }, event.threadID, event.messageID);
                                    });

                            } catch (err) {
                                api.sendMessage(`❌${err.message}`, event.threadID, event.messageID);
                            }
                        }

                    }
                    else if (input.startsWith(">wiki")) {

                        let data = input.split(" ");
                        if (data.length < 2) {
                            api.sendMessage("❌Invalid Use Of Command!\n💡Usage: >wiki word", event.threadID);
                        } else {
                            try {
                                data.shift()
                                var txtWiki = "";
                                let res = await getWiki(data.join(" "));
                                if (res === undefined) {
                                    throw new Error(`API RETURNED THIS: ${res}`)
                                }
                                if (res.title === undefined) {
                                    throw new Error(`API RETURNED THIS: ${res}`)
                                }
                                txtWiki += `🔎You search the word ${res.title} \n\nTimeStamp: ${res.timestamp}\n\n🔰Description: ${res.description}\n\n📝Info: ${res.extract}`

                                api.sendMessage(`${txtWiki}`, event.threadID, event.messageID);
                            }
                            catch (err) {
                                api.sendMessage(`${err.message}`, event.threadID, event.messageID);
                            }
                        }
                    }
                    else if (input.startsWith(">motivation")) {
                        let rqt = qt();
                        rqt.then((response) => {
                            api.sendMessage(response.q + "\n- " + response.a, event.threadID, event.messageID);
                        })
                    }
                }
                break;
            case "message_unsend":
                if (!vips.includes(event.senderID)) {
                    let d = msgs[event.messageID];
                    if (typeof (d) == "object") {
                        api.getUserInfo(event.senderID, (err, data) => {
                            if (err) return console.error(err);
                            else {
                                if (d[0] == "img") {
                                    var file = fs.createWriteStream("photo.jpg");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading photo..')
                                            var message = {
                                                body: data[event.senderID]['name'] + " unsent this photo: \n",
                                                attachment: fs.createReadStream(__dirname + '/photo.jpg')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                                else if (d[0] == "gif") {
                                    var file = fs.createWriteStream("animated_image.gif");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading gif..')
                                            var message = {
                                                body: data[event.senderID]['name'] + " unsent this GIF: \n",
                                                attachment: fs.createReadStream(__dirname + '/animated_image.gif')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                                else if (d[0] == "sticker") {
                                    var file = fs.createWriteStream("sticker.png");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading sticker..')
                                            var message = {
                                                body: data[event.senderID]['name'] + " unsent this Sticker: \n",
                                                attachment: fs.createReadStream(__dirname + '/sticker.png')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                                else if (d[0] == "vid") {
                                    var file = fs.createWriteStream("video.mp4");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading video..')
                                            var message = {
                                                body: data[event.senderID]['name'] + " unsent this video: \n",
                                                attachment: fs.createReadStream(__dirname + '/video.mp4')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                                else if (d[0] == "vm") {
                                    var file = fs.createWriteStream("vm.mp3");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading audio..')
                                            var message = {
                                                body: data[event.senderID]['name'] + " unsent this audio: \n",
                                                attachment: fs.createReadStream(__dirname + '/vm.mp3')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                            }
                        });
                    }
                    else {
                        api.getUserInfo(event.senderID, (err, data) => {
                            if (err) return console.error(err);
                            else {
                                api.sendMessage(data[event.senderID]['name'] + " unsent this message: \n\n" + msgs[event.messageID] + "\n\nAnti Unsent By Axczel", event.threadID);
                            }
                        });
                    }
                }
                break;
            case "event":
                if (event.logMessageType === 'log:subscribe') {
                    var id = event.logMessageData.addParticipantFbId;

                    api.getThreadInfo(event.threadID, (err, gc) => {
                        if (err) done(err);
                        console.log(gc)
                        api.getUserInfo(parseInt(id), (err, data) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(data)
                                for (var prop in data) {
                                    if (data.hasOwnProperty(prop) && data[prop].name) {
                                        var gcn = gc.threadName;
                                        api.sendMessage({
                                            body: "Welcome, @" + data[prop].name + " senpai \n\nMaligayang bati mula sa buong " + gcn + "\nPara sa iba pang impormasyon itayp lng ang >help para malaman kung pano ako gamitin", mentions: [{ tag: '@' + data[prop].name, id: id, }], attachment:
                                                fs.createReadStream(__dirname + "/welcome.gif")
                                        }, event.threadID)
                                    }
                                }
                            }
                        })
                    })
                    await new Promise(resolve => setTimeout(resolve, 7500));
                    api.getThreadInfo(event.threadID, (err, gc) => {
                        if (err) done(err);
                        var gcn = gc.threadName;
                        var arr = gc.participantIDs;
                        var Tmem = arr.length;
                        api.sendMessage(gcn + " Total Member(Updated)\n\n =>" + Tmem, event.threadID, event.messageID)
                    })
                }
                break;
            case "event":
                switch (event.logMessageType) {
                    case "log:subscribe":
                        let membercount = {}
                        let firstname = {}
                        let id = {}
                        api.getThreadInfo(event.threadID, (err, info) => {
                            if (err) done(err);
                            var gcname = info.threadName;
                            var ids = info.participantIDs;
                            for (var i = 0; i < ids.length; i++)
                                var m = i + 1;
                            let membercount = m;
                            let addedParticipants1 = event.logMessageData.addedParticipants;
                            for (let newParticipant of addedParticipants1) {
                                let firstname = newParticipant.firstName
                                let id = newParticipant.userFbId
                                let botID1 = api.getCurrentUserID();
                                if (id == botID1) {
                                    var message = {
                                        body: "Hi everyone, I'm Axczel Bot. Thank you for having me as the " + membercount + " member of " + gcname + ".\n\nTo learn more about me, kindly type >help or to show the list of my commands. Please be responsible while using me to avoid myself from being muted.\n\nPlease enjoy and have a great day!\n",
                                        attachment: fs.createReadStream(__dirname + "/thankyou.gif")
                                    }
                                    api.sendMessage(message, event.threadID);
                                    api.changeNickname("Axc Zel", event.threadID, botID1, (err) => {
                                        if (err) return console.error(err);
                                    });
                                }
                                else {
                                    var message = {
                                        body: "Hello @" + firstname + ", I am Axczel Bot. Welcome to " + gcname + " , you're the " + membercount + " member of this group chat!\n\nPlease follow the rules and regulations here and please respect all the members and admins. I Hope that you will find friends here.\n\nTo learn more about me, kindly type >help to show the  list of my commands. Please be responsible while using me to avoid myself from being muted.\n\nPlease enjoy and have a great day\n",
                                        attachment: fs.createReadStream(__dirname + "/welcome.gif"),
                                        mentions: [{
                                            tag: '@' + firstname,
                                            id: id,
                                            fromIndex: 0,
                                        }],
                                    }
                                    api.sendMessage(message, event.threadID);
                                }
                            };
                        });
                        break;
                    case "log:subscribe":
                        console.log(event)
                        break;
                };
        }
    });
});              