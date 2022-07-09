import { FC } from "react";
import { useSpring, animated } from "react-spring";
import { IMessage } from "../../../lib/types";
import { useUser } from "../../../States/User";

export const Message: FC<IMessage> = ({ content, from_id, to_id }) => {
	const user = useUser((state) => state.currentUser);
	const selected = useUser((state) => state.selectedUser);

	const props = useSpring({
		from: {
			opacity: 0,
			top: 10,
		},
		to: {
			opacity: 1,
			top: 0,
		},
	});

	return (
		<animated.div
			style={props}
			className={`message ${from_id == user.id ? "mine" : ""}`}
		>
			{from_id == user.id ? (
				<img src={user.photoUrl} alt={user.name} />
			) : (
				<img src={selected.photoUrl} alt={selected.name} />
			)}
			<span>{content?.text}</span>
		</animated.div>
	);
};
