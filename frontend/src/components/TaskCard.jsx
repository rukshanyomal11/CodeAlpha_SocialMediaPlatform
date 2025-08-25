import { Draggable } from '@hello-pangea/dnd';
import { FaCalendarAlt, FaUser, FaExclamationCircle, FaCheckCircle, FaClock } from 'react-icons/fa';

function TaskCard({ task, index }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <FaExclamationCircle className="text-red-500" />;
      case 'medium': return <FaClock className="text-yellow-500" />;
      case 'low': return <FaCheckCircle className="text-green-500" />;
      default: return null;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const daysUntilDue = task.dueDate ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
            border-l-4 ${getPriorityColor(task.priority)} 
            ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl' : ''}
            cursor-pointer hover:scale-[1.02]
          `}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-800 text-sm leading-tight flex-1 mr-2">
              {task.title}
            </h3>
            <div className="flex items-center space-x-1">
              {getPriorityIcon(task.priority)}
              {task.priority && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${task.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                  ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${task.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
                `}>
                  {task.priority}
                </span>
              )}
            </div>
          </div>
          
          {task.description && (
            <p className="text-gray-600 text-xs mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              {task.assignedTo && (
                <div className="flex items-center space-x-1">
                  <FaUser className="text-gray-400" />
                  <span className="text-gray-600 truncate max-w-20">
                    {task.assignedTo.name || 'Unassigned'}
                  </span>
                </div>
              )}
              
              {task.dueDate && (
                <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                  <FaCalendarAlt className={isOverdue ? 'text-red-500' : 'text-gray-400'} />
                  <span className={isOverdue ? 'font-medium' : ''}>
                    {isOverdue ? 'Overdue' : daysUntilDue <= 7 ? `${daysUntilDue}d` : new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            
            {task.attachments && task.attachments.length > 0 && (
              <div className="text-gray-400">
                📎 {task.attachments.length}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
