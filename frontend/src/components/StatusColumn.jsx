import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { FaTasks, FaClipboardList, FaCheckDouble, FaSpinner } from 'react-icons/fa';

function StatusColumn({ status, tasks }) {
  const getColumnConfig = (status) => {
    switch (status) {
      case 'To Do':
        return {
          icon: <FaClipboardList className="text-blue-500" />,
          gradient: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50'
        };
      case 'In Progress':
        return {
          icon: <FaSpinner className="text-yellow-500 animate-spin" />,
          gradient: 'from-yellow-50 to-yellow-100',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50'
        };
      case 'Done':
        return {
          icon: <FaCheckDouble className="text-green-500" />,
          gradient: 'from-green-50 to-green-100',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50'
        };
      default:
        return {
          icon: <FaTasks className="text-gray-500" />,
          gradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const config = getColumnConfig(status);

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`
            p-4 rounded-xl border-2 ${config.borderColor} ${config.bgColor}
            ${snapshot.isDraggingOver ? 'ring-4 ring-opacity-50 ring-blue-400 bg-opacity-80' : ''}
            transition-all duration-300 min-h-[400px]
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {config.icon}
              <h2 className={`text-lg font-bold ${config.textColor}`}>
                {status}
              </h2>
            </div>
            <span className={`
              text-sm font-semibold px-3 py-1 rounded-full
              ${config.bgColor} ${config.textColor} border ${config.borderColor}
            `}>
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <div className={`text-4xl mb-2 ${config.textColor} opacity-50`}>
                  {config.icon}
                </div>
                <p className={`${config.textColor} opacity-70 text-sm`}>
                  No tasks yet
                </p>
                <p className={`${config.textColor} opacity-50 text-xs mt-1`}>
                  Drag tasks here or create new ones
                </p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard key={task._id} task={task} index={index} />
              ))
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default StatusColumn;
