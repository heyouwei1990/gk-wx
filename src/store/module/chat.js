import WebIM from '@/common/WebIM.js';
import _ from 'lodash'
// const _ = window._;
import Vue from 'vue'
import { extend, GetStorage, SetStorage, RemoveStorage } from '@/common/util.js'
import { GetUserSingleChats, GetUserImInfo, AddIMMessage, GetJointGroups } from '@/common/api.js'
// TODO 处理页面刷新无法获取到音频url
const res = function(response) {
    let objectUrl = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
    return objectUrl; //  'blob:http://localhost:8080/536070e2-b3a0-444a-b1cc-f0723cf95588'
};

function test(url, func) {
    let options = {
        url: url,
        headers: { Accept: "audio/mp3" },
        onFileDownloadComplete: func,
        onFileDownloadError: function() {
            console.log("音频下载失败");
        }
    };
    WebIM.utils.download.call(WebIM.conn, options);
}

const Chat = {
    state: {
        userList: {
            contactUserList: [],
            groupUserList: [],
            chatroomUserList: []
        },
        msgList: {
            contact: {},
            group: {},
            chatroom: {},
        },
        currentMsgs: [],
        singleChatList: [],
    },
    mutations: {
        updateUserList(state, payload) {
            const { userList, type } = payload;
            state.userList[type] = userList;
        },
        updateMsgList(state, payload) {
            const { chatType, chatId, msg, bySelf, type, id } = payload;
            const { query } = Vue.prototype.$page;
            let status = "unread";
            if (payload.chatType == "contact") {
                if (query.chatId == payload.from) {
                    status = "read";
                }
                //单聊赋值成员头像和昵称
                let contactList = state.userList.contactUserList || [];
                for (let i = 0; i < contactList.length; i++) {
                    if (contactList[i].name == payload.from) {
                        payload['DisplayName'] = contactList[i].NickName;
                        payload['PhotoUrl'] = contactList[i].PhotoUrl;
                        payload['UserCode'] = contactList[i].UserCode;
                    }
                }
                let info = this.state.userData;
                if (info && info.ImUserId == payload.from) {
                    payload['DisplayName'] = info.LoginName;
                    payload['PhotoUrl'] = info.HeadImg;
                    payload['UserCode'] = info.UserCode;
                }
            } else if (payload.chatType == "group") {
                if (query.chatId == payload.chatId) {
                    status = "read";
                }
                //群聊赋值群成员头像和昵称
                let members = this.state.group.groupInfo.members || [];
                for (let i = 0; i < members.length; i++) {
                    //登陆者自己
                    if (payload.bySelf == true) {
                        payload['from'] = this.state.hxLoginId;
                    }
                    // console.log(payload.from, members[i].EasemobUserName);
                    if (payload.from == members[i].EasemobUserName) {
                        payload['DisplayName'] = members[i].DisplayName;
                        payload['PhotoUrl'] = members[i].PhotoUrl;
                        payload['UserCode'] = members[i].UserCode;
                        if (payload.from == this.state.hxLoginId) {
                            payload.bySelf = true
                        }
                    }
                }
            }
            if (!state.msgList[chatType][chatId]) {
                state.msgList[chatType][chatId] = [{
                    msg,
                    bySelf,
                    type: type || "",
                    mid: id,
                    status: status,
                    ...payload
                }];
            } else {
                state.msgList[chatType][chatId].push({
                    msg,
                    bySelf,
                    type: type || "",
                    mid: id,
                    status,
                    ...payload
                });
                state.msgList[chatType][chatId] = state.msgList[chatType][chatId].sort((a, b) => {
                    return a.time - b.time;
                });
                // state.msgList[chatType][chatId] = _unique(state.msgList[chatType][chatId])
            }
            if (chatType === "chatroom" && !bySelf) { // 聊天室消息去重处理
                state.currentMsgs = _.uniqBy(state.msgList[chatType][chatId], "mid");
            } else {
                state.currentMsgs = Object.assign([], state.msgList[chatType][query.chatId || chatId]); // 这里params.id在路由跳转的时候会undefind，取chatId兼容
            }
            state.msgList = Object.assign({}, state.msgList);
        },
        updateCurrentMsgList(state, messages) {
            state.currentMsgs = messages;
        },
        updateMessageMid(state, message) {
            const { id, mid } = message;
            const { type } = Vue.prototype.$page.query;
            let name = type || 'group';
            // state.currentMsgs.forEach((item) => {
            //     if(item.mid == id){
            //         item.mid = mid
            //     }
            // })
            Object.keys(state.msgList[name]).forEach((user) => {
                if (state.msgList[name][user].length) {
                    state.msgList[name][user].forEach((msg) => {
                        if (msg.mid == id) {
                            msg.mid = mid;
                        }
                    });
                }
            });
        },
        updateMessageStatus(state, message) {
            const { id, mid, action, readUser } = message;
            const { type } = Vue.prototype.$page.query;
            let name = type || 'group';
            Object.keys(state.msgList[name]).forEach((user) => {
                // console.log(state.msgList[name][user]);
                if (action == "oneUserReadMsgs") {
                    if (state.msgList[name][readUser]) {
                        state.msgList[name][readUser].forEach((msg) => {
                            if (msg.status != "recall") {
                                msg.status = "read";
                            }
                        });
                    }
                } else if (state.msgList[name][user].length) {
                    state.msgList[name][user].forEach((msg) => {
                        if (action === "readMsgs" && !msg.bySelf) {
                            if (msg.status != "recall") {
                                msg.status = "read";
                            }
                        } else if (msg.mid == id || msg.mid == mid) {
                            msg.status = message.status;
                            if (message.msg) {
                                msg.msg = message.msg;
                            }
                        }
                    });
                }
            });
        },
        // 黑名单筛选用户列表
        changeUserList(state, payload) {
            let ary = [];
            _.forIn(payload, function(value, key) {
                ary.push({ name: key });
            });
            state.userList.contactUserList = _.pullAllBy(state.userList.contactUserList, ary, "name");
        },
        setSingleChatList(state, value) {
            state.singleChatList = value || [];
        }
    },
    actions: {
        onGetContactUserList: function(context, payload) {
            try {
                WebIM.conn.getRoster({
                    success: function(roster) {
                        // console.log("roster", roster);
                        const userList = roster.filter(user => ["both", "to"].includes(user.subscription));
                        let singleList = context.state.singleChatList;
                        let arr = [];
                        let nameList = [];
                        //根据返回的单聊列表展示当前单聊
                        for (let j = 0; j < singleList.length; j++) {
                            for (let i = 0; i < userList.length; i++) {
                                if (singleList[j].FriendImName == userList[i].name) {
                                    context.dispatch('getHistoryMessage', {
                                        name: singleList[j].FriendImName,
                                        isGroup: false,
                                        count: 1,
                                    });
                                    nameList.push(userList[i].name);
                                    let obj = {
                                        ...singleList[j],
                                        ...userList[i]
                                    };
                                    arr.push(obj);
                                }
                            }
                        }
                        //获取单聊成员昵称
                        GetUserImInfo({
                            ImUserIds: nameList,
                            platform: 'pcweb'
                        }).then(r => {
                            if (r.Result == 1) {
                                let infoList = r.Data.Lines || [];
                                for (let i = 0; i < arr.length; i++) {
                                    for (let j = 0; j < infoList.length; j++) {
                                        if (arr[i].name == infoList[j].ImUserId) {
                                            extend(arr[i], infoList[j]);
                                        }
                                    }
                                }
                                context.commit("updateUserList", {
                                    userList: arr,
                                    type: "contactUserList",
                                    black: payload
                                });
                            }
                        })
                    }
                });
            } catch (e) {
                console.log("error", e);
            }
        },
        onGetGroupUserList: function(context, payload) {
            var options = {
                success: function(resp) {
                    // GetUserSingleChats({
                    //     PageSize: 999,
                    //     PageNo: 1,
                    //     UserCode: context.rootState.userData.UserCode,
                    // }).then(r => {
                    //     if (r.Result == 1) {
                    //         let list = r.Data.Lines || [];
                    //     }
                    // })
                    let userList = resp.data;
                    userList.forEach((user, index) => {
                        userList[index].name = user.groupname;
                        context.dispatch('getHistoryMessage', {
                            name: user.groupid,
                            isGroup: true,
                            count: 1,
                        })
                    });
                    context.commit("updateUserList", {
                        userList,
                        type: "groupUserList"
                    });
                },
                error: function(e) {},
            };
            WebIM.conn.getGroup(options);
        },
        onGetChatroomUserList: function(context, payload) {
            var option = {
                apiUrl: window.location.protocol + "//a1.easemob.com",
                pagenum: 1, // 页数
                pagesize: 20, // 每页个数
                success: function(list) {
                    context.commit("updateUserList", {
                        userList: list.data,
                        type: "chatroomUserList"
                    });
                },
                error: function() {
                    console.log("List chat room error");
                }
            };
            WebIM.conn.getChatRooms(option);
        },
        // 获取当前聊天对象的记录 @payload： {key, type}
        onGetCurrentChatObjMsg: function(context, payload) {
            const { id, type } = payload;
            context.commit("updateCurrentMsgList", context.state.msgList[type][id]);
        },
        onSendText: function(context, payload) {
            const { chatType, chatId, message } = payload;
            const id = WebIM.conn.getUniqueId();
            const time = +new Date();
            const chatroom = chatType === "chatroom";
            const type = chatType === "contact" ? "singleChat" : "groupChat";
            const msgObj = new WebIM.message("txt", id);
            msgObj.set({
                msg: message,
                to: chatId,
                chatType: type,
                roomType: chatroom,
                success: function() {
                    context.commit("updateMsgList", {
                        chatType,
                        chatId: chatId,
                        msg: message,
                        bySelf: true,
                        time: time,
                        mid: id,
                        status: "sending"
                    });
                    context.dispatch('sendMsgCall', {
                        chatId,
                        chatType
                    });
                },
                fail: function(e) {
                    console.log("Send private text error", e);
                }
            });
            if (chatType === "group" || chatType === "chatroom") {
                msgObj.setGroup("groupchat");
            }
            WebIM.conn.send(msgObj.body);
        },
        sendImgMessage: function(context, payload) {
            const { chatType, chatId, roomType, file, callback } = payload;
            // console.log(chatType);
            const id = WebIM.conn.getUniqueId();
            const msgObj = new WebIM.message("img", id);
            msgObj.set({
                apiUrl: WebIM.config.apiURL,
                file: file,
                to: chatId,
                roomType: roomType,
                onFileUploadError: function(error) {
                    console.log("图片上传失败", error);
                    callback();
                },
                onFileUploadComplete: function(data) {
                    let url = data.uri + "/" + data.entities[0].uuid;
                    // console.log(url);
                    context.commit("updateMsgList", {
                        msg: url,
                        chatType,
                        chatId: chatId,
                        bySelf: true,
                        type: "img",
                        time: data.timestamp,
                        mid: id,
                        status: "sending"
                    });
                    callback();
                },
                success: function() {
                    context.dispatch('sendMsgCall', {
                        chatId,
                        chatType
                    });
                    console.log("图片发送成功");
                }
            });
            if (chatType === "group" || chatType === "chatroom") {
                msgObj.setGroup("groupchat");
            }
            WebIM.conn.send(msgObj.body);
        },
        sendFileMessage: function(context, payload) {
            const { chatType, chatId, roomType, file, callback } = payload;
            const id = WebIM.conn.getUniqueId();
            const msgObj = new WebIM.message("file", id);
            msgObj.set({
                apiUrl: WebIM.config.apiURL,
                file: file,
                ext: {
                    file_length: file.data.size
                },
                to: chatId,
                roomType: roomType,
                onFileUploadError: function(error) {
                    console.log("文件上传失败", error);
                    callback();
                },
                onFileUploadComplete: function(data) {
                    let url = data.uri + "/" + data.entities[0].uuid;
                    context.commit("updateMsgList", {
                        msg: url,
                        chatType,
                        chatId: chatId,
                        bySelf: true,
                        type: "file",
                        filename: file.data.name,
                        file_length: file.data.size,
                        time: data.timestamp,
                        mid: id,
                        status: "sending"
                    });
                    callback();
                },
                success: function() {
                    context.dispatch('sendMsgCall', {
                        chatId,
                        chatType
                    });
                    console.log("文件发送成功");
                }
            });
            if (chatType === "group" || chatType === "chatroom") {
                msgObj.setGroup("groupchat");
            }
            WebIM.conn.send(msgObj.body);
        },
        sendRecorder: function(context, payload) {
            const { useId, type, file } = payload;
            const id = WebIM.conn.getUniqueId();
            const msgObj = new WebIM.message("audio", id);
            let isRoom = type == "chatroom" || type == "groupchat";

            const jid = {
                contact: "name",
                group: "groupid",
                chatroom: "id"
            };

            // console.log('bold>>>', bold);
            // console.log('newBold>>', WebIM.utils.parseDownloadResponse.call(WebIM.conn, bold));
            // let newBold = WebIM.utils.parseDownloadResponse.call(WebIM.conn, bold)
            // var file = WebIM.utils.getFileUrl(input);
            msgObj.set({
                apiUrl: WebIM.config.apiURL,
                file: file,
                to: useId,
                type: "audio",
                roomType: isRoom,

                onFileUploadError: function(error) {
                    console.log("语音上传失败", error);
                },
                onFileUploadComplete: function(data) {
                    console.log("上传成功", data);

                    let url = data.uri + "/" + data.entities[0].uuid;
                    context.commit("updateMsgList", {
                        msg: url,
                        chatType: type,
                        chatId: useId,
                        bySelf: true,
                        type: "audio",
                        filename: file.data.name,
                        // file_length: file.data.size,
                        // time: data.timestamp,
                        mid: id,
                        status: "sending"
                    });
                },
                success: function(data) {
                    context.dispatch('sendMsgCall', {
                        chatId: useId,
                        chatType: type
                    });
                    console.log("语音发送成功", data);
                },
                flashUpload: WebIM.flashUpload
            });

            if (type === "group" || type === "chatroom") {
                msgObj.setGroup("groupchat");
            }
            WebIM.conn.send(msgObj.body);
        },
        onCallVideo: function(context, payload) {
            const { chatType, to } = payload;
            const type = chatType === "contact" ? "singleChat" : "groupChat";
            const hxLoginId = context.rootState.hxLoginId;
            if (chatType === "contact") {
                // this.setState({
                //     showWebRTC: true
                // })
                WebIM.call.caller = hxLoginId;
                WebIM.call.makeVideoCall(to, null, payload.rec, payload.recMerge);
                context.dispatch('sendMsgCall', {
                    chatId: to,
                    chatType
                });
            }
        },
        onCallVoice: function(context, payload) {
            const { chatType, to } = payload;
            const type = chatType === "contact" ? "singleChat" : "groupChat";
            const hxLoginId = context.rootState.hxLoginId;
            if (chatType === "contact") {
                WebIM.call.caller = hxLoginId;
                WebIM.call.makeVoiceCall(to, null, payload.rec, payload.recMerge);
                context.dispatch('sendMsgCall', {
                    chatId: to,
                    chatType
                });
            }
        },
        getHistoryMessage: function(context, payload) {
            const options = {
                queue: payload.name,
                isGroup: payload.isGroup,
                count: payload.count || 10, // 每次获取消息条数
                success: function(msgs) {
                    try {
                        payload.success && payload.success(msgs);
                        if (msgs.length) {
                            let hxLoginId = context.rootState.hxLoginId;
                            msgs.forEach((item) => {
                                let time = Number(item.time);
                                let msg = {};
                                const bySelf = item.from == hxLoginId;
                                //判断消息是否是图片类型
                                let filename = item.filename || '';
                                let isImg = false;
                                let fileExt = filename.indexOf('.') > -1 ? filename.substring(filename.lastIndexOf('.') + 1) : '';
                                let imgExt = 'PNG,JPEG,JPG,GIF,BMP';
                                if (fileExt && imgExt.indexOf(fileExt.toUpperCase()) > -1) {
                                    isImg = true;
                                }
                                if (!filename) {
                                    //文字消息
                                    msg = {
                                        chatType: payload.isGroup ? "group" : "contact",
                                        chatId: bySelf ? item.to : item.from,
                                        from: item.from,
                                        msg: item.data,
                                        bySelf: bySelf,
                                        time: time,
                                        mid: item.id,
                                        status: "read",
                                        type: 'text',
                                        ext: item.ext,
                                    };
                                    if (payload.isGroup) {
                                        msg.chatId = item.to;
                                    } else {
                                        msg.chatId = bySelf ? item.to : item.from;
                                    }
                                } else if (!item.ext.file_length && isImg) {
                                    // 为图片的情况
                                    msg = {
                                        msg: item.url,
                                        chatType: payload.isGroup ? "group" : "contact",
                                        chatId: bySelf ? item.to : item.from,
                                        from: item.from,
                                        bySelf: bySelf,
                                        type: "img",
                                        time: time,
                                        mid: item.id,
                                        status: "read"
                                    };
                                    if (payload.isGroup) {
                                        msg.chatId = item.to;
                                    } else {
                                        msg.chatId = bySelf ? item.to : item.from;
                                    }
                                } else if (filename === "audio") {
                                    //音频消息
                                    msg = {
                                        msg: item.url,
                                        chatType: payload.isGroup ? "group" : "contact",
                                        chatId: bySelf ? item.to : item.from,
                                        from: item.from,
                                        bySelf: bySelf,
                                        time: time,
                                        mid: item.id,
                                        type: "audio"
                                    };
                                    if (payload.isGroup) {
                                        msg.chatId = item.to;
                                    } else {
                                        msg.chatId = bySelf ? item.to : item.from;
                                    }
                                } else if (filename.substring(item.filename.length - 3) === "mp4") {
                                    //视频消息
                                    msg = {
                                        msg: item.url,
                                        chatType: payload.isGroup ? "group" : "contact",
                                        chatId: bySelf ? item.to : item.from,
                                        from: item.from,
                                        bySelf: bySelf,
                                        time: time,
                                        mid: item.id,
                                        type: "video"
                                    };
                                    if (payload.isGroup) {
                                        msg.chatId = item.to;
                                    } else {
                                        msg.chatId = bySelf ? item.to : item.from;
                                    }
                                } else {
                                    //文件消息
                                    msg = {
                                        msg: item.url,
                                        chatType: payload.isGroup ? "group" : "contact",
                                        chatId: bySelf ? item.to : item.from,
                                        from: item.from,
                                        bySelf: bySelf,
                                        type: "file",
                                        filename: item.filename,
                                        file_length: item.file_length,
                                        time: time,
                                        mid: item.id,
                                        status: "read"
                                    };
                                    if (payload.isGroup) {
                                        msg.chatId = item.to;
                                    } else {
                                        msg.chatId = bySelf ? item.to : item.from;
                                    }
                                }
                                msg.isHistory = true;
                                context.commit("updateMsgList", msg);
                            });
                            context.commit("updateMessageStatus", { action: "readMsgs" });
                        }
                    } catch (e) {
                        console.log("error", e);
                    }
                },
                fail: function() {}
            };
            WebIM.conn.fetchHistoryMessages(options);
        },
        recallMessage: function(context, payload) {
            const { chatType, mid } = payload.message;
            const to = payload.to;
            const me = this;
            const chatTypeObj = {
                contact: "chat",
                group: "groupchat",
                chatroom: "chatroom"
            };
            const option = {
                mid,
                to,
                type: chatTypeObj[chatType],
                success: function() {
                    payload.message.status = "recall";
                    payload.message.msg = "消息已撤回";
                    context.commit("updateMessageStatus", payload.message);
                },
                fail: function() {
                    // me.$message('消息撤回失败');
                },
            };
            WebIM.conn.recallMessage(option);
        },
        sendMsgCall: function(context, payload) {
            //投标成功，发单方发送消息之后，接单方才能聊天
            if (payload.chatType != "contact") {
                return;
            }
            let target = payload.chatId.substring(payload.chatId.lastIndexOf('-') + 1);
            let userCode = this.state.userData.UserCode;
            AddIMMessage({
                platform: 'pcweb',
                JobID: 0,
                IsPrivateChat: true,
                FromUserCode: userCode,
                ToUserCode: target,
            })
        },
        getSingleList(context, payload) {
            let userCode = this.state.userData.UserCode;
            GetUserSingleChats({
                PageSize: 999,
                PageNo: 1,
                UserCode: userCode
            }).then(r => {
                console.log(2);
                if (r.Result == 1) {
                    let list = [];
                    list = list.concat(r.Data.Lines, r.Data.FriendsLines);
                    context.commit('setSingleChatList', list);
                    if (this.state.hxIsLogin) {
                        context.dispatch('onGetContactUserList');
                    }
                }
            })
        },
    },
    getters: {
        onGetContactUserList(state) {
            return state.userList.contactUserList;
        },
        onGetGroupUserList(state) {
            return state.userList.groupUserList;
        },
        onGetChatroomUserList(state) {
            return state.userList.chatroomUserList;
        },
        onGetCurrentChatObjMsg(state) {
            if (state.currentMsgs instanceof Array) {
                //去重
                // let arr = _.uniqBy(state.currentMsgs, 'mid');
                // return _.sortBy(arr, function(item) {
                //     return item.time;
                // });
                return _.uniqBy(state.currentMsgs, 'mid') || [];
            } else {
                // let arr = state.currentMsgs;
                // return _.sortBy(arr, function(item) {
                //     return item.time;
                // });
                return state.currentMsgs || [];
            }
            // return state.currentMsgs;
        },
        fetchHistoryMessages(state) {
            return state.currentMsgs;
        }
    }

};
export default Chat;