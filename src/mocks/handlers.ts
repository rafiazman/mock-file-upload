import {http, HttpResponse} from 'msw';
import {Task} from "@/task";
import {TaskHandler} from "@/task-handler";

const handler = new TaskHandler();

export const handlers = [
    http.post('/submit', async ({ request }) => {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return  new HttpResponse('Missing file', { status: 400 });
        }

        if (!(file instanceof File)) {
            return new HttpResponse('Uploaded file is invalid', {
                status: 400,
            })
        }

        const newTask: Task = {
            task_id: `task-${Date.now()}`,
            status: 'processing',
            name: file.name,
            file: file,
        };
        handler.process(newTask);

        return HttpResponse.json(newTask);
    }),

    http.get('/status/:taskId', async ({ params }) => {
        const { taskId } = params;
        const tasks = handler.getTasks();

        const task = tasks[taskId as string];

        if (!task) {
            return HttpResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return HttpResponse.json({ status: task.status });
    }),
];
