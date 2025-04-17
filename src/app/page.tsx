'use client'

import React, {useState} from "react";
import useTasks from "@/hooks/useTasks";

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../mocks");
}

// Validate PDF or image under 2MB
const isValidFile = (file: File): boolean => {
  const isPDF = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');
  const isUnder2MB = file.size <= 2 * 1024 * 1024;
  return isPDF || (isImage && isUnder2MB);
};

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const { tasks, isPolling, startTask, cancelTask } = useTasks();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!isValidFile(selectedFile)) {
      setError('Invalid file. Only PDFs and images under 2MB allowed.');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setError('');

    try {
      await startTask(file);
    } catch (err) {
      console.error(err);
      setError('Failed to submit file.');
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.form}>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleSubmit} disabled={!file && isPolling}>
            Submit
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </div>

        <h3>Tasks</h3>
        <ul style={styles.taskList}>
          {tasks.map((task) => (
              <li key={task.task_id} style={styles.taskItem}>
                <strong>{task.name}</strong> - <em>{task.status}</em>
                {task.status === 'processing' && (
                    <button style={styles.cancelButton} onClick={() => cancelTask(task.task_id)}>
                      Cancel
                    </button>
                )}
                {task.error && <p style={styles.error}>Error: {task.error}</p>}
              </li>
          ))}
        </ul>
      </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '500px',
    margin: 'auto',
    padding: '1rem',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  taskList: {
    listStyle: 'none',
    padding: 0,
  },
  taskItem: {
    padding: '0.5rem',
    borderBottom: '1px solid #ccc',
  },
  cancelButton: {
    marginLeft: '1rem',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
  },
};

export default Home;