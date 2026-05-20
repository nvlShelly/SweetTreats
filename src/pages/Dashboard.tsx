import { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Heart, PlusCircle, Users, 
  Settings, BarChart3, Cake as CakeIcon, Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import UserDashboard from '../components/dashboard/UserDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  // User Dashboard handles its own sidebar and layout
  return <UserDashboard profile={profile} />;
}

