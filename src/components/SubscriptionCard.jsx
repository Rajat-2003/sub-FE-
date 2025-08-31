import { Edit2, Trash2, Calendar, Repeat } from "lucide-react";
import DueDateBadge from "./DueDateBadge";

const SubscriptionCard = ({ subscription, onEdit, onDelete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      ENTERTAINMENT: "bg-purple-100 text-purple-700",
      PRODUCTIVITY: "bg-blue-100 text-blue-700",
      SOFTWARE: "bg-green-100 text-green-700",
      GAMING: "bg-red-100 text-red-700",
      UTILITY: "bg-orange-100 text-orange-700",
      OTHER: "bg-gray-100 text-gray-700",
    };
    return colors[category] || colors.OTHER;
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isDueSoon = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };


 


  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group">
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-lg">
                {subscription.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {subscription.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                    subscription.category
                  )}`}
                >
                  {subscription.category}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Repeat size={12} className="mr-1" />
                  {subscription.billingCycle}
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              {formatCurrency(subscription.price)}
            </div>
            <div className="text-xs text-gray-500">per cycle</div>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center space-x-2 p-3 rounded-lg mb-4 bg-gray-50">
          <Calendar size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            <DueDateBadge dueDate={subscription.nextDueDate} />
          </span>
        </div>

        {/* Notes */}
        {subscription.notes && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600">
            {subscription.notes}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex space-x-2">
          <button
            onClick={() => onEdit(subscription)}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit2 size={16} />
            <span className="text-sm font-medium">Edit</span>
          </button>
          <button
            onClick={() => onDelete(subscription.id)}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
