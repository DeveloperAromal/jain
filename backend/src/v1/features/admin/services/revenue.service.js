import { supabase } from "../../../config/supabase.config.js";

export async function getMonthlyTotalRevenue(month) {
  const { data, error } = await supabase
    .from("orders")
    .select("amount_paid")
    .eq("month", month);

  if (error) throw error;

  const total_revenue = data.reduce(
    (sum, order) => sum + (order.amount_paid || 0),
    0
  );

  return total_revenue;
}

export async function getAllRevenue() {
  const { data, error } = await supabase
    .from("orders")
    .select("month, amount_paid")
  if (error) throw error;

  return data;
}
