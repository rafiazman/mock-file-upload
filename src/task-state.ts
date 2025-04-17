import {Task} from "@/task";

export interface TaskState {
    [taskId: string]: Task;
}