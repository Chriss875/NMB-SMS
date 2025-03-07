import React, { useState, useRef } from 'react';
import { ProfileData } from '@/types/profile.types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Camera, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface EditProfileFormProps {
  profileData: ProfileData;
  onSave: (data: Partial<ProfileData>) => Promise<void>;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ 
  profileData, 
  onSave, 
  onCancel 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | undefined>(profileData.profileImage);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: profileData.name,
      email: profileData.email,
      mobilePhone: profileData.mobilePhone,
      universityName: profileData.universityName,
      universityRegistrationID: profileData.universityRegistrationID,
      programName: profileData.programName,
    }
  });

  // Create initials from name for avatar fallback
  const initials = profileData.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is an image and size is reasonable (< 5MB)
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearSelectedImage = () => {
    setProfileImage(profileData.profileImage);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // In a real app, you would upload the image to a storage service
      // and get back a URL to save in the profile
      let profileImageUrl = profileData.profileImage;
      
      // If a new image was selected, you would upload it here
      if (imageFile) {
        // Mock implementation - in a real app you would upload the file
        // const uploadedUrl = await uploadImageToStorage(imageFile);
        // profileImageUrl = uploadedUrl;
        
        // For now, just use the existing URL or the data URL as a demo
        profileImageUrl = profileImage;
      }
      
      await onSave({
        ...data,
        profileImage: profileImageUrl ?? undefined
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Avatar className="h-24 w-24 cursor-pointer" onClick={handleImageClick}>
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={profileData.name} />
                ) : (
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                )}
                <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              </Avatar>
              
              {imageFile && (
                <button 
                  type="button"
                  onClick={clearSelectedImage}
                  className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                  aria-label="Remove selected image"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Upload profile picture"
            />
            
            <p className="text-sm text-gray-500 mt-2">
              {imageFile ? 'Click to change profile picture' : 'Click to upload profile picture'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                <input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message?.toString()}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message?.toString()}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="mobilePhone" className="block text-sm font-medium text-gray-500 mb-1">Mobile Phone</label>
                <input
                  id="mobilePhone"
                  {...register("mobilePhone", { 
                    required: "Phone number is required",
                    pattern: {
                      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/i,
                      message: "Invalid phone number format"
                    }
                  })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.mobilePhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobilePhone.message?.toString()}</p>
                )}
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-4">
              <div className="mb-4">
                <label htmlFor="universityName" className="block text-sm font-medium text-gray-500 mb-1">University Name</label>
                <input
                  id="universityName"
                  {...register("universityName", { required: "University name is required" })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.universityName && (
                  <p className="text-red-500 text-xs mt-1">{errors.universityName.message?.toString()}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="universityRegistrationID" className="block text-sm font-medium text-gray-500 mb-1">University Registration ID</label>
                <input
                  id="universityRegistrationID"
                  {...register("universityRegistrationID", { required: "Registration ID is required" })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.universityRegistrationID && (
                  <p className="text-red-500 text-xs mt-1">{errors.universityRegistrationID.message?.toString()}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="programName" className="block text-sm font-medium text-gray-500 mb-1">Program Name</label>
                <input
                  id="programName"
                  {...register("programName", { required: "Program name is required" })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.programName && (
                  <p className="text-red-500 text-xs mt-1">{errors.programName.message?.toString()}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EditProfileForm;