import { createClient } from '@supabase/supabase-js'
import { User, Payment, Resume, AILog, ResumeFormData } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Database utility functions
export class DatabaseService {
  // User operations
  static async createUser(email: string, fullName?: string, phone?: string): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({ email, full_name: fullName, phone })
      .select()
      .single()

    if (error) throw new Error(`Failed to create user: ${error.message}`)
    return data
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user: ${error.message}`)
    }
    return data
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update user: ${error.message}`)
    return data
  }

  // Payment operations
  static async createPayment(paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (error) throw new Error(`Failed to create payment: ${error.message}`)
    return data
  }

  static async updatePaymentStatus(
    paymentId: string, 
    status: Payment['status'], 
    razorpayData?: {
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    }
  ): Promise<Payment> {
    const updateData = { status, ...razorpayData }
    const { data, error } = await supabaseAdmin
      .from('payments')
      .update(updateData)
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update payment: ${error.message}`)
    return data
  }

  static async getPaymentByOrderId(orderId: string): Promise<Payment | null> {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get payment: ${error.message}`)
    }
    return data
  }

  // Resume operations
  static async createResume(resumeData: {
    user_id: string;
    form_data: ResumeFormData;
    ai_generated_text: string;
    payment_id?: string;
  }): Promise<Resume> {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .insert(resumeData)
      .select()
      .single()

    if (error) throw new Error(`Failed to create resume: ${error.message}`)
    return data
  }

  static async updateResumeFileUrl(resumeId: string, fileUrl: string): Promise<Resume> {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .update({ file_url: fileUrl })
      .eq('id', resumeId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update resume file URL: ${error.message}`)
    return data
  }

  static async getResumeById(resumeId: string): Promise<Resume | null> {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get resume: ${error.message}`)
    }
    return data
  }

  static async getUserResumes(userId: string): Promise<Resume[]> {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to get user resumes: ${error.message}`)
    return data || []
  }

  // AI Log operations
  static async createAILog(logData: Omit<AILog, 'id' | 'created_at'>): Promise<AILog> {
    const { data, error } = await supabaseAdmin
      .from('ai_logs')
      .insert(logData)
      .select()
      .single()

    if (error) throw new Error(`Failed to create AI log: ${error.message}`)
    return data
  }

  static async getAIUsageStats(userId: string, timeframe: 'day' | 'week' | 'month' = 'month') {
    const timeAgo = new Date()
    switch (timeframe) {
      case 'day':
        timeAgo.setDate(timeAgo.getDate() - 1)
        break
      case 'week':
        timeAgo.setDate(timeAgo.getDate() - 7)
        break
      case 'month':
        timeAgo.setMonth(timeAgo.getMonth() - 1)
        break
    }

    const { data, error } = await supabaseAdmin
      .from('ai_logs')
      .select('tokens_used, cost_usd')
      .eq('user_id', userId)
      .gte('created_at', timeAgo.toISOString())

    if (error) throw new Error(`Failed to get AI usage stats: ${error.message}`)
    
    const totalTokens = data?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0
    const totalCost = data?.reduce((sum, log) => sum + (log.cost_usd || 0), 0) || 0
    
    return { totalTokens, totalCost, requestCount: data?.length || 0 }
  }
}