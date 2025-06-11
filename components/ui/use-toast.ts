import { useState } from 'react';

interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = 'default' }: Toast) => {
    // Simple console log for now - you can implement a proper toast system
    console.log(`Toast: ${title} - ${description} (${variant})`);
    
    // You can integrate with a toast library like react-hot-toast or sonner
    // For now, we'll use browser alert as fallback
    if (variant === 'destructive') {
      alert(`Error: ${title}\n${description}`);
    } else {
      alert(`${title}\n${description}`);
    }
  };

  return { toast };
}
