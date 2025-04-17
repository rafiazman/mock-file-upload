import {Task} from "@/task";
import {TASK_PROCESSING_TIME} from "@/constants";
import {TaskState} from "@/task-state";

export class TaskHandler {
    #tasks: TaskState = {};

    async process(task: Task) {
        const taskId = task.task_id;
        this.#tasks[taskId] = task;

        setTimeout(() => {
            task.status = 'success';
            return Promise.resolve(task);
        }, TASK_PROCESSING_TIME);
    }

    getTasks() {
        return this.#tasks;
    }
}