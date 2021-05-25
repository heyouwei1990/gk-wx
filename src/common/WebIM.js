import config from "./WebIMConfig";
import websdk from "easemob-websdk";
import emedia from "easemob-emedia";
import webrtc from "easemob-webrtc";
import { Toast, Dialog } from "vant";
import Store from '@/store'

function ack(message) {
    var bodyId = message.id; // 需要发送已读回执的消息id
    var msg = new WebIM.message("read", WebIM.conn.getUniqueId());
    msg.set({
        id: bodyId,
        to: message.from
    });
    WebIM.conn.send(msg.body);
}

// 初始化IM SDK
var WebIM = {};
WebIM = window.WebIM = websdk;
WebIM.config = config;
WebIM.conn = new WebIM.connection({
    appKey: WebIM.config.appkey,
    isHttpDNS: WebIM.config.isHttpDNS,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    apiUrl: WebIM.config.apiURL,
    isAutoLogin: true,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    isStropheLog: WebIM.config.isStropheLog,
    delivery: WebIM.config.delivery
});
if (!WebIM.conn.apiUrl) {
    WebIM.conn.apiUrl = WebIM.config.apiURL;
}

// 注册监听回调
WebIM.conn.listen({
    onOpened: function(message) {
        Store.commit('setHxLoginStatus', true);
        console.log('登录环信成功');
        // 连接成功回调
        // 登录或注册成功后 跳转到好友页面
        // const username = Store.state.login.username || localStorage.getItem("userInfo") && JSON.parse(localStorage.getItem("userInfo")).userId;
        // const path = location.pathname.indexOf("login") !== -1 || location.pathname.indexOf("register") !== -1 ? "/contact" : location.pathname;
        // const redirectUrl = `${path}?username=${username}`;
        // Vue.$router.push({ path: redirectUrl });
    },
    onClosed: function(message) {
        // Vue.$router.push({ path: "/login" });
        Store.commit('setHxLoginId', null);
        Store.commit('setHxLoginStatus', false);
        console.log('环信关闭');
    }, // 连接关闭回调
    onTextMessage: function(message) {
        const { from, to, type } = message;
        const chatId = type !== "chat" ? to : from;
        const typeMap = {
            chat: "contact",
            groupchat: "group",
            chatroom: "chatroom"
        };
        Store.commit("updateMsgList", {
            chatType: typeMap[message.type],
            chatId: chatId,
            msg: message.data,
            bySelf: false,
            from: message.from,
            mid: message.id,
            time: Number(message.time),
            ext: message.ext || {},
            type: "text",
        });
        type === 'chat' && ack(message);
        if (WebIM && WebIM.call && message && message.ext && message.ext.msg_extension) {
            var msgExtension = message.ext.msg_extension && JSON.parse(message.ext.msg_extension);
            var options = {
                confrId: message.ext.conferenceId,
                password: message.ext.password || "",
                gid: msgExtension.group_id,
                inviter: msgExtension.inviter
            };
            WebIM.call.listener.onInvite(message.from, options);
        }
    }, // 收到文本消息
    onEmojiMessage: function(message) {
        console.log("onEmojiMessage", message);
        const { type } = message;
        type === 'chat' && ack(message);
    }, // 收到表情消息
    onPictureMessage: function(message) {
        const { from, to, type } = message;
        const chatId = type !== "chat" ? to : from;
        const typeMap = {
            chat: "contact",
            groupchat: "group",
            chatroom: "chatroom"
        };
        Store.commit("updateMsgList", {
            chatType: typeMap[message.type],
            chatId: chatId,
            msg: message.url,
            bySelf: false,
            type: "img",
            time: Number(message.time),
            from: message.from,
        });
        type === 'chat' && ack(message);
    }, // 收到图片消息
    onCmdMessage: function(message) {
        console.log("onCmdMessage", message);
    }, // 收到命令消息
    onAudioMessage: function(message) {
        console.log("onAudioMessage", message);
        const typeMap = {
            chat: "contact",
            groupchat: "group",
            chatroom: "chatroom"
        };
        const chatId = message.type !== "chat" ? message.to : message.from;
        let options = {
            url: message.url,
            headers: { Accept: "audio/mp3" },
            onFileDownloadComplete: function(response) {
                let objectUrl = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
                Store.commit("updateMsgList", {
                    chatType: typeMap[message.type],
                    chatId: chatId,
                    msg: objectUrl,
                    bySelf: false,
                    type: "audio",
                    time: Number(message.time),
                    from: message.from
                });
            },
            onFileDownloadError: function() {
                console.log("音频下载失败");
            }
        };
        WebIM.utils.download.call(WebIM.conn, options);
        message.type === 'chat' && ack(message);
    }, // 收到音频消息
    onLocationMessage: function(message) {
        console.log("onLocationMessage", message);
        message.type === 'chat' && ack(message);
    }, // 收到位置消息
    onFileMessage: function(message) {
        const { from, to, type } = message;
        const chatId = type !== "chat" ? to : from;
        const typeMap = {
            chat: "contact",
            groupchat: "group",
            chatroom: "chatroom"
        };
        Store.commit("updateMsgList", {
            chatType: typeMap[message.type],
            chatId: chatId,
            msg: message.url,
            bySelf: false,
            type: "file",
            filename: message.filename,
            file_length: message.file_length,
            from: message.from,
            time: Number(message.time),
        });
        type === 'chat' && ack(message);
    }, // 收到文件消息
    onVideoMessage: function(message) {
        console.log("onVideoMessage", message);
        const { from, to, type } = message;
        const chatId = type !== "chat" ? to : from;
        const typeMap = {
            chat: "contact",
            groupchat: "group",
            chatroom: "chatroom"
        };
        let options = {
            url: message.url,
            headers: {
                Accept: "audio/mp4"
            },
            onFileDownloadComplete: function(response) {
                console.log(response);
                let objectURL = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
                Store.commit("updateMsgList", {
                    chatType: typeMap[message.type],
                    chatId: chatId,
                    msg: objectURL,
                    bySelf: false,
                    type: "video",
                    filename: message.filename,
                    file_length: message.file_length,
                    from: message.from,
                    time: Number(message.time),
                });
            },
            onFileDownloadError: function() {
                console.log("视频下载失败");
            }
        };
        WebIM.utils.download.call(WebIM.conn, options);
        type === 'chat' && ack(message);
    }, // 收到视频消息
    onPresence: function(message) {
        console.log("onPresence", message);
        let select_id = Store.state.group.groupInfo.gid; // 群组相关操作，更新数据时需要
        switch (message.type) {
            case "subscribe":
                Store.commit("changeFriendRequestState", {
                    isShow: true,
                    ...message
                });
                break;
            case "subscribed":
                Store.dispatch("onGetContactUserList");
                Toast({
                    type: "success",
                    message: message.from + " " + "已订阅"
                });
                break;
            case "unsubscribed":
                Store.dispatch("onGetContactUserList");
                // TODO
                if ("code" in message) {
                    alert(message.from + " " + "请求被拒绝");
                } else {
                    Toast({
                        type: "success",
                        message: message.from + " " + "已退订"
                    });
                }
                break;

            case "direct_joined": // 被拉进群--不需要同意
                Store.dispatch("onGetGroupUserList")
                Toast({
                    type: "success",
                    message: `${message.from}邀请您加入群：${message.gid}`
                })
                break;
            case "invite": //收到邀请进群的通知
                Store.commit("updateGroupInviteNotifications", {
                    isShow: true,
                    ...message
                });
                break;
            case "joinGroupNotifications": // 收到申请进群的通知
                Store.commit("updateGroupNotifications", {
                    isShow: true,
                    ...message
                });
                break;
            case "memberJoinPublicGroupSuccess": // 成员加入聊天室成功回调
                Store.dispatch("onGetGroupinfo", { select_id });
                Toast({
                    type: "success",
                    message: `${message.from}已加入群组`
                })
                break;
            case "joinPublicGroupSuccess": //申请加入群组成功回调
                Store.dispatch("onGetGroupUserList");
                break;
            case "deleteGroupChat": // 解散群组
                Store.dispatch("onGetGroupUserList")
                Toast({
                    type: "fail",
                    message: `${message.from}将群：${message.gid} 已解散`
                })
                break
            case "removedFromGroup": //移除
                Store.dispatch("onGetGroupUserList")
                Toast({
                    type: "success",
                    message: "已被" + message.from + "移除群：" + message.gid
                })
                break;
            case "leaveGroup":
                Store.dispatch("onGetGroupinfo", { select_id });
        }
    }, // 处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
    onRoster: function(message) {
        console.log("好友申请", message);
    }, // 处理好友申请
    onInviteMessage: function(message) {
        console.log("群邀请", message);
    }, // 处理群组邀请
    onOnline: function() {
        Store.commit('setHxLoginStatus', true);
        console.log("onOnline 网络已连接");
    }, // 本机网络连接成功
    onOffline: function() {
        Store.commit('setHxLoginStatus', false);
        console.log("onOffline 网络已断开");
    }, // 本机网络掉线
    onError: function(message) {
        Store.commit('setHxLoginStatus', false);
        Store.commit('setHxLoginId', null);
        if (message.type == 0) {
            console.log('请输入账号密码')
        } else if (message.type == 28) {
            console.log("未登陆")
        } else if (message.data.data && JSON.parse(message.data.data).error_description == "user not found") {
            Toast.fail("环信用户名不存在！")
        } else if (message.data.data && JSON.parse(message.data.data).error_description == "invalid password") {
            console.log('环信密码无效！')
        } else if (message.data.data && JSON.parse(message.data.data).error_description == "user not activated") {
            Toast.fail("环信用户已被封禁！")
        } else if (message.type == "504") {
            Toast("消息撤回失败");
        }
        // 报错返回到登录页面
        // Vue.$router.push({ path: '/login' });
    }, // 失败回调
    onRecallMessage: message => {
        message.status = "recall";
        message.msg = "对方撤回了一条消息";
        Store.commit("updateMessageStatus", message);
    }, //撤回消息
    onBlacklistUpdate: function(list) { // 黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        // 更新好友黑名单
        let blackList = list;
        Store.commit("updateBlackList", blackList);
    }, //黑名单变动
    onReceivedMessage: function(message) {
        // console.log("onReceivedMessage", message);
        Store.commit("updateMessageMid", message);
        message.status = "sent";
        Store.commit("updateMessageStatus", message);
    }, // 收到消息送达服务器回执

    onDeliveredMessage: function(message) {
        // console.log("onDeliveredMessage", message);
        Store.commit('updateMessageStatus', message)
    }, // 收到消息送达客户端回执

    onReadMessage: function(message) {
        console.log("onReadMessage", message);
        message.status = "read";
        Store.commit("updateMessageStatus", message);
    }, // 收到消息已读回执

    onCreateGroup: function(message) {
        console.log("onCreateGroup", message);
        Store.dispatch("onGetGroupUserList");
    }, // 创建群组成功回执（需调用createGroupNew）
    onMutedMessage: function(message) {
            console.log("onMutedMessage", message);
        } // 如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});
WebIM.Emoji = {
    map: {
        '[):]': 'ee_1.png',
        '[:D]': 'ee_2.png',
        '[;)]': 'ee_3.png',
        '[:-o]': 'ee_4.png',
        '[:p]': 'ee_5.png',
        '[(H)]': 'ee_6.png',
        '[:@]': 'ee_7.png',
        '[:s]': 'ee_8.png',
        '[:$]': 'ee_9.png',
        '[:(]': 'ee_10.png',
        '[:\'(]': 'ee_11.png',
        '[:|]': 'ee_12.png',
        '[(a)]': 'ee_13.png',
        '[8o|]': 'ee_14.png',
        '[|]': 'ee_15.png',
        '[+o(]': 'ee_16.png',
        '[<o)]': 'ee_17.png',
        '[|-)]': 'ee_18.png',
        '[*-)]': 'ee_19.png',
        '[:-#]': 'ee_20.png',
        '[:-*]': 'ee_21.png',
        '[^o)]': 'ee_22.png',
        '[8-)]': 'ee_23.png',
        '[(|)]': 'ee_24.png',
        '[(u)]': 'ee_25.png',
        '[(S)]': 'ee_26.png',
        '[(*)]': 'ee_27.png',
        '[(#)]': 'ee_28.png',
        '[(R)]': 'ee_29.png',
        '[({)]': 'ee_30.png',
        '[(})]': 'ee_31.png',
        '[(k)]': 'ee_32.png',
        '[(F)]': 'ee_33.png',
        '[(W)]': 'ee_34.png',
        '[(D)]': 'ee_35.png'
    },
    get imgs() {
        let arr = [];
        Object.keys(this.map).map((item, index) => {
            arr.push({ path: require('@/assets/faces/ee_' + (index + 1) + '.png') })
        })
        return arr;
    }
}
WebIM.WebRTC = webrtc;
WebIM.EMedia = emedia;
export default WebIM;