import { notFound } from 'next/navigation';
import RestaurantDetail from '@/components/platform-admin/RestaurantDetail';

export default async function AdminRestaurantDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || id.length > 120) notFound();
  return <RestaurantDetail id={id} />;
}
