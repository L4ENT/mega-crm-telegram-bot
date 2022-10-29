import config from "@src/config";
import AutoAssignTask from "@src/tasks/AutoAssignTask";
import schedule = require("node-schedule");

const job = schedule.scheduleJob(config.DEFAULT_MASTER_CRON, async function () {
    const task = new AutoAssignTask()
    await task.run()
});
