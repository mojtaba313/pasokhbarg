interface RoleBadgeProps {
  role: string;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  const getRoleColor = () => {
    switch (role) {
      case "admin":
        return "primary";
      case "assistant":
        return "secondary";
      case "user":
        return "default";
      default:
        return "default";
    }
  };

  return (
    // <Chip
    //   label={role}
    //   color={getRoleColor()}
    //   size="small"
    // />
    <></>
  );
};

export default RoleBadge;
