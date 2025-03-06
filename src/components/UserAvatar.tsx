interface UserAvatarProps {
  user: {
    name: string;
    avatarUrl?: string;
  };
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    // <Avatar
    //   alt={user.name}
    //   src={user.avatarUrl}
    //   sx={{ width: 32, height: 32 }}
    // >
    //   {user.name.charAt(0)}
    // </Avatar>
    <></>
  );
};

export default UserAvatar;
