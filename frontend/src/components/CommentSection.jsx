import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

function StatusColumn({ status, tasks }) {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="p-4 bg-gray-100 rounded"
        >
          <h2 className="text-xl font-bold mb-4">{status}</h2>
          {tasks.map((task, index) => (
            <TaskCard key={task._id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default StatusColumn;
