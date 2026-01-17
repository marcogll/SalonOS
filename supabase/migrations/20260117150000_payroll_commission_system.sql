-- ============================================
-- PAYROLL AND COMMISSION SYSTEM MIGRATION
-- Fecha: 2026-01-17
-- Autor: AI Assistant
-- ============================================

-- Add base salary to staff table
ALTER TABLE staff ADD COLUMN IF NOT EXISTS base_salary DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS commission_percentage DECIMAL(5, 2) DEFAULT 0;

-- STAFF SALARIES TABLE (historical tracking)
CREATE TABLE IF NOT EXISTS staff_salaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    base_salary DECIMAL(10, 2) NOT NULL CHECK (base_salary >= 0),
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, effective_date)
);

-- COMMISSION RATES TABLE
CREATE TABLE IF NOT EXISTS commission_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    service_category VARCHAR(50), -- 'hair', 'nails', 'facial', etc.
    staff_role user_role NOT NULL,
    commission_percentage DECIMAL(5, 2) NOT NULL CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(service_id, staff_role)
);

-- TIP RECORDS TABLE
CREATE TABLE IF NOT EXISTS tip_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    tip_method VARCHAR(20) DEFAULT 'cash' CHECK (tip_method IN ('cash', 'card', 'app')),
    recorded_by UUID NOT NULL, -- staff who recorded the tip
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id, staff_id)
);

-- PAYROLL RECORDS TABLE
CREATE TABLE IF NOT EXISTS payroll_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    payroll_period_start DATE NOT NULL,
    payroll_period_end DATE NOT NULL,
    base_salary DECIMAL(10, 2) NOT NULL DEFAULT 0,
    service_commissions DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_tips DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_earnings DECIMAL(10, 2) NOT NULL DEFAULT 0,
    hours_worked DECIMAL(5, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'calculated', 'paid')),
    calculated_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    paid_by UUID REFERENCES staff(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, payroll_period_start, payroll_period_end)
);

-- STAFF AVAILABILITY TABLE (if not exists)
CREATE TABLE IF NOT EXISTS staff_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, day_of_week, start_time, end_time)
);

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_staff_salaries_staff_id ON staff_salaries(staff_id);
CREATE INDEX IF NOT EXISTS idx_commission_rates_service ON commission_rates(service_id);
CREATE INDEX IF NOT EXISTS idx_commission_rates_category ON commission_rates(service_category, staff_role);
CREATE INDEX IF NOT EXISTS idx_tip_records_staff ON tip_records(staff_id);
CREATE INDEX IF NOT EXISTS idx_tip_records_booking ON tip_records(booking_id);
CREATE INDEX IF NOT EXISTS idx_payroll_records_staff ON payroll_records(staff_id);
CREATE INDEX IF NOT EXISTS idx_payroll_records_period ON payroll_records(payroll_period_start, payroll_period_end);
CREATE INDEX IF NOT EXISTS idx_staff_availability_staff ON staff_availability(staff_id, day_of_week);

-- RLS POLICIES
ALTER TABLE staff_salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_availability ENABLE ROW LEVEL SECURITY;

-- Staff can view their own salaries and availability
CREATE POLICY "staff_salaries_select_own" ON staff_salaries
    FOR SELECT USING (staff_id IN (SELECT id FROM staff WHERE user_id = auth.uid()));

CREATE POLICY "staff_availability_select_own" ON staff_availability
    FOR SELECT USING (staff_id IN (SELECT id FROM staff WHERE user_id = auth.uid()));

-- Managers and admins can view all
CREATE POLICY "staff_salaries_select_admin_manager" ON staff_salaries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.user_id = auth.uid()
            AND s.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "commission_rates_select_all" ON commission_rates
    FOR SELECT USING (true);

CREATE POLICY "tip_records_select_admin_manager" ON tip_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.user_id = auth.uid()
            AND s.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "payroll_records_select_admin_manager" ON payroll_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.user_id = auth.uid()
            AND s.role IN ('admin', 'manager')
        )
    );

-- Full access for managers/admins
CREATE POLICY "commission_rates_admin_manager" ON commission_rates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.user_id = auth.uid()
            AND s.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "tip_records_admin_manager" ON tip_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.user_id = auth.uid()
            AND s.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "payroll_records_admin_manager" ON payroll_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.user_id = auth.uid()
            AND s.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "staff_availability_admin_manager" ON staff_availability
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM staff s
            WHERE s.user_id = auth.uid()
            AND s.role IN ('admin', 'manager')
        )
    );

-- FUNCTIONS for payroll calculations
CREATE OR REPLACE FUNCTION calculate_staff_payroll(
    p_staff_id UUID,
    p_period_start DATE,
    p_period_end DATE
) RETURNS TABLE (
    base_salary DECIMAL(10, 2),
    service_commissions DECIMAL(10, 2),
    total_tips DECIMAL(10, 2),
    total_earnings DECIMAL(10, 2),
    hours_worked DECIMAL(5, 2)
) LANGUAGE plpgsql AS $$
DECLARE
    v_base_salary DECIMAL(10, 2) := 0;
    v_service_commissions DECIMAL(10, 2) := 0;
    v_total_tips DECIMAL(10, 2) := 0;
    v_hours_worked DECIMAL(5, 2) := 0;
BEGIN
    -- Get base salary (current effective salary)
    SELECT COALESCE(ss.base_salary, 0) INTO v_base_salary
    FROM staff_salaries ss
    WHERE ss.staff_id = p_staff_id
    AND ss.effective_date <= p_period_end
    AND (ss.end_date IS NULL OR ss.end_date >= p_period_start)
    ORDER BY ss.effective_date DESC
    LIMIT 1;

    -- Calculate service commissions
    SELECT COALESCE(SUM(
        CASE
            WHEN cr.service_id IS NOT NULL THEN (b.total_amount * cr.commission_percentage / 100)
            WHEN cr.service_category IS NOT NULL THEN (b.total_amount * cr.commission_percentage / 100)
            ELSE 0
        END
    ), 0) INTO v_service_commissions
    FROM bookings b
    JOIN staff s ON s.id = b.staff_id
    LEFT JOIN commission_rates cr ON (
        cr.service_id = b.service_id OR
        cr.service_category = ANY(STRING_TO_ARRAY(b.services->>'category', ','))
    ) AND cr.staff_role = s.role AND cr.is_active = true
    WHERE b.staff_id = p_staff_id
    AND b.status = 'completed'
    AND DATE(b.end_time_utc) BETWEEN p_period_start AND p_period_end;

    -- Calculate total tips
    SELECT COALESCE(SUM(amount), 0) INTO v_total_tips
    FROM tip_records
    WHERE staff_id = p_staff_id
    AND DATE(recorded_at) BETWEEN p_period_start AND p_period_end;

    -- Calculate hours worked (simplified - based on bookings)
    SELECT COALESCE(SUM(
        EXTRACT(EPOCH FROM (b.end_time_utc - b.start_time_utc)) / 3600
    ), 0) INTO v_hours_worked
    FROM bookings b
    WHERE b.staff_id = p_staff_id
    AND b.status IN ('confirmed', 'completed')
    AND DATE(b.start_time_utc) BETWEEN p_period_start AND p_period_end;

    RETURN QUERY SELECT
        v_base_salary,
        v_service_commissions,
        v_total_tips,
        v_base_salary + v_service_commissions + v_total_tips,
        v_hours_worked;
END;
$$;