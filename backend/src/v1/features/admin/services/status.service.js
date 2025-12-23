import { supabase } from "../../../config/supabase.config.js";

export async function getDashboardStats() {

  const { count: totalUsers, error: totalUsersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (totalUsersError) throw totalUsersError;

  const { count: paidUsers, error: paidUsersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("subscription_active", true);

  if (paidUsersError) throw paidUsersError;

  const nonPaidUsers = totalUsers - paidUsers;

  const { data: orders, error: revenueError } = await supabase
    .from("orders")
    .select("amount_paid");

  if (revenueError) throw revenueError;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.amount_paid || 0),
    0
  );

  return {
    totalUsers,
    paidUsers,
    nonPaidUsers,
    totalRevenue,
  };
}


export async function getAllStudents({ page = 1, limit = 10 } = {}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from("users")
    .select(
      "name, phone, email, subscription_active, subscription_start_date, subscription_end_date",
      { count: "exact" }
    )
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return {
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
}
