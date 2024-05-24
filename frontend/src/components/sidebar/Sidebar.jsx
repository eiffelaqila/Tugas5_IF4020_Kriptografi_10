import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SchnorrButton from "./SchnorrButton";
import E2eeButton from "./E2eeButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='flex flex-col p-4 border-r border-slate-500'>
			<SearchInput />
			<div className='px-3 divider'></div>
			<Conversations />
			<div className='px-3 divider'></div>
			<E2eeButton />
			<div className='px-3 divider'></div>
			<SchnorrButton />
			<div className='px-3 divider'></div>
			<LogoutButton />
		</div>
	);
};
export default Sidebar;