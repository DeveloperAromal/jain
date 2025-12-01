-- ============================================
-- Jain Education Platform - Complete Database Schema
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- This will create all necessary tables for the platform
-- 
-- IMPORTANT: Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CLIENTS TABLE (Admin Users)
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  phonenumber VARCHAR(20),
  client_id VARCHAR(100) UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for clients
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_client_id ON clients(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clients(is_active);

-- ============================================
-- 2. USERS TABLE (Students)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  class VARCHAR(100),
  user_id VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  subscription_active BOOLEAN DEFAULT false,
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_subscription_active ON users(subscription_active);
CREATE INDEX IF NOT EXISTS idx_users_subscription_end_date ON users(subscription_end_date);
CREATE INDEX IF NOT EXISTS idx_users_subscription_active ON users(subscription_active);
CREATE INDEX IF NOT EXISTS idx_users_subscription_end_date ON users(subscription_end_date);

-- ============================================
-- 3. COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject VARCHAR(255) NOT NULL,
  subject_class VARCHAR(100) NOT NULL,
  description TEXT,
  tags VARCHAR(500),
  is_free BOOLEAN DEFAULT false,
  price DECIMAL(10, 2) DEFAULT 0,
  instructor_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  created_by UUID REFERENCES clients(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for courses
CREATE INDEX IF NOT EXISTS idx_courses_is_free ON courses(is_free);
CREATE INDEX IF NOT EXISTS idx_courses_subject_class ON courses(subject_class);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON courses(subject);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at);

-- ============================================
-- 4. TOPICS TABLE (Course Content/Videos)
-- ============================================
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500),
  thumbnail_img VARCHAR(500),
  tags VARCHAR(500),
  sequence_order INT DEFAULT 0,
  duration_minutes INT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for topics
CREATE INDEX IF NOT EXISTS idx_topics_course_id ON topics(course_id);
CREATE INDEX IF NOT EXISTS idx_topics_sequence ON topics(course_id, sequence_order);
CREATE INDEX IF NOT EXISTS idx_topics_is_published ON topics(is_published);

-- ============================================
-- 5. PROMO CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS promocodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent INT NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  max_uses INT DEFAULT -1, -- -1 = unlimited
  used_count INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires DATE,
  created_by UUID REFERENCES clients(id) ON DELETE SET NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for promocodes
CREATE INDEX IF NOT EXISTS idx_promocodes_code ON promocodes(code);
CREATE INDEX IF NOT EXISTS idx_promocodes_active ON promocodes(active);
CREATE INDEX IF NOT EXISTS idx_promocodes_expires ON promocodes(expires);

-- ============================================
-- 6. ORDERS TABLE (Payment Records - Subscription Payments)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  razorpay_order_id VARCHAR(100) UNIQUE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL, -- NULL for subscription payments
  amount DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  promo_code_id UUID REFERENCES promocodes(id) ON DELETE SET NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, cancelled
  payment_method VARCHAR(50),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  error_message TEXT,
  subscription_months INT DEFAULT 12, -- Subscription duration in months
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_course_id ON orders(course_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- ============================================
-- 7. ENROLLMENTS TABLE (Course Access)
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  enrollment_type VARCHAR(50) DEFAULT 'paid', -- paid, free, referral, admin
  status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  progress_percent INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id) -- Prevent duplicate enrollments
);

-- Indexes for enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_order_id ON enrollments(order_id);

-- ============================================
-- 8. REFERRALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS refferals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refferal_code VARCHAR(50) UNIQUE NOT NULL,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  bonus_points INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for referrals
CREATE INDEX IF NOT EXISTS idx_referrals_user_id ON refferals(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON refferals(refferal_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user ON refferals(referred_user_id);

-- ============================================
-- 9. USER PROGRESS TABLE (Track Video Watching)
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  watched_minutes INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, topic_id)
);

-- Indexes for user_progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_topic_id ON user_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_is_completed ON user_progress(is_completed);

-- ============================================
-- 10. REFRESH TOKENS TABLE (Optional - for token management)
-- ============================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for refresh_tokens
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================
-- 11. FREMIUM TABLE (Legacy - Keep for backward compatibility)
-- ============================================
CREATE TABLE IF NOT EXISTS fremium (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fremium
CREATE INDEX IF NOT EXISTS idx_fremium_course_id ON fremium(course_id);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Free courses with topic count
CREATE OR REPLACE VIEW free_courses_with_stats AS
SELECT 
  c.id,
  c.subject,
  c.subject_class,
  c.description,
  c.tags,
  c.is_free,
  c.price,
  COUNT(t.id) as topic_count,
  c.created_at
FROM courses c
LEFT JOIN topics t ON c.id = t.course_id
WHERE c.is_free = true AND c.is_published = true
GROUP BY c.id, c.subject, c.subject_class, c.description, c.tags, c.is_free, c.price, c.created_at;

-- View: Course enrollment stats
CREATE OR REPLACE VIEW course_enrollment_stats AS
SELECT 
  c.id,
  c.subject,
  c.is_free,
  COUNT(e.id) as enrollment_count,
  COUNT(DISTINCT e.user_id) as unique_students
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
GROUP BY c.id, c.subject, c.is_free;

-- ============================================
-- SAMPLE DATA (Optional - Uncomment if needed)
-- ============================================

-- Insert sample promo codes
INSERT INTO promocodes (code, discount_percent, description, active, expires)
VALUES 
  ('WELCOME10', 10, 'Welcome discount - 10% off', true, '2099-12-31'),
  ('FESTIVE25', 25, 'Festive season - 25% off', true, '2099-12-31'),
  ('STUDENT15', 15, 'Student discount - 15% off', true, '2099-12-31')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- TABLE COMMENTS
-- ============================================

COMMENT ON TABLE clients IS 'Admin users who can manage courses and content';
COMMENT ON TABLE users IS 'Student users who enroll in courses';
COMMENT ON TABLE courses IS 'Main courses table - stores course metadata and free/paid status';
COMMENT ON TABLE topics IS 'Video lessons/topics for each course';
COMMENT ON TABLE promocodes IS 'Discount codes for payment discounts';
COMMENT ON TABLE orders IS 'Payment orders from Razorpay integration';
COMMENT ON TABLE enrollments IS 'User enrollment tracking for courses - determines access';
COMMENT ON TABLE refferals IS 'Referral program tracking';
COMMENT ON TABLE user_progress IS 'Student progress tracking for videos watched';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for user sessions';
COMMENT ON TABLE fremium IS 'Legacy table for free course tracking';

-- ============================================
-- ROW LEVEL SECURITY (RLS) - OPTIONAL
-- ============================================
-- Uncomment the following if you want to enable RLS
-- Note: This may require additional policies to be created

/*
-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE promocodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refferals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (adjust as needed)
CREATE POLICY "Public read courses" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public read topics" ON topics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses WHERE courses.id = topics.course_id AND courses.is_published = true
    )
  );

CREATE POLICY "Public read active promos" ON promocodes
  FOR SELECT USING (active = true AND (expires IS NULL OR expires > CURRENT_DATE));
*/

-- ============================================
-- SCHEMA CREATION COMPLETE
-- ============================================
-- All tables have been created successfully!
-- Your database is ready for the Jain Education Platform
--
-- Next Steps:
-- 1. Verify all tables are created in Supabase
-- 2. Test the API endpoints
-- 3. Create admin user in clients table
-- 4. Start creating courses
-- ============================================
