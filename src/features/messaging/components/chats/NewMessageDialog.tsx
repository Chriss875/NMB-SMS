import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

// Mock user data - in a real app, this would come from an API
const mockUsers = [
  { id: 'user2', name: 'Jane Doe', role: 'Scholar' },
  { id: 'user3', name: 'Alex Smith', role: 'Scholar' },
  { id: 'user4', name: 'Michael Johnson', role: 'Scholar' },
  { id: 'user5', name: 'Sarah Williams', role: 'Mentor' },
  { id: 'user6', name: 'Robert Brown', role: 'Mentor' },
  { id: 'user7', name: 'Emma Davis', role: 'Admin' },
  { id: 'user8', name: 'David Wilson', role: 'Scholar' },
  { id: 'user9', name: 'Olivia Taylor', role: 'Scholar' },
];

interface NewMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (userId: string, userName: string) => void;
}

const NewMessageDialog: React.FC<NewMessageDialogProps> = ({
  isOpen,
  onClose,
  onCreateChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const { user } = useAuth();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(mockUsers);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        mockUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery]);

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId === selectedUser ? null : userId);
  };

  const handleCreateChat = () => {
    if (selectedUser) {
      const user = mockUsers.find((u) => u.id === selectedUser);
      if (user) {
        onCreateChat(user.id, user.name);
        onClose();
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Select a user to start a conversation with.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${
                  selectedUser === user.id ? 'bg-muted' : ''
                }`}
                onClick={() => handleSelectUser(user.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                {selectedUser === user.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateChat}
            disabled={!selectedUser}
          >
            Start Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;