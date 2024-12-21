import { supabase } from './supabase';
import { AuthError } from '@supabase/supabase-js';

const formatAuthError = (error: AuthError): string => {
  switch (error.message) {
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.';
    default:
      return error.message;
  }
};

export const signUp = async (email: string, password: string, username: string) => {
  // Check if username is taken using count instead of single row
  const { count, error: checkError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('username', username);

  if (checkError) {
    console.error('Error checking username:', checkError);
    throw new Error('Unable to verify username availability');
  }

  if (count && count > 0) {
    throw new Error('This username is already taken. Please choose another one.');
  }

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: username
      }
    }
  });

  if (signUpError) throw new Error(formatAuthError(signUpError));
  return authData;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(formatAuthError(error));
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Failed to sign out. Please try again.');
};