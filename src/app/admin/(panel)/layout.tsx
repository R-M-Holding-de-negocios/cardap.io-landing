import { redirect } from 'next/navigation';
import AdminShell from '@/components/platform-admin/AdminShell';
import { getPlatformAdminSession } from '@/lib/platform-admin-session';
export default async function AdminLayout({children}:{children:React.ReactNode}){
 const user=await getPlatformAdminSession();if(!user)redirect('/admin/login');
 return <AdminShell email={user.email}>{children}</AdminShell>;
}
