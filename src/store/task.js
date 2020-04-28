import request, { BaseURL } from "../utils/request";

export class Task {
  constructor(item) {
    Object.assign(this, item);

    this.remaining = parseInt((this.useup / this.total) * 100);
    this.remainingStyle = `width:${this.remaining}%`;
    this.remain = this.total - this.useup;

    this.earnPoint = (parseInt(this.level) + 1) * 2;
    // this.levelObj = User.levelDef.find(a => a.id == this.level);

    this.isFull = this.useup == this.total;
    // this.stages.forEach(a=>a.urls.forEach(u=>u.url))
  }

  // remaining {
  //   return parseInt((this.useup / this.total) * 100);
  // }
}

export default {
  namespaced: true,
  state: {
    tasks: [],
    // categories: User.levelDef,
    currentCategory: ''
  },
  mutations: {
    updateState(state, { payload }) {
      Object.assign(state, payload);
    },
    newTaskSuccess(state, { payload }) {
      state.tasks.splice(0, 0, new Task(payload));
    }
  },
  actions: {
    async init({ commit, state }, payload) {
      const params = { $sortdesc: "created", grab: false };
      if (payload) {
        // Object.assign(params, payload);
        params.level = payload.level;
        params.$limit = payload.pageSize;
        params.$skip = (payload.current - 1) * payload.pageSize;
      }
      const { data: tasksResult } = await request.get("api/tasks", { params });

      const tasks = !payload.isNewCategory ? [...state.tasks, ...tasksResult.map(t => new Task(t))] : tasksResult.map(t => new Task(t));
      commit({ type: "updateState", payload: { tasks } });

      return tasksResult.length;
    },
    async newTask({ commit }, payload) {
      payload.useup = 0;
      payload.registration = [];
      // payload.stages = payload.stages.split('|');

      const { data } = await request.post("api/tasks", payload);
      if (data.ok) {
        uni.showModal({
          title: "添加成功",
          // content: JSON.stringify(payload),
          success: (res) => {
            uni.switchTab({
              url: "../index/index"
            });
          },
          showCancel: false
        });

        commit({ type: "newTaskSuccess", payload: data.ops[0] });
        return true;
      }
      return false;
    },
    async enrollTask({ commit, dispatch }, payload) {
      // const newItem = {
      //   taskId: payload.taskId,
      //   userId: payload.userId
      // };
      const { data } = await request.post("/task/enroll", payload);

      if (data.ok) {
        uni.showModal({
          title: "报名成功",
          content: "请按照要求完成任务",
          showCancel: false
        });

        dispatch({ type: "user/refreshUser" }, { root: true });
      } else {
        uni.showModal({
          title: "操作失败",
          content: data.message,
          showCancel: false
        });
      }
    },

    async approveTask({ commit, dispatch }, payload) {
      const info = {
        taskId: payload.taskId,
        userId: payload.userId
      };
      const { data } = await request.post("/task/approve", info);

      if (data.user.ok && data.approve.ok) {
        uni.showModal({
          title: "验证成功",
          // content: JSON.stringify(payload),
          showCancel: false
        });
        dispatch({ type: "user/profile" }, { root: true });
      }
    },

    async updateTaskAssignment({ commit }, payload) {
      const { data } = await request.post("/task/assignment", payload);
      if (data.success) {
        uni.showModal({
          title: "操作成功",
          showCancel: false
        });
      }
    }
  },
  getters: {}
};
