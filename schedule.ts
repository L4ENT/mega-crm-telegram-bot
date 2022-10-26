import AutoAssignTask from "@src/tasks/AutoAssignTask";
import schedule = require("node-schedule");

const job = schedule.scheduleJob("*/10 * * * *", async function () {
    const task = new AutoAssignTask()
    await task.run()
});
