// import UserAvatar from "../UserAvatar";
// import RoleBadge from "../RoleBadge";

// interface User {
//   id: string;
//   name: string;
//   roles: string[];
//   supervisor?: { id: string };
//   avatarUrl?: string;
// }

// interface UserHierarchyTreeProps {
//   users: User[];
// }

// const UserHierarchyTree = ({ users }: UserHierarchyTreeProps) => {
//   const buildTree = (parentId: string | null = null) =>
//     users
//       .filter((user) => user.supervisor?.id === parentId)
//       .map((user) => (
//         <TreeItem
//           key={user.id}
//           itemId={user.id} // استفاده از itemId به جای nodeId
//           label={
//             <div className="flex items-center gap-2">
//               <UserAvatar user={user} />
//               <span>{user.name}</span>
//               <RoleBadge role={user.roles[0]} />
//             </div>
//           }
//         >
//           {buildTree(user.id)}
//         </TreeItem>
//       ));

//   return (
//     <div className="p-4 bg-white rounded-xl shadow-lg">
//       <h3 className="text-lg font-semibold mb-4">سلسله مراتب کاربران</h3>
//       <TreeView
//       // @ts-ignore
//         defaultCollapseIcon={<ExpandMore />}
//         defaultExpandIcon={<ChevronRight />}
//       >
//         {buildTree()}
//       </TreeView>
//     </div>
//   );
// };

// export default UserHierarchyTree;
