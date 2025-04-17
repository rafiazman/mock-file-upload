import {useEffect, useRef, useState} from "react";
import {MAX_RETRIES, POLLING_INTERVAL} from "@/constants";
import {Task} from "@/task";

// API call to submit a file
const submitFile = async (file: File): Promise<Task> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/submit', { method: 'POST', body: formData });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
    }
    return res.json();
};

// API call to check task status
const checkStatus = async (taskId: string): Promise<{ status: Task['status'] }> => {
    const res = await fetch(`/status/${taskId}`);
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
};


const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isPolling, setIsPolling] = useState<boolean>(false);

    const pollingRefs = useRef<Record<string, { interval: NodeJS.Timeout; retries: number }>>({});

    useEffect(() => {
        return () => {
            // Clean up polling intervals on component unmount
            Object.values(pollingRefs.current)
                .forEach(({ interval }) => clearInterval(interval));
        };
    }, []);

    const startPolling = (taskId: string) => {
        let retries = 0;

        const poll = async () => {
            setIsPolling(true);

            try {
                const res = await checkStatus(taskId);
                setTasks((prev) =>
                    prev.map((t) => (t.task_id === taskId ? { ...t, status: res.status } : t))
                );

                if (res.status === 'success' || res.status === 'failure') {
                    clearInterval(pollingRefs.current[taskId]?.interval);
                    delete pollingRefs.current[taskId];
                    setIsPolling(false);
                }
            } catch (err: unknown) {
                if (retries < MAX_RETRIES) {
                    retries++;
                    pollingRefs.current[taskId].retries = retries;
                } else {
                    setTasks((prev) =>
                        prev.map((t) =>
                            t.task_id === taskId
                                ? {
                                    ...t,
                                    status: 'error',
                                    error: err instanceof Error ? err.message : 'Unknown error',
                                }
                                : t
                        )
                    );
                    clearInterval(pollingRefs.current[taskId]?.interval);
                    delete pollingRefs.current[taskId];
                }
            }
        };

        const interval = setInterval(poll, POLLING_INTERVAL);
        pollingRefs.current[taskId] = { interval, retries: 0 };
        poll();
    };

    const startTask = async (file: File) => {
        if (!file) {
            return;
        }

        const newTask = await submitFile(file);
        setTasks((prev) => [...prev, newTask]);
        startPolling(newTask.task_id);
    };

    const cancelTask = (taskId: string) => {
        clearInterval(pollingRefs.current[taskId]?.interval);
        delete pollingRefs.current[taskId];
        setTasks((prev) =>
            prev.map((t) => (t.task_id === taskId ? { ...t, status: 'cancelled' } : t))
        );
    };

    return { tasks, isPolling, startTask, cancelTask };
};

export default useTasks;