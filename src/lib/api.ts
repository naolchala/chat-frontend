import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { IOtherUser, useUser } from "../States/User";

export const apiUrl = "https://chat-backend-naol.herokuapp.com/";

export const useContacts = () => {
	const user = useUser((state) => state.currentUser);
	return useQuery("contacts", async () => {
		const contacts: IOtherUser[] = await axios.get(
			`${apiUrl}/user/contacts`,
			{
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			}
		);

		return contacts;
	});
};

export const useFetch = <T extends unknown>(
	fetchFunction: () => Promise<any>
): [T, boolean, any] => {
	const [data, setData] = useState(null as T);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetchFunction()
			.then((res) => {
				setLoading(false);
				setData(res.data);
			})
			.catch((err) => {
				setLoading(false);
				setError(err.data);
			});
	}, []);

	return [data, loading, error];
};

export const searchPerson = async (email: string) => {
	const people: IOtherUser[] = await axios
		.get<IOtherUser[]>(`${apiUrl}/user/search?email=${email}`)
		.then((res) => res.data);
	console.log({ people });
	return people;
};
