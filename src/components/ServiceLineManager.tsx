import { useState } from 'react';

interface ServiceLineManagerProps {
  initialServiceLines?: string[];
  children: (props: {
    serviceLines: string[];
    currentServiceLine: string;
    setCurrentServiceLine: (value: string) => void;
    addServiceLine: () => void;
    removeServiceLine: (indexToRemove: number) => void;
  }) => React.ReactNode;
}

export default function ServiceLineManager({ initialServiceLines = [], children }: ServiceLineManagerProps) {
  const [serviceLines, setServiceLines] = useState<string[]>(initialServiceLines);
  const [currentServiceLine, setCurrentServiceLine] = useState('');

  // Function to add a service line
  const addServiceLine = () => {
    if (currentServiceLine && !serviceLines.includes(currentServiceLine)) {
      setServiceLines([...serviceLines, currentServiceLine]);
      setCurrentServiceLine('');
    }
  };

  // Function to remove a service line
  const removeServiceLine = (indexToRemove: number) => {
    setServiceLines(serviceLines.filter((_, index) => index !== indexToRemove));
  };

  return children({
    serviceLines,
    currentServiceLine,
    setCurrentServiceLine,
    addServiceLine,
    removeServiceLine,
  });
}