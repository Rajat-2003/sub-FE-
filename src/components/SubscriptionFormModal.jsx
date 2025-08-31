import React from "react";
import { CATEGORIES, BILLING_CYCLES } from "../services/subscriptionService";

const SubscriptionFormModal = ({
  showForm,
  formData,
  handleInputChange,
  handleSubmit,
  editingId,
  onClose,
}) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scaleIn">
        <h3 className="text-lg font-semibold mb-6">
          {editingId ? "Edit Subscription" : "Add New Subscription"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            {
              label: "Name",
              name: "name",
              type: "text",
              placeholder: "Netflix, Spotify, etc.",
            },
            {
              label: "Price (INR)",
              name: "price",
              type: "number",
              placeholder: "9.99",
              step: "0.01",
            },
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                step={field.step}
                value={formData[field.name]}
                onChange={handleInputChange}
                required
                placeholder={field.placeholder}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Cycle
            </label>
            <select
              name="billingCycle"
              value={formData.billingCycle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {BILLING_CYCLES.map((cycle) => (
                <option key={cycle} value={cycle}>
                  {cycle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Due Date
            </label>
            <input
              type="date"
              name="nextDueDate"
              value={formData.nextDueDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional details..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionFormModal;
