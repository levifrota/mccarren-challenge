import { useState } from 'react';
import type { CompanyProfile } from '../services/ai-service';

const emptyProfile: CompanyProfile = {
  company_name: '',
  service_line: [],
  company_description: '',
  tier1_keywords: [],
  tier2_keywords: [],
  emails: [],
  poc: [],
};

interface EditModeManagerProps {
  profile: CompanyProfile | null;
  children: (props: {
    editMode: boolean;
    editedProfile: CompanyProfile;
    tier1Input: string;
    tier2Input: string;
    emailsInput: string;
    pocInput: string;
    toggleEditMode: () => void;
    closeEditMode: () => void;
    updateEditedProfile: (field: keyof CompanyProfile, value: unknown) => void;
    removeArrayField: (field: keyof CompanyProfile, indexToRemove: number) => void;
    handleArrayField: (field: keyof CompanyProfile, value: string) => void;
    setTier1Input: (value: string) => void;
    setTier2Input: (value: string) => void;
    setEmailsInput: (value: string) => void;
    setPocInput: (value: string) => void;
  }) => React.ReactNode;
}

export default function EditModeManager({ profile, children }: EditModeManagerProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CompanyProfile>(emptyProfile);
  const [tier1Input, setTier1Input] = useState('');
  const [tier2Input, setTier2Input] = useState('');
  const [emailsInput, setEmailsInput] = useState('');
  const [pocInput, setPocInput] = useState('');

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
       //Save changes
      if (tier1Input.trim()) handleArrayField('tier1_keywords', tier1Input);
      if (tier2Input.trim()) handleArrayField('tier2_keywords', tier2Input);
      if (emailsInput.trim()) handleArrayField('emails', emailsInput);
      if (pocInput.trim()) handleArrayField('poc', pocInput);
      
      // Update the original profile
      if (profile) {
        Object.assign(profile, editedProfile);
      }
    } else {
      // Edit Profile section
      const p = profile || emptyProfile;
      // Creates a profile copy
      setEditedProfile({...p});
      setTier1Input('');
      setTier2Input('');
      setEmailsInput('');
      setPocInput('');
    }
    setEditMode(!editMode);
  };

  // Function to cancel edit mode
  const closeEditMode = () => {
    // Discard changes
    if (profile) {
      // Restores the original profile
      setEditedProfile({...profile});
    }
    setTier1Input('');
    setTier2Input('');
    setEmailsInput('');
    setPocInput('');
    setEditMode(false);
  };

  // Function to update the edited profile
  const updateEditedProfile = (field: keyof CompanyProfile, value: unknown) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to remove an item from an array field
  const removeArrayField = (field: keyof CompanyProfile, indexToRemove: number) => {
    setEditedProfile((prev) => {
      const items = [...(prev[field] as string[])];
      items.splice(indexToRemove, 1);
      return { ...prev, [field]: items };
    });
  };

  // Function to handle adding items to array fields
  const handleArrayField = (field: keyof CompanyProfile, value: string) => {
    const newItems = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');
    if (newItems.length === 0) return;
    setEditedProfile((prev) => {
      const prevItems = prev[field] as string[];
      const uniqueNew = newItems.filter((item) => !prevItems.includes(item));
      if (uniqueNew.length === 0) return prev;
      return {
        ...prev,
        [field]: [...prevItems, ...uniqueNew],
      };
    });
  };

  return children({
    editMode,
    editedProfile,
    tier1Input,
    tier2Input,
    emailsInput,
    pocInput,
    toggleEditMode,
    closeEditMode,
    updateEditedProfile,
    removeArrayField,
    handleArrayField,
    setTier1Input,
    setTier2Input,
    setEmailsInput,
    setPocInput,
  });
}