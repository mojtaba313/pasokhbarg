import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { IUser } from "@/models/User";
import { useState, Dispatch, SetStateAction } from "react";

interface Props {
  isShow: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>>;
  users: IUser[];
  onSubmit: (selectedUsers: IUser[], callback?: () => void) => void;
}

const UserSelectionPopup = ({ isShow, onSubmit, setIsShow, users }: Props) => {
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);

  const handleSubmit = () => {
    onSubmit(selectedUsers, () => setSelectedUsers([]));
  };

  return (
    <Dialog
      header="افزودن کاربران زیرمجموعه"
      visible={isShow}
      onHide={() => setIsShow(false)}
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
    >
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div key={user._id} className="flex items-center gap-3">
            <Checkbox
              inputId={user._id}
              checked={selectedUsers.some((u) => u._id === user._id)}
              onChange={(e) => {
                if (e.checked) {
                  setSelectedUsers([...selectedUsers, user]);
                } else {
                  setSelectedUsers(
                    selectedUsers.filter((u) => u._id !== user._id)
                  );
                }
              }}
            />
            <label htmlFor={user._id} className="cursor-pointer">
              {user.name}
            </label>
          </div>
        ))}
        <Button
          label="تایید"
          onClick={handleSubmit}
          className="p-button-success"
        />
      </div>
    </Dialog>
  );
};

export default UserSelectionPopup;
