// ============================================================
// FLINTSMARKET — SUPABASE CLIENT & HELPERS
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ===== YOUR SUPABASE CREDENTIALS =====
const supabaseUrl = 'https://eswlfgrzdmdwmfqncpew.supabase.co'
const supabaseAnonKey = 'sb_publishable_oeCfBt8Ci0xQ4mg6o2mnnA_mbgnwRVS'

// ===== CREATE CLIENT =====
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// AUTHENTICATION FUNCTIONS
// ============================================================

// SIGN UP
export async function signUp(email, password, fullName) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { 
                    full_name: fullName,
                    tier: 'starter'
                }
            }
        })
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// SIGN IN
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// SIGN OUT
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        return { error }
    } catch (err) {
        return { error: err }
    }
}

// GET CURRENT USER
export async function getCurrentUser() {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    } catch (err) {
        return null
    }
}

// GET SESSION
export async function getSession() {
    try {
        const { data: { session } } = await supabase.auth.getSession()
        return session
    } catch (err) {
        return null
    }
}

// ============================================================
// PROFILE FUNCTIONS
// ============================================================

// GET PROFILE
export async function getProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// UPDATE PROFILE
export async function updateProfile(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// ============================================================
// BALANCE FUNCTIONS
// ============================================================

// GET BALANCES
export async function getBalances(userId) {
    try {
        const { data, error } = await supabase
            .from('balances')
            .select('*')
            .eq('user_id', userId)
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// UPDATE BALANCE
export async function updateBalance(userId, asset, amount) {
    try {
        const { data, error } = await supabase
            .from('balances')
            .upsert({
                user_id: userId,
                asset: asset,
                balance: amount,
                updated_at: new Date()
            })
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// ============================================================
// TRANSACTION FUNCTIONS
// ============================================================

// ADD TRANSACTION
export async function addTransaction(userId, type, asset, amount, reference, description) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                type: type,
                asset: asset,
                amount: amount,
                reference: reference || 'TXN-' + Date.now(),
                description: description || ''
            })
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// GET TRANSACTIONS
export async function getTransactions(userId, limit = 50) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// ============================================================
// TRADE FUNCTIONS
// ============================================================

// ADD TRADE
export async function addTrade(tradeData) {
    try {
        const { data, error } = await supabase
            .from('trades')
            .insert(tradeData)
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// GET TRADES
export async function getTrades(userId, limit = 50) {
    try {
        const { data, error } = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// ============================================================
// POSITION FUNCTIONS
// ============================================================

// GET OPEN POSITIONS
export async function getPositions(userId) {
    try {
        const { data, error } = await supabase
            .from('positions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'open')
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// ============================================================
// ALERT FUNCTIONS
// ============================================================

// ADD ALERT
export async function addAlert(userId, asset, condition, targetPrice) {
    try {
        const { data, error } = await supabase
            .from('alerts')
            .insert({
                user_id: userId,
                asset: asset,
                condition: condition,
                target_price: targetPrice
            })
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// GET ALERTS
export async function getAlerts(userId) {
    try {
        const { data, error } = await supabase
            .from('alerts')
            .select('*')
            .eq('user_id', userId)
            .eq('triggered', false)
        return { data, error }
    } catch (err) {
        return { data: null, error: err }
    }
}

// DELETE ALERT
export async function deleteAlert(alertId) {
    try {
        const { error } = await supabase
            .from('alerts')
            .delete()
            .eq('id', alertId)
        return { error }
    } catch (err) {
        return { error: err }
    }
}

console.log('🔐 FlintsMarket Supabase client ready!')
console.log('📡 Connected to:', supabaseUrl)
