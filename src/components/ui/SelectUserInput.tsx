import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchUsers } from "@/hooks/users/useGetUsers";
import useDebounce from "@/hooks/useDebounce";

type User = {
  _id: string;
  username: string;
};

type Props = {
  label?: string;
  placeholder?: string;
  onSelect: (user: { id: string; name: string } | null) => void;
};

const SelectUserInput = ({
  label,
  placeholder = "Search user...",
  onSelect,
}: Props) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(true);

  const debouncedQuery = useDebounce(query, 400);

  const searchQuery =
    debouncedQuery.length >= 3 && showDropdown
      ? debouncedQuery
      : "";

  const { data: usersData, isFetching } =
    useSearchUsers(searchQuery);

  const users = usersData?.users || [];

  const handleSelect = (user: User) => {
    setQuery(user.username);
    setShowDropdown(false); // hide dropdown
    onSelect({ id: user._id, name: user.username });
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setShowDropdown(true);

    if (!value) {
      onSelect(null); // remove selected user
    }
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-xs text-muted-foreground mb-2">
          {label}
        </label>
      )}

      <Input
        value={query}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-input border-border"
      />

      {searchQuery && showDropdown && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-black shadow-xl max-h-56 overflow-y-auto">
          {isFetching && (
            <div className="p-3 text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!isFetching && users.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              No users found
            </div>
          )}

          {users.map((user: User) => (
            <button
              key={user._id}
              onClick={() => handleSelect(user)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800 transition"
            >
              {user.username}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectUserInput;
