import { supabaseAdmin } from './supabase'

export class DatabaseMigrations {
  /**
   * Run all database migrations
   */
  static async runMigrations() {
    console.log('Starting database migrations...')
    
    try {
      await this.createTables()
      await this.createIndexes()
      await this.createTriggers()
      console.log('Database migrations completed successfully')
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    }
  }

  /**
   * Create all required tables
   */
  private static async createTables() {
    const tables = [
      // Users table
      `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        phone TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `,
      
      // Payments table
      `
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'INR',
        status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        razorpay_signature TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `,
      
      // Resumes table
      `
      CREATE TABLE IF NOT EXISTS resumes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        form_data JSONB NOT NULL,
        ai_generated_text TEXT NOT NULL,
        file_url TEXT,
        payment_id UUID REFERENCES payments(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `,
      
      // AI Logs table
      `
      CREATE TABLE IF NOT EXISTS ai_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
        model_name TEXT NOT NULL,
        tokens_used INTEGER,
        cost_usd DECIMAL(10,4),
        request_type TEXT NOT NULL CHECK (request_type IN ('generation', 'revision')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `
    ]

    for (const sql of tables) {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql })
      if (error) {
        console.error('Error creating table:', error)
        throw error
      }
    }
  }

  /**
   * Create database indexes for performance
   */
  private static async createIndexes() {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);',
      'CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);',
      'CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_resumes_payment_id ON resumes(payment_id);',
      'CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON ai_logs(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_ai_logs_resume_id ON ai_logs(resume_id);',
      'CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON ai_logs(created_at);'
    ]

    for (const sql of indexes) {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql })
      if (error) {
        console.error('Error creating index:', error)
        throw error
      }
    }
  }

  /**
   * Create database triggers
   */
  private static async createTriggers() {
    const triggerFunction = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `

    const triggers = [
      triggerFunction,
      'DROP TRIGGER IF EXISTS update_users_updated_at ON users;',
      'CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      'DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;',
      'CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      'DROP TRIGGER IF EXISTS update_resumes_updated_at ON resumes;',
      'CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();'
    ]

    for (const sql of triggers) {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql })
      if (error) {
        console.error('Error creating trigger:', error)
        throw error
      }
    }
  }

  /**
   * Seed database with initial data
   */
  static async seedDatabase() {
    console.log('Seeding database with initial data...')
    
    try {
      // Add any seed data here if needed
      console.log('Database seeding completed successfully')
    } catch (error) {
      console.error('Seeding failed:', error)
      throw error
    }
  }

  /**
   * Clean up database (for testing purposes)
   */
  static async cleanDatabase() {
    console.log('Cleaning database...')
    
    const tables = ['ai_logs', 'resumes', 'payments', 'users']
    
    for (const table of tables) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records
      
      if (error) {
        console.error(`Error cleaning table ${table}:`, error)
        throw error
      }
    }
    
    console.log('Database cleaned successfully')
  }
}