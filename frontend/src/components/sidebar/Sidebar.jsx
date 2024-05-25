import Conversations from "./Conversations";
import E2eeButton from "./E2eeButton";
import LogoutButton from "./LogoutButton";
import SchnorrButton from "./SchnorrButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='flex flex-col p-4 border-r border-slate-500'>
			<SearchInput />
			<div className='px-3 divider'></div>
			<Conversations />
			<div className='px-3 divider'></div>
      <div className="flex flex-col gap-2">
        <E2eeButton />
        <SchnorrButton />
      </div>
			<div className='px-3 divider'></div>
			<LogoutButton />
		</div>
	);
};
export default Sidebar;