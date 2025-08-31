import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  subscriptionService,
  CATEGORIES,
  BILLING_CYCLES,
} from "../services/subscriptionService";
import DashboardHeader from "../components/DashboardHeader";
import SubscriptionCard from "../components/SubscriptionCard";
import { Plus, TrendingUp, Calendar, CreditCard } from "lucide-react";

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalMonthlyCost, setTotalMonthlyCost] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    billingCycle: "MONTHLY",
    nextDueDate: "",
    category: "ENTERTAINMENT",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subs, total] = await Promise.all([
        subscriptionService.getAllSubscriptions(),
        subscriptionService.getDashboardData(),
      ]);
      setSubscriptions(subs);
      setTotalMonthlyCost(total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await subscriptionService.updateSubscription(editingId, formData);
      } else {
        await subscriptionService.createSubscription(formData);
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  };

  const handleEdit = (subscription) => {
    setFormData({
      name: subscription.name,
      price: subscription.price.toString(),
      billingCycle: subscription.billingCycle,
      nextDueDate: subscription.nextDueDate,
      category: subscription.category,
      notes: subscription.notes || "",
    });
    setEditingId(subscription.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      try {
        await subscriptionService.deleteSubscription(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting subscription:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      billingCycle: "MONTHLY",
      nextDueDate: "",
      category: "ENTERTAINMENT",
      notes: "",
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const isDueSoon = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Monthly Cost",
              value: formatCurrency(totalMonthlyCost),
              icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
              bg: "bg-blue-100",
            },
            {
              label: "Total Subscriptions",
              value: subscriptions.length,
              icon: <CreditCard className="h-6 w-6 text-green-600" />,
              bg: "bg-green-100",
            },
            {
              label: "Due Soon",
              value: subscriptions.filter((s) => isDueSoon(s.nextDueDate))
                .length,
              icon: <Calendar className="h-6 w-6 text-orange-600" />,
              bg: "bg-orange-100",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bg} p-3 rounded-xl`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Header and Add Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your Subscriptions
            </h2>
            <p className="text-gray-600 mt-1">
              Manage all your recurring payments in one place
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span className="font-medium">Add Subscription</span>
          </button>
        </div>

        {/* Subscription Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
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
                    label: "Price ($)",
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
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No subscriptions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first subscription to start tracking your expenses
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Subscription
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
