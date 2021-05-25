import WebIM from '@/common/WebIM.js';
const mutationsTypes = {
    GET_GROUPMEMBERS: "GET_GROUPMEMBERS",
    SHOW_MULTIANMODAL: "SHOW_MULTIANMODAL",
    HIDE_MULTIANMODAL: "HIDE_MULTIANMODAL",
    SET_CONFR: "SET_CONFR",
    SET_AVMEMBERMODAL_VISIBLE: "SET_AVMEMBERMODAL_VISIBLE"
};
const Emedia = {
    state: {
        groupMembers: [],
        multiAVModalVisible: false,
        confr: {},
        addAVMemberModalVisible: false,
    },
    mutations: {
        [mutationsTypes.GET_GROUPMEMBERS](state, payload) {
            let list = payload.groupMembers;
            let members = this.state.group.groupInfo.members || [];
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < members.length; j++) {
                    let name = list[i].member || list[i].owner;
                    let member = members[j].member || members[j].owner;
                    if (name == member) {
                        Object.assign(list[i], members[j]);
                    }
                }
            }
            state.groupMembers = list;
        },
        [mutationsTypes.SHOW_MULTIANMODAL](state) {
            state.multiAVModalVisible = true;
        },
        [mutationsTypes.HIDE_MULTIANMODAL](state) {
            state.multiAVModalVisible = false;
        },
        [mutationsTypes.SET_CONFR](state, payload) {
            state.confr = payload.confr;
        },
        [mutationsTypes.SET_AVMEMBERMODAL_VISIBLE](state, payload) {
            state.addAVMemberModalVisible = payload.addAVMemberModalVisible;
        },
    },
    actions: {
        getGroupMembers(context, payload) {
            var pageNum = 1,
                pageSize = 1000;
            var options = {
                pageNum: pageNum,
                pageSize: pageSize,
                groupId: payload,
                success: function(resp) {
                    let list = resp.data || [];
                    context.commit({
                        type: mutationsTypes.GET_GROUPMEMBERS,
                        groupMembers: list
                    });

                },
                error: function(e) {
                    console.log("error", e);
                }
            };
            WebIM.conn.listGroupMember(options);
        },
        showMultiAVModal(context) {
            context.commit(mutationsTypes.SHOW_MULTIANMODAL);
        },
        hideMultiAVModal(context) {
            context.commit(mutationsTypes.HIDE_MULTIANMODAL);
        },
        setConfr(context, payload) {
            context.commit({
                type: mutationsTypes.SET_CONFR,
                confr: payload.confr
            });
        },
        setAVMemeberModalVisible(context, payload) {
            context.commit({
                type: mutationsTypes.SET_AVMEMBERMODAL_VISIBLE,
                addAVMemberModalVisible: payload.addAVMemberModalVisible
            });
        },
    },
    // getters: {

    // }
};

export default Emedia;