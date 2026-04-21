'use client';
import { useRouter } from 'next/navigation';
import WhatDoYouHave from '@/components/WhatDoYouHave';

export default function ItemsPage() {
  const router = useRouter();

  const handleContinue = (selectedItems, locality) => {
    const params = new URLSearchParams();
    // Filter out 'not-sure' logic which is the key for the AI pill in WhatDoYouHave
    selectedItems.filter(s => s !== 'not-sure').forEach(s => params.append('m', s));
    
    // Locality wasn't appended to the URL in the previous version, 
    // but you can add it if needed: params.append('loc', locality);
    
    router.push(`/map?${params.toString()}`);
  };

  return <WhatDoYouHave onContinue={handleContinue} />;
}
